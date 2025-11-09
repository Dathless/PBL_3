import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useBuyNow } from "@/contexts/buy-now-context"
import { AddToCartModal } from "@/components/add-to-cart-modal"

interface Product {
  id: number
  name: string
  image: string
  price: number
  originalPrice: number
  discount: number
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const flashSaleProducts: Product[] = [
  {
    id: 4,
    name: "LONG-SLEEVED BLOUSE",
    image: "/long-sleeved-blouse.jpg",
    price: 45,
    originalPrice: 75,
    discount: 40,
  },
  {
    id: 5,
    name: "ROLEX DAY-DATE 40",
    image: "/rolex-daydate-watch.jpg",
    price: 35000,
    originalPrice: 45000,
    discount: 22,
  },
  {
    id: 6,
    name: "DIOR APRES-SKI BOOT",
    image: "/dior-ski-boot.jpg",
    price: 1200,
    originalPrice: 1800,
    discount: 33,
  },
  {
    id: 7,
    name: "BALENCIAGA WOMENS BAG",
    image: "/balenciaga-bag.jpg",
    price: 1800,
    originalPrice: 2500,
    discount: 28,
  },
  {
    id: 8,
    name: "GUCCI CHAIN BELT",
    image: "/gucci-chain-belt.jpg",
    price: 650,
    originalPrice: 950,
    discount: 32,
  },
  {
    id: 3,
    name: "DIOR WOMENS BELT WITH CHAIN",
    image: "/dior-womens-belt.jpg",
    price: 3400,
    originalPrice: 5000,
    discount: 32,
  },
  {
    id: 9,
    name: "GUCCI SLING CLUTCH WOMEN WITH CHAIN",
    image: "/gucci-clutch.jpg",
    price: 6200,
    originalPrice: 9000,
    discount: 31,
  },
  {
    id: 10,
    name: "DIOR BAG SADDLE QUILTED",
    image: "/dior-saddle-bag.jpg",
    price: 5200,
    originalPrice: 7500,
    discount: 31,
  },
]

export default function OffersPage() {
  const navigate = useNavigate()
  const { setBuyNowProduct } = useBuyNow()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 2,
    hours: 15,
    minutes: 30,
    seconds: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
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
                days = 2
                hours = 15
                minutes = 30
                seconds = 45
              }
            }
          }
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleBuy = (product: Product) => {
    setBuyNowProduct({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    })
    navigate(`/buy-now?id=${product.id}`)
  }

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Flash Sale Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">⚡ FLASH SALE ⚡</h1>
              <p className="text-lg opacity-90">Limited Time Offers - Up to 50% OFF</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm opacity-80 mb-1">Ends in:</p>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px] text-center">
                    <div className="text-2xl font-bold">{String(timeLeft.days).padStart(2, "0")}</div>
                    <div className="text-xs opacity-80">Days</div>
                  </div>
                  <span className="text-xl">:</span>
                  <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px] text-center">
                    <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
                    <div className="text-xs opacity-80">Hours</div>
                  </div>
                  <span className="text-xl">:</span>
                  <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px] text-center">
                    <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
                    <div className="text-xs opacity-80">Mins</div>
                  </div>
                  <span className="text-xl">:</span>
                  <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px] text-center">
                    <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
                    <div className="text-xs opacity-80">Secs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition">
              <div className="relative aspect-square bg-gray-200 overflow-hidden">
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  -{product.discount}%
                </span>
                <span className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded z-10">
                  FLASH SALE
                </span>
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </Link>
              </div>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 hover:text-cyan-600 transition">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-red-600 font-bold text-lg">SAR {product.price.toLocaleString()}</span>
                  <span className="text-gray-400 line-through text-sm">SAR {product.originalPrice.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuy(product)}
                    className="w-full bg-cyan-500 text-white py-2 rounded-full font-bold text-xs hover:bg-cyan-600 transition text-center"
                  >
                    BUY NOW
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full border border-blue-500 text-blue-600 py-2 rounded-full font-bold text-xs hover:bg-blue-50 transition flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Offers Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
              <p className="mb-4 opacity-90">Get 30% off on all new arrivals</p>
              <Link
                to="/categories"
                className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Best Sellers</h3>
              <p className="mb-4 opacity-90">Top rated products with special prices</p>
              <Link
                to="/categories"
                className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

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

      <LiteFooter />
    </main>
  )
}

