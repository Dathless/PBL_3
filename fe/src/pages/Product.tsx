import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Share2, ChevronRight, ShoppingCart } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useBuyNow } from "@/contexts/buy-now-context"
import { useToast } from "@/hooks/use-toast"
import { productApi } from "@/lib/api"

// Helper function to parse JSON string to array
function parseJsonArray(jsonString: string | null | undefined): string[] {
  if (!jsonString) return []
  try {
    const parsed = JSON.parse(jsonString)
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item && item.trim() !== "")
    }
    return []
  } catch {
    return []
  }
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [actionType, setActionType] = useState<"add-to-cart" | "buy-now" | null>(null)
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const { setBuyNowProduct } = useBuyNow()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Redirect seller to seller dashboard
  useEffect(() => {
    if (!authLoading && user?.role === "seller") {
      navigate("/seller/dashboard", { replace: true })
    }
  }, [user, authLoading, navigate])

  // Load product from backend
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const products = await productApi.getAll()
        console.log("Products: " + JSON.stringify(products))
        const productData = products.find((p: any) => p.id === id)

        if (!productData) {
          setProduct(null);
          setLoading(false);
          return;
        }
        
        // Parse size and color from JSON strings
        const sizes = parseJsonArray(productData.size)
        const colors = parseJsonArray(productData.color)
        
        // Get first image or placeholder
        const imageUrl = productData.images && productData.images.length > 0 
          ? productData.images[0].imageUrl 
          : "/placeholder.svg"
        
        setProduct({
          ...productData,
          sizes,
          colors,
          image: imageUrl,
        })
        
        // Set default selections
        if (colors.length > 0) {
          setSelectedColor(colors[0])
        }
        if (sizes.length > 0) {
          setSelectedSize(sizes[0])
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load product",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [id])

  // Update selected color and size when product changes
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0 && !product.colors.includes(selectedColor)) {
        setSelectedColor(product.colors[0])
      }
      if (product.sizes && product.sizes.length > 0 && !product.sizes.includes(selectedSize)) {
        setSelectedSize(product.sizes[0])
      }
    }
  }, [product, selectedColor, selectedSize])

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <TopBanner />
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>Loading product...</p>
        </div>
        <LiteFooter />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <TopBanner />
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>Product not found</p>
          <Link to="/" className="text-cyan-600 hover:text-cyan-700">Go back home</Link>
        </div>
        <LiteFooter />
      </main>
    )
  }

  const handleAddToCart = async () => {
    if (user?.role === "seller") {
      toast({ title: "Not allowed", description: "Seller accounts cannot add items to cart.", variant: "destructive" })
      return
    }
    if (!isAuthenticated) {
      setActionType("add-to-cart")
      setShowLoginModal(true)
      return
    }
    try {
      await addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      })
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = () => {
    if (user?.role === "seller") {
      toast({ title: "Not allowed", description: "Seller accounts cannot purchase.", variant: "destructive" })
      return
    }
    if (!isAuthenticated) {
      setActionType("buy-now")
      setShowLoginModal(true)
      return
    }
    // Save product to context and navigate with only ID
    setBuyNowProduct({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
    })
    navigate(`/buy-now?id=${product.id}`)
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    if (!actionType) return
    try {
      const payload =
        actionType === "add-to-cart"
          ? {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              color: selectedColor,
              size: selectedSize,
            }
          : {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            }
      localStorage.setItem(
        "pendingAction",
        JSON.stringify({ type: actionType, product: payload })
      )
    } catch (e) {
      console.error("Failed to persist pending action", e)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
        actionType={actionType}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <Link to="/" className="hover:text-cyan-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/categories" className="hover:text-cyan-600">
            Categories
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="bg-gray-100 rounded-lg aspect-square mb-6 overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 0 && (
              <div className="mt-4 h-28 overflow-x-auto">
                <div className="flex gap-3 h-full">

                  {product.images.map((img: any, index: number) => (
                    <div
                      key={img.id || index}
                      className="bg-gray-100 rounded-lg w-28 h-28 overflow-hidden cursor-pointer hover:ring-2 ring-cyan-500 shrink-0"
                      onClick={() => {
                        const newImage = img.imageUrl || "/placeholder.svg"
                        setProduct({ ...product, image: newImage })
                      }}
                    >
                      <img
                        src={img.imageUrl || "/placeholder.svg"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-red-600">${Number(product.price).toFixed(2)}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3">COLOR</h3>
                <div className="flex gap-3">
                  {product.colors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition ${
                        selectedColor === color ? "border-cyan-500" : "border-gray-300 hover:border-gray-400"
                      } bg-gray-200`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3">SIZE</h3>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded border-2 font-semibold transition ${
                        selectedSize === size
                          ? "border-cyan-500 bg-cyan-50 text-cyan-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and CTA */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100">
                  +
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-cyan-500 text-white py-3 rounded-full font-bold hover:bg-cyan-600 transition flex items-center justify-center gap-2"
                >
                  BUY NOW - ${Number(product.price).toFixed(2)}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-full font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>ADD</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition">
                <Share2 className="w-5 h-5" />
                <span className="font-semibold">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products - Can be loaded from backend if needed */}
      </div>

      <LiteFooter />
    </main>
  )
}

