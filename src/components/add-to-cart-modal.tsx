"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"

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

// Product database để lấy colors và sizes
const productsDatabase: Record<string, {
  colors: string[]
  sizes: string[]
}> = {
  "1": {
    colors: ["white", "black", "gray", "navy"],
    sizes: ["40", "41", "42", "43", "44", "45"],
  },
  "2": {
    colors: ["white", "black", "red", "blue"],
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
  },
  "3": {
    colors: ["gold", "silver", "black"],
    sizes: ["S", "M", "L"],
  },
  "4": {
    colors: ["white", "beige", "black", "navy"],
    sizes: ["S", "M", "L", "XL"],
  },
  "5": {
    colors: ["gold", "silver", "rose gold"],
    sizes: ["40mm"],
  },
  "6": {
    colors: ["black", "brown", "tan"],
    sizes: ["40", "41", "42", "43", "44"],
  },
  "7": {
    colors: ["black", "brown", "beige"],
    sizes: ["One Size"],
  },
  "8": {
    colors: ["black", "brown", "tan"],
    sizes: ["One Size"],
  },
  "9": {
    colors: ["black", "brown", "beige"],
    sizes: ["One Size"],
  },
  "10": {
    colors: ["black", "brown", "tan"],
    sizes: ["One Size"],
  },
}

export function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const productId = product?.id?.toString() || ""
  const productData = productsDatabase[productId] || {
    colors: product?.colors || ["default"],
    sizes: product?.sizes || ["One Size"],
  }

  useEffect(() => {
    if (isOpen && product) {
      // Set default selections
      if (productData.colors.length > 0) {
        setSelectedColor(productData.colors[0])
      }
      if (productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0])
      }
    }
  }, [isOpen, product, productData])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (!product) return

    if (!selectedColor || !selectedSize) {
      toast({
        title: "Please select",
        description: "Please select color and size.",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: product.id.toString(),
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

    onClose()
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
          className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
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
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-cyan-600">SAR {product.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Color Selection */}
            {productData.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Color: <span className="text-gray-500 font-normal">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {productData.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedColor === color
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
            {productData.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  Size: <span className="text-gray-500 font-normal">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {productData.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selectedSize === size
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
              className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
            >
              Add to Cart
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

