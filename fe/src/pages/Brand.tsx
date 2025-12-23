import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useBuyNow } from "@/contexts/buy-now-context"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"
import { useState, useEffect } from "react"
import { productApi } from "@/lib/api"

type Product = {
  id: string
  name: string
  price: number
  image: string
}

export default function BrandPage() {
  const { name } = useParams<{ name: string }>()
  const rawName = name || ""
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
 
  const key = rawName.toLowerCase().replace(/[^a-z0-9]/g, "")

  // Load products from backend
  useEffect(() => {

    if (!rawName){
      setProducts([]);
      setLoading(false);
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true)
        const fetchProducts = await productApi.getByBrandName(rawName);
        // Use the single product from DB
        const productList: Product[] = fetchProducts.map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price), // Already know p.price is number thanks to ApiProduct
          image: p.images && p.images.length > 0 ? p.images[0].imageUrl : "/placeholder.svg",
        }))

        setProducts(productList)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [rawName])
  // Build a readable display name from the raw param (preserve &, spaces for UX if present)
  const brandName = rawName
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ") || key.toUpperCase()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { setBuyNowProduct } = useBuyNow()
  const { toast } = useToast()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [actionType, setActionType] = useState<"add-to-cart" | "buy-now" | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleBuy = (product: Product) => {
    if (!isAuthenticated) {
      setSelectedProduct(product)
      setActionType("buy-now")
      setShowLoginModal(true)
      return
    }
    setBuyNowProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    navigate(`/buy-now?id=${product.id}`)
  }

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setSelectedProduct(product)
      setActionType("add-to-cart")
      setShowLoginModal(true)
      return
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast({
      title: "Added to Cart",
      description: `${product.name} added to Cart.`,
    })
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    if (selectedProduct && actionType) {
      try {
        localStorage.setItem(
          "pendingAction",
          JSON.stringify({
            type: actionType,
            product: {
              id: selectedProduct.id,
              name: selectedProduct.name,
              price: selectedProduct.price,
              image: selectedProduct.image,
            },
          }),
        )
      } catch (e) {
        console.error("Failed to persist pending action", e)
      }
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
        <h1 className="text-4xl font-bold mb-2">{brandName}</h1>
        <p className="text-gray-600 mb-8">Explore our exclusive {brandName} collection</p>
        {loading ? (
          <div className="text-center py-16">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
            <div key={p.id} className="group">
              <Link to={`/product/${p.id}`} className="block">
                <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden">
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="font-semibold text-sm text-gray-800 group-hover:text-cyan-600 transition line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-red-600 font-bold">${p.price}</p>
              </Link>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleBuy(p)
                  }}
                  className="text-xs bg-cyan-500 text-white py-1.5 rounded-full font-bold hover:bg-cyan-600 transition text-center"
                >
                  BUY
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleAddToCart(p)
                  }}
                  className="text-xs border border-blue-500 text-blue-600 py-1.5 rounded-full font-bold hover:bg-blue-50 transition flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3 h-3" />
                  ADD
                </button>
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found for {brandName} brand.</p>
            <p className="text-gray-500 mt-2">Please check back later or browse other brands.</p>
          </div>
        )}
      </div>
      <LiteFooter />
    </main>
  )
}

