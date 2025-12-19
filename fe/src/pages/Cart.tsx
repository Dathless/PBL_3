import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 10
  const total = subtotal + shipping

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      await updateQuantity(cartItemId, newQuantity)
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId)
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.cartItemId || item.id} className="border border-gray-200 rounded-lg p-4 flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      {(item.color || item.size) && (
                        <p className="text-sm text-gray-500">
                          {item.color && `${item.color}`}
                          {item.color && item.size && " • "}
                          {item.size && `Size ${item.size}`}
                        </p>
                      )}
                      <p className="font-bold text-red-600 mt-2">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => item.cartItemId && handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => item.cartItemId && handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => item.cartItemId && handleRemove(item.cartItemId)} className="text-red-600 hover:text-red-700 p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">${shipping}</span>
                </div>
              </div>
              <div className="flex justify-between mb-6 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-red-600">${total}</span>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition text-center block"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/"
                className="w-full mt-3 border border-cyan-500 text-cyan-600 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="group">
                <Link to={`/product/${i}`} className="block">
                  <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden">
                    <img
                      src={`/generic-product-display.png?height=200&width=200&query=product ${i}`}
                      alt={`Product ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-cyan-600">Product {i}</p>
                  <p className="text-red-600 font-bold">$89</p>
                </Link>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/product/${i}`)}
                    className="text-xs bg-cyan-500 text-white py-1.5 rounded-full font-bold hover:bg-cyan-600 transition text-center"
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => navigate(`/product/${i}`)}
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

