import type React from "react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useShipping } from "@/contexts/shipping-context"
import { useToast } from "@/hooks/use-toast"
import { orderApi, paymentApi } from "@/lib/api"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { savedAddress, saveAddress } = useShipping()
  const { toast } = useToast()
  const [step, setStep] = useState<"shipping" | "payment" | "confirm">("shipping")
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EWALLET">("COD")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  // Load saved address on mount
  useEffect(() => {
    if (savedAddress) {
      setFormData(savedAddress)
    }
  }, [savedAddress])

  const subtotal = getTotalPrice()
  const shipping = 10
  const tax = Math.round(subtotal * 0.1 * 100) / 100
  const total = Math.round((subtotal + shipping + tax) * 100) / 100

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Requires login",
        description: "Please login to continue checkout.",
        variant: "destructive",
      })
      navigate("/login")
    }
  }, [isAuthenticated, navigate, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateShippingForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format"
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required"
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }
    if (!formData.city.trim()) {
      errors.city = "City is required"
    }
    if (!formData.postalCode.trim()) {
      errors.postalCode = "Postal code is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      // Save address for next time
      saveAddress(formData)
      setStep("payment")
    } else {
      toast({
        title: "Please fill in all information",
        description: "Please double check required fields.",
        variant: "destructive",
      })
    }
  }

  const handlePlaceOrder = async () => {
    if (!user?.id || cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Cannot place order. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Save address before placing order
      saveAddress(formData)
      
      // Build shipping address string
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.postalCode}${formData.country ? `, ${formData.country}` : ', Vietnam'}`

      // Create order
      const order = await orderApi.create({
        customerId: user.id,
        shippingAddress,
        paymentMethod,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.color || null,
          selectedSize: item.size || null,
        })),
      })

      // Create payment
      await paymentApi.create({
        orderId: order.id,
        amount: total,
        method: paymentMethod,
      })

      // Clear cart
      try {
        await clearCart()
      } catch (error: any) {
        // Log error but don't fail the order if cart clearing fails
        console.warn("Warning: Failed to clear cart after order placement:", error)
      }

      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and payment has been processed.",
      })

      navigate("/order-success", { state: { orderId: order.id } })
    } catch (error: any) {
      toast({
        title: "Error placing order",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex gap-4 mb-8">
              {(["shipping", "payment", "confirm"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                      step === s ||
                      (step === "payment" && s === "shipping") ||
                      (step === "confirm" && (s === "shipping" || s === "payment"))
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold text-gray-600 capitalize">{s}</span>
                  {i < 2 && <div className="w-8 h-0.5 bg-gray-300" />}
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            {step === "shipping" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                {savedAddress && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      ✓ Saved addresses loaded. You can edit if needed.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name *"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-2 ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-2 ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-2 ${
                      formErrors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code *"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.postalCode ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.postalCode && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleContinueToPayment}
                  className="w-full bg-cyan-500 text-white py-3 rounded-lg font-bold hover:bg-cyan-600 transition"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Info */}
            {step === "payment" && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === "COD" 
                      ? "border-cyan-500 bg-cyan-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value as "COD" | "EWALLET")}
                      className="w-4 h-4" 
                    />
                    <span className="font-semibold">Cash on Delivery (COD)</span>
                  </label>
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${
                    paymentMethod === "EWALLET" 
                      ? "border-cyan-500 bg-cyan-50" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="EWALLET"
                      checked={paymentMethod === "EWALLET"}
                      onChange={(e) => setPaymentMethod(e.target.value as "COD" | "EWALLET")}
                      className="w-4 h-4" 
                    />
                    <span className="font-semibold">E-Wallet</span>
                  </label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep("shipping")}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="flex-1 bg-cyan-500 text-white py-3 rounded-lg font-bold hover:bg-cyan-600 transition"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Order Confirmation */}
            {step === "confirm" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-semibold">✓ Order Ready to Submit</p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong>Name:</strong> {formData.firstName} {formData.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.address}, {formData.city} {formData.postalCode}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-300">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-red-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LiteFooter />
    </main>
  )
}

