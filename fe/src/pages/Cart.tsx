import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { Trash2, Plus, Minus, ShoppingCart, Percent, Ticket } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useCart, type Promotion } from "@/contexts/cart-context"
import { promotionApi } from "@/lib/api"

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    selectedCartItemIds,
    toggleSelectItem,
    toggleSelectAll,
    appliedPromotion,
    setAppliedPromotion,
    getSelectedItems,
    addToCart
  } = useCart()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState("")
  const [availablePromotions, setAvailablePromotions] = useState<Promotion[]>([])
  const [showPromoList, setShowPromoList] = useState(false)
  const [productsForYou, setProductsForYou] = useState<any[]>([])

  const selectedItems = getSelectedItems()
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = selectedItems.length > 0 ? 5 : 0

  const total = getTotalPrice() + shipping

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promos = await promotionApi.getAll()
        setAvailablePromotions(promos.filter(p => p.active))
      } catch (err) {
        console.error("Failed to fetch promos", err)
      }
    }

    const fetchProductsForYou = async () => {
      try {
        // Get top selling or random products
        const products = await import("@/lib/api").then(m => m.productApi.getTopSelling(5))
        setProductsForYou(products)
      } catch (err) {
        console.error("Failed to fetch products for you", err)
      }
    }

    fetchPromos()
    fetchProductsForYou()
  }, [])

  const handleApplyPromo = () => {
    const promo = availablePromotions.find(p => p.name.toLowerCase() === promoCode.toLowerCase())
    if (promo) {
      setAppliedPromotion(promo)
      setPromoCode("")
    } else {
      alert("Invalid promotion code")
    }
  }

  const isAllSelected = cartItems.length > 0 && selectedCartItemIds.size === cartItems.length

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
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Your cart is empty</p>
                <Link to="/" className="text-cyan-600 font-bold mt-4 inline-block hover:underline">
                  Go Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-700">Select All ({cartItems.length} items)</span>
                </div>

                {cartItems.map((item) => (
                  <div key={item.cartItemId || item.id} className="border border-gray-200 rounded-xl p-4 flex gap-4 transition-all hover:shadow-md">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.cartItemId ? selectedCartItemIds.has(item.cartItemId) : false}
                        onChange={() => item.cartItemId && toggleSelectItem(item.cartItemId)}
                        className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                      />
                    </div>

                    <Link to={`/product/${item.productId}`} className="shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/product/${item.productId}`} className="font-bold text-gray-800 hover:text-cyan-600 transition">
                          {item.name}
                        </Link>
                        {(item.color || item.size) && (
                          <div className="flex gap-2 mt-1">
                            {item.color && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="font-black text-red-600">${item.price}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => item.cartItemId && handleRemove(item.cartItemId)}
                        className="text-gray-400 hover:text-red-600 transition p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button
                          onClick={() => item.cartItemId && handleUpdateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 hover:bg-white hover:shadow-sm rounded transition disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-3 font-bold text-sm min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => item.cartItemId && handleUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 hover:bg-white hover:shadow-sm rounded transition"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-2xl p-6 sticky top-24 bg-white shadow-lg shadow-gray-100">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                Order Summary
                {selectedItems.length > 0 && <span className="bg-cyan-100 text-cyan-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{selectedItems.length} selected</span>}
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Shipping Fee</span>
                  <span className="font-bold text-gray-800">${shipping.toFixed(2)}</span>
                </div>

                {appliedPromotion && (
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs font-bold text-green-700">{appliedPromotion.name}</p>
                        <p className="text-[10px] text-green-600">-{appliedPromotion.discountPercent}% off</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAppliedPromotion(null)}
                      className="text-green-700 hover:text-red-500 transition text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              {!appliedPromotion && (
                <div className="mb-6 relative">
                  <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Promotion</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Enter code..."
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition"
                    >
                      Apply
                    </button>
                  </div>

                  <button
                    onClick={() => setShowPromoList(!showPromoList)}
                    className="text-[10px] font-bold text-cyan-600 mt-2 flex items-center gap-1 hover:underline"
                  >
                    {showPromoList ? 'Hide available offers' : 'View all available offers'}
                  </button>

                  {showPromoList && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                      {availablePromotions.length === 0 ? (
                        <p className="text-[10px] text-gray-400">No active promotions</p>
                      ) : (
                        availablePromotions.map(promo => (
                          <div
                            key={promo.id}
                            className="p-2 border border-dashed border-gray-300 rounded-lg bg-white hover:border-cyan-500 cursor-pointer transition group"
                            onClick={() => {
                              setAppliedPromotion(promo)
                              setShowPromoList(false)
                            }}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[11px] font-black text-gray-800 group-hover:text-cyan-600">{promo.name}</span>
                              <span className="bg-red-50 text-red-600 text-[9px] font-black px-1.5 py-0.5 rounded">-{promo.discountPercent}%</span>
                            </div>
                            <p className="text-[9px] text-gray-500 line-clamp-1">{promo.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mb-8">
                <div>
                  <span className="font-black text-gray-800 tracking-tighter uppercase text-xs">Total Amount</span>
                  <div className="text-2xl font-black text-red-600 tracking-tight">
                    ${total.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                disabled={selectedItems.length === 0}
                onClick={() => navigate("/checkout")}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-lg hover:bg-red-700 transition shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <span className="text-sm opacity-60">({selectedItems.length})</span>
              </button>

              <Link
                to="/"
                className="w-full mt-3 border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition text-center block text-sm"
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
            {productsForYou.map((product) => (
              <div key={product.id} className="group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="bg-gray-100 rounded-lg aspect-square mb-3 overflow-hidden relative">
                    {Number(product.discount) > 0 && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                        -{product.discount}%
                      </span>
                    )}
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <p className="font-semibold text-sm text-gray-800 group-hover:text-cyan-600 line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-red-600 font-bold">${(Number(product.price) * (1 - Number(product.discount || 0) / 100)).toFixed(2)}</p>
                    {Number(product.discount) > 0 && (
                      <p className="text-gray-400 text-xs line-through">${product.price}</p>
                    )}
                  </div>
                </Link>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-xs bg-cyan-500 text-white py-1.5 rounded-full font-bold hover:bg-cyan-600 transition text-center"
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        productId: product.id,
                        quantity: 1,
                        name: product.name,
                        price: Number(product.price),
                        image: product.image,
                      })
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

