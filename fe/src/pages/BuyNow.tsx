import type React from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"

import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useAuth } from "@/contexts/auth-context"
import { useBuyNow } from "@/contexts/buy-now-context"
import { useShipping } from "@/contexts/shipping-context"
import { useToast } from "@/hooks/use-toast"
import { orderApi, paymentApi } from "@/lib/api"

export default function BuyNowPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  const { getBuyNowProduct } = useBuyNow()
  const { savedAddress, saveAddress } = useShipping()
  const { toast } = useToast()
  const [step, setStep] = useState<"shipping" | "payment" | "confirm">("shipping")
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EWALLET" | "BANK_TRANSFER" | "E_WALLET" | "BANK_CARD">("COD")
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
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",
  })

  // Load saved address on mount
  useEffect(() => {
    if (savedAddress) {
      setFormData(savedAddress)
    }
  }, [savedAddress])

  // Get product info - only need ID from URL
  const productId = searchParams.get("id")
  const urlQuantity = parseInt(searchParams.get("quantity") || "1")
  const urlColor = searchParams.get("color")
  const urlSize = searchParams.get("size")

  const product = productId ? getBuyNowProduct(productId) : null
  const productName = product?.name || "Product"
  const productPrice = product?.price || 0
  const productImage = product?.image || "/placeholder.svg"
  const quantity = product?.quantity || urlQuantity
  const selectedColor = product?.color || urlColor
  const selectedSize = product?.size || urlSize

  const shipping = 5
  const tax = 0
  const total = Math.round((productPrice * quantity + shipping + tax) * 100) / 100

  // Check authentication and product
  useEffect(() => {
    if (!productId) {
      toast({
        title: "Error",
        description: "Product not found.",
        variant: "destructive",
      })
      navigate("/")
      return
    }

    if (!product) {
      toast({
        title: "Error",
        description: "Invalid product information.",
        variant: "destructive",
      })
      navigate("/")
      return
    }

    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to continue checkout.",
        variant: "destructive",
      })
      navigate(`/login?redirect=/buy-now?id=${productId}`)
    }
  }, [isAuthenticated, navigate, toast, productId, product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "cardNumber") {
      const formatted = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19)
      setCardData((prev) => ({ ...prev, [name]: formatted }))
    } else if (name === "expiryDate") {
      const formatted = value.replace(/\D/g, "").replace(/(.{2})/g, "$1/").trim().slice(0, 5)
      if (formatted.endsWith("/")) {
        setCardData((prev) => ({ ...prev, [name]: formatted.slice(0, -1) }))
      } else {
        setCardData((prev) => ({ ...prev, [name]: formatted }))
      }
    } else if (name === "cvv") {
      setCardData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "").slice(0, 3) }))
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }))
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
    if (step === "payment" && paymentMethod === "BANK_CARD") {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, "").length < 16) {
        toast({ title: "Invalid card number", variant: "destructive" })
        return
      }
      if (!cardData.expiryDate || !cardData.expiryDate.includes("/")) {
        toast({ title: "Invalid expiry date", variant: "destructive" })
        return
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        toast({ title: "Invalid CVV", variant: "destructive" })
        return
      }
      if (!cardData.cardHolder) {
        toast({ title: "Card holder name is required", variant: "destructive" })
        return
      }
    }

    if (validateShippingForm()) {
      // Save address for next time
      saveAddress(formData)
      setStep("payment")
    } else {
      toast({
        title: "Please fill in all required fields",
        description: "Please check the required fields.",
        variant: "destructive",
      })
    }
  }

  const handlePlaceOrder = async () => {
    if (!product || !productId) return
    setIsProcessing(true)
    try {
      saveAddress(formData)

      const address = formData.address.trim()
      const city = formData.city.trim()
      const postalCode = formData.postalCode.trim()
      const country = formData.country.trim()
      const shippingAddress = `${address}, ${city}, ${postalCode}, ${country}`

      // Create order
      const order = await orderApi.create({
        customerId: user?.id || "unknown",
        shippingAddress,
        paymentMethod,
        items: [{
          productId,
          quantity,
          price: productPrice,
          selectedColor,
          selectedSize,
        }],
      })

      // Create payment
      await paymentApi.create({
        orderId: order.id,
        amount: total,
        method: paymentMethod,
      })

      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. Your order is being processed.",
      })
      navigate("/order-success", { state: { orderId: order.id } })
    } catch (error: any) {
      console.error("Order placement failed:", error)
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
        <h1 className="text-3xl font-bold mb-8">QUICK CHECKOUT</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex gap-4 mb-8">
              {(["shipping", "payment", "confirm"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${step === s ||
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
                      ✓ Saved address loaded. You can edit if needed.
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
                      className={`w-full border rounded-lg px-4 py-2 ${formErrors.firstName ? "border-red-500" : "border-gray-300"
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
                      className={`w-full border rounded-lg px-4 py-2 ${formErrors.lastName ? "border-red-500" : "border-gray-300"
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
                    className={`w-full border rounded-lg px-4 py-2 ${formErrors.email ? "border-red-500" : "border-gray-300"
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
                    className={`w-full border rounded-lg px-4 py-2 ${formErrors.phone ? "border-red-500" : "border-gray-300"
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
                    className={`w-full border rounded-lg px-4 py-2 ${formErrors.address ? "border-red-500" : "border-gray-300"
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
                      list="cities-buynow"
                      placeholder="City/Province *"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 ${formErrors.city ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    <datalist id="cities-buynow">
                      <option value="Ha Noi">Ha Noi</option>
                      <option value="Ho Chi Minh City">Ho Chi Minh City</option>
                      <option value="Da Nang">Da Nang</option>
                      <option value="Hai Phong">Hai Phong</option>
                      <option value="Can Tho">Can Tho</option>
                      <option value="An Giang">An Giang</option>
                      <option value="Ba Ria - Vung Tau">Ba Ria - Vung Tau</option>
                      <option value="Bac Lieu">Bac Lieu</option>
                      <option value="Bac Giang">Bac Giang</option>
                      <option value="Bac Kan">Bac Kan</option>
                      <option value="Bac Ninh">Bac Ninh</option>
                      <option value="Ben Tre">Ben Tre</option>
                      <option value="Binh Dinh">Binh Dinh</option>
                      <option value="Binh Duong">Binh Duong</option>
                      <option value="Binh Phuoc">Binh Phuoc</option>
                      <option value="Binh Thuan">Binh Thuan</option>
                      <option value="Ca Mau">Ca Mau</option>
                      <option value="Cao Bang">Cao Bang</option>
                      <option value="Dak Lak">Dak Lak</option>
                      <option value="Dak Nong">Dak Nong</option>
                      <option value="Dien Bien">Dien Bien</option>
                      <option value="Dong Nai">Dong Nai</option>
                      <option value="Dong Thap">Dong Thap</option>
                      <option value="Gia Lai">Gia Lai</option>
                      <option value="Ha Giang">Ha Giang</option>
                      <option value="Ha Nam">Ha Nam</option>
                      <option value="Ha Tinh">Ha Tinh</option>
                      <option value="Hai Duong">Hai Duong</option>
                      <option value="Hau Giang">Hau Giang</option>
                      <option value="Hoa Binh">Hoa Binh</option>
                      <option value="Hung Yen">Hung Yen</option>
                      <option value="Khanh Hoa">Khanh Hoa</option>
                      <option value="Kien Giang">Kien Giang</option>
                      <option value="Kon Tum">Kon Tum</option>
                      <option value="Lai Chau">Lai Chau</option>
                      <option value="Lam Dong">Lam Dong</option>
                      <option value="Lang Son">Lang Son</option>
                      <option value="Lao Cai">Lao Cai</option>
                      <option value="Long An">Long An</option>
                      <option value="Nam Dinh">Nam Dinh</option>
                      <option value="Nghe An">Nghe An</option>
                      <option value="Ninh Binh">Ninh Binh</option>
                      <option value="Ninh Thuan">Ninh Thuan</option>
                      <option value="Phu Tho">Phu Tho</option>
                      <option value="Phu Yen">Phu Yen</option>
                      <option value="Quang Binh">Quang Binh</option>
                      <option value="Quang Nam">Quang Nam</option>
                      <option value="Quang Ngai">Quang Ngai</option>
                      <option value="Quang Ninh">Quang Ninh</option>
                      <option value="Quang Tri">Quang Tri</option>
                      <option value="Soc Trang">Soc Trang</option>
                      <option value="Son La">Son La</option>
                      <option value="Tay Ninh">Tay Ninh</option>
                      <option value="Thai Binh">Thai Binh</option>
                      <option value="Thai Nguyen">Thai Nguyen</option>
                      <option value="Thanh Hoa">Thanh Hoa</option>
                      <option value="Thua Thien Hue">Thua Thien Hue</option>
                      <option value="Tien Giang">Tien Giang</option>
                      <option value="Tra Vinh">Tra Vinh</option>
                      <option value="Tuyen Quang">Tuyen Quang</option>
                      <option value="Vinh Long">Vinh Long</option>
                      <option value="Vinh Phuc">Vinh Phuc</option>
                      <option value="Yen Bai">Yen Bai</option>
                    </datalist>
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
                      className={`w-full border rounded-lg px-4 py-2 ${formErrors.postalCode ? "border-red-500" : "border-gray-300"
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
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${paymentMethod === "COD" ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:border-gray-400"}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-4 h-4" />
                    <span className="font-semibold">Cash on Delivery (COD)</span>
                  </label>
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${paymentMethod === "E_WALLET" ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:border-gray-400"}`}>
                    <input type="radio" name="payment" value="E_WALLET" checked={paymentMethod === "E_WALLET"} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-4 h-4" />
                    <span className="font-semibold">E-wallet (MoMo/ZaloPay)</span>
                  </label>
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${paymentMethod === "BANK_TRANSFER" ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:border-gray-400"}`}>
                    <input type="radio" name="payment" value="BANK_TRANSFER" checked={paymentMethod === "BANK_TRANSFER"} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-4 h-4" />
                    <span className="font-semibold">Bank Transfer</span>
                  </label>
                  <label className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${paymentMethod === "BANK_CARD" ? "border-cyan-500 bg-cyan-50" : "border-gray-300 hover:border-gray-400"}`}>
                    <input type="radio" name="payment" value="BANK_CARD" checked={paymentMethod === "BANK_CARD"} onChange={(e) => setPaymentMethod(e.target.value as any)} className="w-4 h-4" />
                    <span className="font-semibold">Credit/Debit Card</span>
                  </label>

                  {paymentMethod === "BANK_CARD" && (
                    <div className="mt-4 p-4 border border-cyan-200 bg-cyan-50/30 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="Card Number (16 digits)"
                          value={cardData.cardNumber}
                          onChange={handleCardInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                        <input
                          type="text"
                          name="cardHolder"
                          placeholder="Card Holder Name"
                          value={cardData.cardHolder}
                          onChange={handleCardInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 uppercase"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardData.expiryDate}
                            onChange={handleCardInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                          <input
                            type="password"
                            name="cvv"
                            placeholder="CVV"
                            value={cardData.cvv}
                            onChange={handleCardInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 italic">
                        * Your card information is encrypted and processed securely.
                      </p>
                    </div>
                  )}
                </div>
                <div className="pt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 italic">
                  * Please review your order information before proceeding.
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
              <Link to={`/product/${productId}`} className="flex gap-4 mb-6 pb-6 border-b border-gray-300 group hover:opacity-80 transition">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-20 h-20 object-cover rounded group-hover:ring-2 ring-cyan-500 transition"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 group-hover:text-cyan-600 transition">{productName}</h3>
                  <div className="flex flex-col gap-1 mt-1">
                    {selectedColor && <p className="text-xs text-gray-500">Color: {selectedColor}</p>}
                    {selectedSize && <p className="text-xs text-gray-500">Size: {selectedSize}</p>}
                    <p className="text-xs text-gray-500">Quantity: {quantity}</p>
                  </div>
                  <p className="text-red-600 font-bold mt-2">${(productPrice * quantity).toFixed(2)}</p>
                </div>
              </Link>
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(productPrice * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
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

