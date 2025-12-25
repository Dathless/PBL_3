import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useBuyNow } from "@/contexts/buy-now-context"
import { AddToCartModal } from "@/components/add-to-cart-modal"
import { productApi } from "@/lib/api"

const categoryData: Record<string, { name: string }> = {
  "t-shirt": { name: "T-Shirt" },
  jacket: { name: "Jacket" },
  pants: { name: "Pants" },
  shoes: { name: "Shoes" },
  watches: { name: "Watches" },
  bag: { name: "Bag" },
  accessory: { name: "Accessories" },
}



interface Product {
  id: string
  name: string
  price: number
  image: string
  originalPrice: number
  discount: number
}

export default function CategoryPage() {
  const { type } = useParams<{ type: string }>()
  const categoryKey = type?.toLowerCase() || ""
  const category = categoryData[categoryKey]
  const [sortBy, setSortBy] = useState("newest")
  const navigate = useNavigate()
  const { setBuyNowProduct } = useBuyNow()
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; price: number; image: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryProducts, setCategoryProducts] = useState<Array<{
    id: string
    name: string
    price: number
    image: string
    originalPrice: number
    discount: number
  }>>([])
  const [loading, setLoading] = useState(true)

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // FIX: Use new API to get products by category name
        const fetchedProducts = await productApi.getByCategoryName(categoryKey);

        // Mapping data returned from API
        const products: Product[] = fetchedProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          image: p.images && p.images.length > 0 ? p.images[0].imageUrl : "/placeholder.svg",
          // Ensure these fields exist or have default values
          originalPrice: Number(p.originalPrice) || Number(p.price) * 1.3,
          discount: Number(p.discount) || 0,
        }))

        setCategoryProducts(products)
      } catch (error) {
        console.error("Error loading products:", error)
        setCategoryProducts([]) // Ensure old data is cleared if error
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [categoryKey])

  const handleBuy = (product: { id: string; name: string; price: number; image: string }) => {
    setBuyNowProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    navigate(`/buy-now?id=${product.id}`)
  }

  const handleAddToCart = (product: { id: string; name: string; price: number; image: string }) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setIsModalOpen(true)
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-white">
        <TopBanner />
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Category Not Found</h1>
        </div>
        <LiteFooter />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 uppercase">{category.name}</h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing: <strong>{categoryProducts.length} Products</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.length > 0 ? (
              categoryProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <Link to={`/product/${product.id}`}>
                      <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden relative">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-sm text-gray-800 group-hover:text-cyan-600 transition mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-red-600 font-bold text-sm mb-3">${product.price}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleBuy(product)}
                          className="w-full bg-cyan-500 text-white py-1.5 rounded-full font-bold text-xs hover:bg-cyan-600 transition text-center"
                        >
                          BUY NOW
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full border border-blue-500 text-blue-600 py-1.5 rounded-full font-bold text-xs hover:bg-blue-50 transition flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
      />

      <LiteFooter />
    </main>
  )
}

