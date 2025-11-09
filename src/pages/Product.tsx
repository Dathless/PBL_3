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

// Product database
const productsDatabase: Record<string, {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  colors: string[]
  sizes: string[]
  description: string
}> = {
  "1": {
    id: "1",
    name: "ADIDAS SAMBA OG SHOES",
    price: 89,
    originalPrice: 129,
    discount: 31,
    rating: 4.5,
    reviews: 1250,
    image: "/adidas-samba-white-shoes.jpg",
    colors: ["white", "black", "gray", "navy"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    description: "The classic Adidas Samba OG returns with its iconic silhouette. Featuring premium materials, superior comfort, and timeless style that works for any occasion.",
  },
  "2": {
    id: "2",
    name: "NIKE AIR FORCE 1",
    price: 120,
    originalPrice: 150,
    discount: 20,
    rating: 4.7,
    reviews: 2100,
    image: "/nike-air-force-sneakers.jpg",
    colors: ["white", "black", "red", "blue"],
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    description: "The Nike Air Force 1 is a timeless classic. With its clean design and comfortable cushioning, it's perfect for everyday wear.",
  },
  "3": {
    id: "3",
    name: "DIOR WOMENS BELT WITH CHAIN",
    price: 3400,
    originalPrice: 5000,
    discount: 32,
    rating: 4.4,
    reviews: 320,
    image: "/dior-womens-belt.jpg",
    colors: ["gold", "silver", "black"],
    sizes: ["S", "M", "L"],
    description: "Elegant Dior women's belt with chain details. Perfect accessory to elevate any outfit.",
  },
  "4": {
    id: "4",
    name: "LONG-SLEEVED BLOUSE",
    price: 45,
    originalPrice: 75,
    discount: 40,
    rating: 4.3,
    reviews: 890,
    image: "/long-sleeved-blouse.jpg",
    colors: ["white", "beige", "black", "navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Elegant long-sleeved blouse made from premium cotton. Perfect for both casual and formal occasions.",
  },
  "5": {
    id: "5",
    name: "ROLEX DAY-DATE 40",
    price: 35000,
    originalPrice: 45000,
    discount: 22,
    rating: 4.9,
    reviews: 120,
    image: "/rolex-daydate-watch.jpg",
    colors: ["gold", "silver", "rose gold"],
    sizes: ["40mm"],
    description: "Luxury timepiece with automatic movement. Features day and date complications. Water resistant up to 100m.",
  },
  "6": {
    id: "6",
    name: "DIOR APRES-SKI BOOT",
    price: 1200,
    originalPrice: 1800,
    discount: 33,
    rating: 4.4,
    reviews: 280,
    image: "/dior-ski-boot.jpg",
    colors: ["black", "white", "brown"],
    sizes: ["38", "39", "40", "41", "42"],
    description: "Premium ski boots from Dior. Designed for comfort and performance on the slopes.",
  },
  "7": {
    id: "7",
    name: "BALENCIAGA WOMENS BAG",
    price: 1800,
    originalPrice: 2500,
    discount: 28,
    rating: 4.5,
    reviews: 420,
    image: "/balenciaga-bag.jpg",
    colors: ["black", "brown", "beige"],
    sizes: ["One Size"],
    description: "Luxury handbag from Balenciaga. Features iconic design and premium materials.",
  },
  "8": {
    id: "8",
    name: "GUCCI CHAIN BELT",
    price: 650,
    originalPrice: 950,
    discount: 32,
    rating: 4.6,
    reviews: 350,
    image: "/gucci-chain-belt.jpg",
    colors: ["gold", "silver", "black"],
    sizes: ["S", "M", "L"],
    description: "Elegant chain belt from Gucci. Perfect accessory to elevate any outfit.",
  },
  "9": {
    id: "9",
    name: "GUCCI SLING CLUTCH WOMEN WITH CHAIN",
    price: 6200,
    originalPrice: 9000,
    discount: 31,
    rating: 4.5,
    reviews: 280,
    image: "/gucci-clutch.jpg",
    colors: ["black", "brown", "beige"],
    sizes: ["One Size"],
    description: "Luxury clutch bag from Gucci with elegant chain strap. Perfect for evening events.",
  },
  "10": {
    id: "10",
    name: "DIOR BAG SADDLE QUILTED",
    price: 5200,
    originalPrice: 7500,
    discount: 31,
    rating: 4.7,
    reviews: 190,
    image: "/dior-saddle-bag.jpg",
    colors: ["black", "brown", "beige"],
    sizes: ["One Size"],
    description: "Iconic Dior Saddle bag with quilted design. A timeless piece from the House of Dior.",
  },
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [selectedColor, setSelectedColor] = useState("white")
  const [selectedSize, setSelectedSize] = useState("42")
  const [quantity, setQuantity] = useState(1)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [actionType, setActionType] = useState<"add-to-cart" | "buy-now" | null>(null)
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { setBuyNowProduct } = useBuyNow()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Get product by ID or use default
  const productId = id || "1"
  const product = productsDatabase[productId] || productsDatabase["1"]
  
  // Update selected color and size when product changes
  useEffect(() => {
    if (product.colors.length > 0 && !product.colors.includes(selectedColor)) {
      setSelectedColor(product.colors[0])
    }
    if (product.sizes.length > 0 && !product.sizes.includes(selectedSize)) {
      setSelectedSize(product.sizes[0])
    }
  }, [productId, product.colors, product.sizes, selectedColor, selectedSize])

  // Get related products (all products except current one)
  const relatedProducts = Object.values(productsDatabase)
    .filter((p) => p.id !== productId)
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
    }))

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setActionType("add-to-cart")
      setShowLoginModal(true)
      return
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor,
      size: selectedSize,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setActionType("buy-now")
      setShowLoginModal(true)
      return
    }
    // Save product to context and navigate with only ID
    setBuyNowProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    navigate(`/buy-now?id=${product.id}`)
  }

  const handleLoginConfirm = () => {
    setShowLoginModal(false)
    // After login, perform the action
    if (actionType === "buy-now") {
      setBuyNowProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
      navigate(`/buy-now?id=${product.id}`)
    } else if (actionType === "add-to-cart") {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        color: selectedColor,
        size: selectedSize,
      })
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
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
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-lg aspect-square overflow-hidden cursor-pointer hover:ring-2 ring-cyan-500"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} view ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {Array(Math.floor(product.rating))
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-red-600">${product.price}</span>
                <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-3">COLOR</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
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

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-3">SIZE</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => (
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
                  BUY NOW - ${product.price}
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

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <div key={prod.id} className="group">
                <Link to={`/product/${prod.id}`} className="block">
                  <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden">
                    <img
                      src={prod.image || "/placeholder.svg"}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-800 group-hover:text-cyan-600">{prod.name}</h3>
                  <p className="text-red-600 font-bold">${prod.price}</p>
                </Link>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => {
                      navigate(`/product/${prod.id}`)
                    }}
                    className="text-xs bg-cyan-500 text-white py-1.5 rounded-full font-bold hover:bg-cyan-600 transition text-center"
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/product/${prod.id}`)
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
      </div>

      <LiteFooter />
    </main>
  )
}

