import type React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useAuth } from "@/contexts/auth-context"
import { useBuyNow } from "@/contexts/buy-now-context"
import { useShipping } from "@/contexts/shipping-context"
import { useToast } from "@/hooks/use-toast"

export default function BuyNowPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { getBuyNowProduct } = useBuyNow()
  const { savedAddress, saveAddress } = useShipping()
  const { toast } = useToast()
  const [step, setStep] = useState<"shipping" | "payment" | "confirm">("shipping")
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

  // Get product info - only need ID from URL
  const productId = searchParams.get("id")
  const product = productId ? getBuyNowProduct(productId) : null
  const productName = product?.name || "Product"
  const productPrice = product?.price || 0
  const productImage = product?.image || "/placeholder.svg"

  const shipping = 10
  const tax = Math.round(productPrice * 0.1 * 100) / 100
  const total = Math.round((productPrice + shipping + tax) * 100) / 100

  // Check authentication and product
  useEffect(() => {
    if (!productId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy sản phẩm.",
        variant: "destructive",
      })
      navigate("/")
      return
    }

    if (!product) {
      toast({
        title: "Lỗi",
        description: "Thông tin sản phẩm không hợp lệ.",
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
        title: "Please fill in all required fields",
        description: "Please check the required fields.",
        variant: "destructive",
      })
    }
  }

  const handlePlaceOrder = () => {
    // Save address before placing order
    saveAddress(formData)
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. Your order is being processed.",
    })
    navigate("/order-success")
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
                      list="cities-buynow"
                      placeholder="City/Province *"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-4 py-2 ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <datalist id="cities-buynow">
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="An Giang">An Giang</option>
                      <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
                      <option value="Bạc Liêu">Bạc Liêu</option>
                      <option value="Bắc Giang">Bắc Giang</option>
                      <option value="Bắc Kạn">Bắc Kạn</option>
                      <option value="Bắc Ninh">Bắc Ninh</option>
                      <option value="Bến Tre">Bến Tre</option>
                      <option value="Bình Định">Bình Định</option>
                      <option value="Bình Dương">Bình Dương</option>
                      <option value="Bình Phước">Bình Phước</option>
                      <option value="Bình Thuận">Bình Thuận</option>
                      <option value="Cà Mau">Cà Mau</option>
                      <option value="Cao Bằng">Cao Bằng</option>
                      <option value="Đắk Lắk">Đắk Lắk</option>
                      <option value="Đắk Nông">Đắk Nông</option>
                      <option value="Điện Biên">Điện Biên</option>
                      <option value="Đồng Nai">Đồng Nai</option>
                      <option value="Đồng Tháp">Đồng Tháp</option>
                      <option value="Gia Lai">Gia Lai</option>
                      <option value="Hà Giang">Hà Giang</option>
                      <option value="Hà Nam">Hà Nam</option>
                      <option value="Hà Tĩnh">Hà Tĩnh</option>
                      <option value="Hải Dương">Hải Dương</option>
                      <option value="Hậu Giang">Hậu Giang</option>
                      <option value="Hòa Bình">Hòa Bình</option>
                      <option value="Hưng Yên">Hưng Yên</option>
                      <option value="Khánh Hòa">Khánh Hòa</option>
                      <option value="Kiên Giang">Kiên Giang</option>
                      <option value="Kon Tum">Kon Tum</option>
                      <option value="Lai Châu">Lai Châu</option>
                      <option value="Lâm Đồng">Lâm Đồng</option>
                      <option value="Lạng Sơn">Lạng Sơn</option>
                      <option value="Lào Cai">Lào Cai</option>
                      <option value="Long An">Long An</option>
                      <option value="Nam Định">Nam Định</option>
                      <option value="Nghệ An">Nghệ An</option>
                      <option value="Ninh Bình">Ninh Bình</option>
                      <option value="Ninh Thuận">Ninh Thuận</option>
                      <option value="Phú Thọ">Phú Thọ</option>
                      <option value="Phú Yên">Phú Yên</option>
                      <option value="Quảng Bình">Quảng Bình</option>
                      <option value="Quảng Nam">Quảng Nam</option>
                      <option value="Quảng Ngãi">Quảng Ngãi</option>
                      <option value="Quảng Ninh">Quảng Ninh</option>
                      <option value="Quảng Trị">Quảng Trị</option>
                      <option value="Sóc Trăng">Sóc Trăng</option>
                      <option value="Sơn La">Sơn La</option>
                      <option value="Tây Ninh">Tây Ninh</option>
                      <option value="Thái Bình">Thái Bình</option>
                      <option value="Thái Nguyên">Thái Nguyên</option>
                      <option value="Thanh Hóa">Thanh Hóa</option>
                      <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                      <option value="Tiền Giang">Tiền Giang</option>
                      <option value="Trà Vinh">Trà Vinh</option>
                      <option value="Tuyên Quang">Tuyên Quang</option>
                      <option value="Vĩnh Long">Vĩnh Long</option>
                      <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                      <option value="Yên Bái">Yên Bái</option>
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
                  <label className="flex items-center gap-3 border border-cyan-500 rounded-lg p-4 cursor-pointer bg-cyan-50">
                    <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
                    <span className="font-semibold">Credit Card</span>
                  </label>
                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                    <input type="radio" name="payment" className="w-4 h-4" />
                    <span className="font-semibold">Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-gray-400">
                    <input type="radio" name="payment" className="w-4 h-4" />
                    <span className="font-semibold">PayPal</span>
                  </label>
                </div>
                <div className="pt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM/YY" className="border border-gray-300 rounded-lg px-4 py-2" />
                    <input type="text" placeholder="CVV" className="border border-gray-300 rounded-lg px-4 py-2" />
                  </div>
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
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-300">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">{productName}</h3>
                  <p className="text-red-600 font-bold mt-2">${productPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className="space-y-2 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${productPrice.toFixed(2)}</span>
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

