"use client"

import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useBuyNow } from "@/contexts/buy-now-context"

interface Product {
  id: number
  name: string
  image: string
  price: string
  badge?: string
}

const products: Product[] = [
  {
    id: 7,
    name: "BALENCIAGA WOMENS 150 ML BAG YELLOW & FRONT CLIP",
    image: "/balenciaga-bag.jpg",
    price: "SAR 1200",
    badge: "SALE",
  },
  {
    id: 8,
    name: "GUCCI CHAIN BELT",
    image: "/gucci-chain-belt.jpg",
    price: "SAR 650",
  },
  {
    id: 3,
    name: "DIOR WOMENS BELT WITH CHAIN",
    image: "/dior-womens-belt.jpg",
    price: "SAR 3400",
    badge: "ON SALE",
  },
  {
    id: 9,
    name: "GUCCI SLING CLUTCH WOMEN WITH CHAIN",
    image: "/gucci-clutch.jpg",
    price: "SAR 6200",
  },
  {
    id: 2,
    name: "NIKE AIR FORCE 1",
    image: "/nike-air-force-sneakers.jpg",
    price: "SAR 120",
  },
  {
    id: 10,
    name: "DIOR BAG SADDLE QUILTED",
    image: "/dior-saddle-bag.jpg",
    price: "SAR 5200",
  },
  {
    id: 1,
    name: "ADIDAS SAMBA OG SHOES",
    image: "/adidas-samba-white-shoes.jpg",
    price: "SAR 89",
  },
  {
    id: 4,
    name: "LONG-SLEEVED BLOUSE",
    image: "/long-sleeved-blouse.jpg",
    price: "SAR 45",
  },
  {
    id: 5,
    name: "ROLEX DAY-DATE 40",
    image: "/rolex-daydate-watch.jpg",
    price: "SAR 35000",
  },
  {
    id: 6,
    name: "DIOR APRES-SKI BOOT",
    image: "/dior-ski-boot.jpg",
    price: "SAR 1200",
  },
]

export function FrequentlyBought() {
  const navigate = useNavigate()
  const { setBuyNowProduct } = useBuyNow()

  const handleBuy = (product: Product) => {
    const price = parseInt(product.price.replace("SAR ", "").replace(",", ""))
    setBuyNowProduct({
      id: product.id.toString(),
      name: product.name,
      price: price,
      image: product.image,
    })
    navigate(`/buy-now?id=${product.id}`)
  }

  const handleAddToCart = (product: Product) => {
    navigate(`/product/${product.id}`)
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

      <div className="grid grid-cols-5 gap-4">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group">
            <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition">
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
              <div className="p-3">
                <h3 className="font-bold text-xs text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                <p className="text-sm font-bold text-cyan-600 mb-2">{product.price}</p>
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
                    onClick={(e) => {
                      e.preventDefault()
                      handleAddToCart(product)
                    }}
                    className="w-full border border-blue-500 text-blue-600 py-1.5 rounded-full font-bold text-xs hover:bg-blue-50 transition flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    ADD
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
