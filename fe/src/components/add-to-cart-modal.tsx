"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"
import { productApi, ApiProduct } from "@/lib/api"

interface Product {
  id: string | number
  name: string
  price: number
  image: string
  colors?: string[]
  sizes?: string[]
}

interface AddToCartModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fullProduct, setFullProduct] = useState<ApiProduct | null>(null)
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [currentStock, setCurrentStock] = useState<number>(0)

  const { isAuthenticated, user } = useAuth()
  const { addToCart } = useCart()
  const { toast } = useToast()

  // Fetch full product details including variants when modal opens
  useEffect(() => {
    const fetchDetails = async () => {
      if (!isOpen || !product) return

      try {
        setLoading(true)
        const detailedProduct = await productApi.getById(product.id.toString())
        setFullProduct(detailedProduct)

        // Process variants to get unique colors and sizes
        if (detailedProduct.variants && detailedProduct.variants.length > 0) {
          const colors = Array.from(new Set(detailedProduct.variants.map(v => v.color).filter(Boolean)))
          const sizes = Array.from(new Set(detailedProduct.variants.map(v => v.size).filter(Boolean)))

          setAvailableColors(colors.length > 0 ? colors : ["default"])
          setAvailableSizes(sizes.length > 0 ? sizes : ["One Size"])

          // Initial selection
          const firstColor = colors.length > 0 ? colors[0] : "default"
          const firstSize = sizes.length > 0 ? sizes[0] : "One Size"
          setSelectedColor(firstColor)
          setSelectedSize(firstSize)
        } else {
          // Fallback for products without variants
          setAvailableColors([detailedProduct.color || "default"])
          setAvailableSizes([detailedProduct.size || "One Size"])
          setSelectedColor(detailedProduct.color || "default")
          setSelectedSize(detailedProduct.size || "One Size")
          setCurrentStock(detailedProduct.stock)
        }
      } catch (error) {
        console.error("Error fetching product details for modal:", error)
        toast({ title: "Error", description: "Could not load product details.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [isOpen, product?.id, toast])

  // Update current stock based on selection
  useEffect(() => {
    if (!fullProduct) return

    if (fullProduct.variants && fullProduct.variants.length > 0) {
      const variant = fullProduct.variants.find(v =>
        (v.color === selectedColor || (!v.color && selectedColor === "default")) &&
        (v.size === selectedSize || (!v.size && selectedSize === "One Size"))
      )
      setCurrentStock(variant ? variant.stock : 0)
    } else {
      setCurrentStock(fullProduct.stock)
    }
  }, [selectedColor, selectedSize, fullProduct])

  const handleAddToCart = () => {
    if (user?.role === "seller") {
      toast({ title: "Not allowed", description: "Seller accounts cannot add items to cart.", variant: "destructive" })
      return
    }
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (!product || !fullProduct) return

    if (currentStock <= 0) {
      toast({
        title: "Out of stock",
        description: "The selected combination is currently unavailable.",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor === "default" ? undefined : selectedColor,
      size: selectedSize === "One Size" ? undefined : selectedSize,
    }).then(() => {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
      onClose()
    }).catch(err => {
      toast({
        title: "Cannot add to cart",
        description: err.message,
        variant: "destructive"
      })
    })
  }

  if (!isOpen || !product) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {loading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mb-2" />
              <p className="text-sm font-medium text-gray-500">Updating options...</p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-bold">Add to Cart</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Product Info */}
            <div className="flex gap-4 mb-6">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-100"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-cyan-600">${product.price.toLocaleString()}</p>
                </div>
                <p className={`text-xs font-bold mt-1 ${currentStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {currentStock > 0 ? `Available Stock: ${currentStock}` : 'Sold Out'}
                </p>
              </div>
            </div>

            {/* Color Selection */}
            {availableColors.length > 0 && !(availableColors.length === 1 && availableColors[0] === "default") && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Color: <span className="text-gray-500 font-normal">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition text-sm ${selectedColor === color
                        ? "border-cyan-600 bg-cyan-50 text-cyan-600 font-semibold"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && !(availableSizes.length === 1 && availableSizes[0] === "One Size") && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Size: <span className="text-gray-500 font-normal">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition text-sm ${selectedSize === size
                        ? "border-cyan-600 bg-cyan-50 text-cyan-600 font-semibold"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={currentStock <= 0 || loading}
              className={`w-full py-4 rounded-xl font-bold transition-all shadow-md ${currentStock <= 0 || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-cyan-600 text-white hover:bg-cyan-700 active:scale-95"
                }`}
            >
              {loading ? "Please wait..." : currentStock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={() => {
          setShowLoginModal(false)
          handleAddToCart()
        }}
        actionType="add-to-cart"
      />
    </>
  )
}

