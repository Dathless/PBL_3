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
  originalPrice: number
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface ProductTimer {
  [key: string]: TimeLeft
}

export function DealsOfDay() {
  const navigate = useNavigate()
  const { setBuyNowProduct } = useBuyNow()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [globalTime, setGlobalTime] = useState<TimeLeft>({
    days: 5,
    hours: 23,
    minutes: 57,
    seconds: 23,
  })

  const [productTimers, setProductTimers] = useState<ProductTimer>({})

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // Fetch discounted products for TODAY'S DEALS
        const discountedProducts = await productApi.getDiscounted()

        if (discountedProducts.length === 0) {
          setProducts([])
          return
        }

        // Use discounted products
        const productList: Product[] = discountedProducts.map(p => ({
          id: p.id,
          name: p.name,
          image: p.images && p.images.length > 0 ? p.images[0].imageUrl : "/placeholder.svg",
          price: Number(p.price) * (1 - Number(p.discount) / 100), // Calculate discounted price
          originalPrice: Number(p.price), // Original price before discount
        }))
        console.log("Discounted products for TODAY'S DEALS: ", productList)

        setProducts(productList.slice(0, 8))

        // Initialize timers
        setProductTimers(
          productList.slice(0, 8).reduce((acc, p) => {
            acc[p.id] = {
              days: Math.floor(Math.random() * 3),
              hours: Math.floor(Math.random() * 24),
              minutes: Math.floor(Math.random() * 60),
              seconds: Math.floor(Math.random() * 60)
            }
            return acc
          }, {} as ProductTimer)
        )
      } catch (error) {
        console.error("Error loading discounted products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalTime((prev) => {
        let { days, hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 23
              days--
              if (days < 0) {
                days = 5
              }
            }
          }
        }
        return { days, hours, minutes, seconds }
      })

      setProductTimers((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((key) => {
          let { days, hours, minutes, seconds } = updated[key]
          seconds--
          if (seconds < 0) {
            seconds = 59
            minutes--
            if (minutes < 0) {
              minutes = 59
              hours--
              if (hours < 0) {
                hours = 23
                days--
              }
            }
          }
          updated[key] = { days, hours, minutes, seconds }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">TODAY'S DEALS OF THE DAY</h2>
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
            <span>{String(globalTime.days).padStart(2, "0")}d</span>
            <span className="mx-1">:</span>
            <span>{String(globalTime.hours).padStart(2, "0")}h</span>
            <span className="mx-1">:</span>
            <span>{String(globalTime.minutes).padStart(2, "0")}m</span>
            <span className="mx-1">:</span>
            <span>{String(globalTime.seconds).padStart(2, "0")}s</span>
          </div>
          <Link
            to="/deals"
            className="bg-amber-400 text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-amber-500 transition"
          >
            VIEW ALL
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">No products available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-square bg-gray-200 overflow-hidden">
                  <span className="absolute top-2 left-2 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                  {productTimers[product.id] && (
                    <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {String(productTimers[product.id].hours).padStart(2, "0")}h{" "}
                      {String(productTimers[product.id].minutes).padStart(2, "0")}m
                    </div>
                  )}
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-cyan-600 transition">{product.name}</h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-red-600 font-bold text-sm">${Number(product.price).toFixed(2)}</span>
                  <span className="text-gray-400 line-through text-xs">${Number(product.originalPrice).toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => {
                      setBuyNowProduct({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                      navigate(`/buy-now?id=${product.id}`)
                    }}
                    className="w-full bg-cyan-500 text-white py-1.5 rounded-full font-bold text-xs hover:bg-cyan-600 transition text-center"
                  >
                    BUY NOW
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedProduct(product)
                      setIsModalOpen(true)
                    }}
                    className="w-full border border-blue-500 text-blue-600 py-1.5 rounded-full font-bold text-xs hover:bg-blue-50 transition flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    ADD
                  </button>
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
