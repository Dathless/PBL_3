import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Share2, ChevronRight, ShoppingCart, Star, MessageCircle } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { MessageModal } from "@/components/MessageModal"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useBuyNow } from "@/contexts/buy-now-context"
import { useToast } from "@/hooks/use-toast"
import { productApi, reviewApi } from "@/lib/api"
import { ProductImageZoom } from "@/components/ProductImageZoom"

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
  const [availableStock, setAvailableStock] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [actionType, setActionType] = useState<"add-to-cart" | "buy-now" | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  const [showMessageModal, setShowMessageModal] = useState(false)
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const { setBuyNowProduct } = useBuyNow()
  const navigate = useNavigate()
  const { toast } = useToast()

  const effectiveStock = availableStock > 0
    ? availableStock
    : (product?.stock > 0 && (!product?.variants || product.variants.length === 0)
      ? product.stock
      : 0);

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
        const productData = await productApi.getById(id)
        console.log("Product detail load:", productData)

        if (!productData) {
          setProduct(null)
          return
        }

        // Parse size and color from JSON strings if they are strings, otherwise use as is
        const sizes = typeof productData.size === 'string' ? parseJsonArray(productData.size) : (Array.isArray(productData.size) ? productData.size : [])
        const colors = typeof productData.color === 'string' ? parseJsonArray(productData.color) : (Array.isArray(productData.color) ? productData.color : [])

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

        // Set initial available stock
        setAvailableStock(productData.stock || 0)
      } catch (error: any) {
        console.error("Error loading product:", error)
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
  }, [id, toast])

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return
      try {
        setLoadingReviews(true)
        const reviewsData = await reviewApi.getApprovedByProduct(id)
        setReviews(reviewsData)
      } catch (error) {
        console.error("Error loading reviews:", error)
      } finally {
        setLoadingReviews(false)
      }
    }
    loadReviews()
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

  // Load variant stock when color or size changes
  useEffect(() => {
    const loadVariantStock = async () => {
      if (!product?.id) return

      try {
        const response = await productApi.getVariantStock(product.id, selectedColor, selectedSize)
        setAvailableStock(response.stock)

        // If current quantity is more than available stock, reset it
        if (quantity > response.stock) {
          setQuantity(Math.max(1, response.stock))
        }
      } catch (error) {
        console.error("Error loading variant stock:", error)
      }
    }

    if (product) {
      loadVariantStock()
    }
  }, [product?.id, selectedColor, selectedSize])

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
        quantity: quantity,
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
      quantity: quantity,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    })
    navigate(`/buy-now?id=${product.id}&quantity=${quantity}${selectedColor ? `&color=${selectedColor}` : ""}${selectedSize ? `&size=${selectedSize}` : ""}`)
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
            <ProductImageZoom
              src={product.image || "/placeholder.svg"}
              alt={product.name}
            />
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
              <div className="flex items-center gap-4 mb-3">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      ${(Number(product.price) * (1 - Number(product.discount) / 100)).toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-sm font-bold">
                      -{product.discount}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-red-600">${Number(product.price).toFixed(2)}</span>
                )}
                {(product.stock <= 0 || product.status === 'OUT_OF_STOCK') && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
                    SOLD OUT
                  </span>
                )}
              </div>

              {/* Seller Information */}
              {product.seller && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {product.seller.fullname?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sold by</p>
                      <p className="font-bold text-gray-800">{product.seller.fullname || 'Seller'}</p>
                      {product.seller.email && (
                        <p className="text-xs text-gray-500">{product.seller.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                      className={`w-10 h-10 rounded-full border-2 transition ${selectedColor === color ? "border-cyan-500" : "border-gray-300 hover:border-gray-400"
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
                      className={`py-3 rounded border-2 font-semibold transition ${selectedSize === size
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
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    disabled={quantity >= effectiveStock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {effectiveStock > 0
                    ? `${effectiveStock} available`
                    : <span className="text-red-500">Out of stock</span>}
                </span>
              </div>
              {effectiveStock > 0 && effectiveStock < 10 && (
                <p className="text-sm text-amber-600 font-medium">Only {effectiveStock} items left in stock!</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleBuyNow}
                  disabled={product?.stock <= 0 || product?.status === 'OUT_OF_STOCK' || effectiveStock <= 0}
                  className={`w-full py-3 rounded-full font-bold transition flex items-center justify-center gap-2 ${product?.stock <= 0 || product?.status === 'OUT_OF_STOCK' || effectiveStock <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-cyan-500 text-white hover:bg-cyan-600"
                    }`}
                >
                  {product?.stock <= 0 || product?.status === 'OUT_OF_STOCK' || effectiveStock <= 0 ? "OUT OF STOCK" : `BUY NOW - $${Number(product?.price).toFixed(2)}`}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={product?.stock <= 0 || product?.status === 'OUT_OF_STOCK' || effectiveStock <= 0}
                  className={`w-full py-3 rounded-full font-bold transition flex items-center justify-center gap-2 ${product?.stock <= 0 || product?.status === 'OUT_OF_STOCK' || effectiveStock <= 0
                    ? "border-2 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product?.stock <= 0 || product?.status === 'OUT_OF_STOCK' || effectiveStock <= 0 ? "OUT OF STOCK" : "ADD"}</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition">
                <Share2 className="w-5 h-5" />
                <span className="font-semibold">Share</span>
              </button>
              {product.seller && product.seller.id && user?.role !== 'seller' && (
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-cyan-500 text-cyan-600 py-3 rounded-lg hover:bg-cyan-50 transition font-semibold"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Message Seller</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        {!loading && product && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            {loadingReviews ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-gray-900">{review.userName}</p>
                        {review.sellerName && (
                          <p className="text-xs text-gray-500 mt-0.5">Shop: {review.sellerName}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString("en-US")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Products - Can be loaded from backend if needed */}
      </div>

      {/* Message Modal */}
      {product?.seller && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          sellerId={product.seller.id}
          sellerName={product.seller.fullname || 'Seller'}
          productId={product.id}
          productName={product.name}
        />
      )}

      <LiteFooter />
    </main>
  )
}

