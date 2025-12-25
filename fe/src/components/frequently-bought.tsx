"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useBuyNow } from "@/contexts/buy-now-context"
import { AddToCartModal } from "@/components/add-to-cart-modal"
import { productApi } from "@/lib/api"

interface Product {
  id: string
  name: string
  image: string
  price: number
  badge?: string
}

export function FrequentlyBought() {
  const navigate = useNavigate()
  const { setBuyNowProduct } = useBuyNow()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // Fetch top-selling products based on analytics
        const topSellingProducts = await productApi.getTopSelling(10)
        console.log("Top Selling Products:", topSellingProducts);

        if (topSellingProducts.length === 0) {
          setProducts([])
          return
        }

        // Use top-selling products
        const productList: Product[] = topSellingProducts.map((p) => ({
          id: p.id,
          name: p.name,
          image: p.images && p.images.length > 0 ? p.images[0].imageUrl : "/placeholder.svg",
          price: Number(p.discount) > 0
            ? Number(p.price) * (1 - Number(p.discount) / 100)
            : Number(p.price), // Show discounted price if discount exists
          badge: Number(p.discount) > 0 ? `${p.discount}% OFF` : undefined
        }))
        console.log("Frequently Bought Products:", productList)

        setProducts(productList)
      } catch (error) {
        console.error("Error loading top-selling products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleBuy = (product: Product) => {
    setBuyNowProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    navigate(`/buy-now?id=${product.id}`)
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedProduct({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    })
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">FREQUENTLY BOUGHT TOGETHER</h2>
        <Link
          to="/frequently-bought"
          className="bg-amber-400 text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-amber-500 transition"
        >
          VIEW ALL
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">No products available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition">
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-square bg-gray-300 overflow-hidden">
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-xs text-gray-900 line-clamp-2 mb-2 hover:text-cyan-600 transition">{product.name}</h3>
                  </Link>
                  <p className="text-sm font-bold text-cyan-600 mb-2">${product.price}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleBuy(product)
                      }}
                      className="w-full bg-cyan-500 text-white py-1.5 rounded-full font-bold text-xs hover:bg-cyan-600 transition"
                    >
                      BUY NOW
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full border border-blue-500 text-blue-600 py-1.5 rounded-full font-bold text-xs hover:bg-blue-50 transition flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct ? {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
        } : null}
      />
    </div>
  )
}
