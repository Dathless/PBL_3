"use client"

import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useBuyNow } from "@/contexts/buy-now-context"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"
import { useState } from "react"

type Product = {
  id: number
  name: string
  price: number
  image: string
  rating: number
  reviews: number
}

const brandProducts: Record<string, Product[]> = {
  zara: Array.from({ length: 12 }, (_, i) => ({
    id: 1001 + i,
    name: `Zara ${["Classic", "Modern", "Elegant", "Trendy"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 200) + 30,
    image: `/placeholder.svg?height=250&width=250&query=zara ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 500) + 20,
  })),
  dg: Array.from({ length: 12 }, (_, i) => ({
    id: 1101 + i,
    name: `D&G ${["Luxury", "Premium", "Designer", "Exclusive"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 500) + 200,
    image: `/placeholder.svg?height=250&width=250&query=dg ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 300) + 10,
  })),
  hm: Array.from({ length: 12 }, (_, i) => ({
    id: 1201 + i,
    name: `H&M ${["Casual", "Street", "Urban", "Style"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 20,
    image: `/placeholder.svg?height=250&width=250&query=hm ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 500) + 20,
  })),
  chanel: Array.from({ length: 12 }, (_, i) => ({
    id: 1301 + i,
    name: `Chanel ${["Classic", "Timeless", "Elegant", "Luxury"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 500,
    image: `/placeholder.svg?height=250&width=250&query=chanel ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 200) + 10,
  })),
  prada: Array.from({ length: 12 }, (_, i) => ({
    id: 1401 + i,
    name: `Prada ${["Designer", "Luxury", "Premium", "Exclusive"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 800) + 400,
    image: `/placeholder.svg?height=250&width=250&query=prada ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 250) + 10,
  })),
  biba: Array.from({ length: 12 }, (_, i) => ({
    id: 1501 + i,
    name: `Biba ${["Fashion", "Trendy", "Modern", "Style"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 150) + 40,
    image: `/placeholder.svg?height=250&width=250&query=biba ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 400) + 20,
  })),
  adidas: Array.from({ length: 12 }, (_, i) => ({
    id: 2001 + i,
    name: `Adidas ${["Samba", "Stan Smith", "Ultra Boost", "NMD"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 150) + 50,
    image: `/placeholder.svg?height=250&width=250&query=adidas shoes ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 500) + 20,
  })),
  nike: Array.from({ length: 12 }, (_, i) => ({
    id: 3001 + i,
    name: `Nike ${["Air Force 1", "Jordan 1", "Dunk", "Air Max"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 150) + 60,
    image: `/placeholder.svg?height=250&width=250&query=nike shoes ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 500) + 20,
  })),
  dior: Array.from({ length: 12 }, (_, i) => ({
    id: 4001 + i,
    name: `Dior ${["Saddle", "Book Tote", "Caro", "Bobby"][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 300) + 200,
    image: `/placeholder.svg?height=250&width=250&query=dior luxury ${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    reviews: Math.floor(Math.random() * 300) + 10,
  })),
}

export default function BrandPage({ params }: { params: { name: string } }) {
  // Normalize the incoming brand param so labels like "D&G" or "H&M"
  // (which may contain special characters) map to keys like "dg" and "hm".
  const rawName = params.name
  const key = rawName.toLowerCase().replace(/[^a-z0-9]/g, "")
  const products = brandProducts[key] ?? []
  // Build a nicer display name from the raw param (e.g. "d-g" -> "D G", "d&g" -> "D&G")
  const brandName = rawName
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
  const router = useRouter()
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
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    })
    router.push(`/buy-now?id=${product.id}`)
  }

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      setSelectedProduct(product)
      setActionType("add-to-cart")
      setShowLoginModal(true)
      return
    }
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng.`,
    })
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    if (selectedProduct) {
      if (actionType === "buy-now") {
        setBuyNowProduct({
          id: selectedProduct.id.toString(),
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
        })
        router.push(`/buy-now?id=${selectedProduct.id}`)
      } else if (actionType === "add-to-cart") {
        addToCart({
          id: selectedProduct.id.toString(),
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
        })
        toast({
          title: "Đã thêm vào giỏ hàng",
          description: `${selectedProduct.name} đã được thêm vào giỏ hàng.`,
        })
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="group">
              <Link href={`/product/${p.id}`} className="block">
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
                <div className="flex items-center gap-1 my-1">
                  <div className="flex gap-0.5">
                    {Array(Math.max(0, Math.min(5, p.rating)))
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xs">
                          ★
                        </span>
                      ))}
                  </div>
                  <span className="text-xs text-gray-500">({p.reviews})</span>
                </div>
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
      </div>
      <LiteFooter />
    </main>
  )
}
