import type React from "react"

import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useBuyNow } from "@/contexts/buy-now-context"
import { useToast } from "@/hooks/use-toast"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const { addToCart } = useCart()
  const { setBuyNowProduct } = useBuyNow()
  const { toast } = useToast()

  // Pre-fill email if coming from signup
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get user data from localStorage (in real app, verify with API)
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}")
    const userData = storedUsers[email]
    
    if (!userData) {
      toast({
        title: "Login Failed",
        description: "User not found. Please sign up first.",
        variant: "destructive",
      })
      return
    }

    // Verify password (in real app, hash and verify)
    if (userData.password !== password) {
      toast({
        title: "Login Failed",
        description: "Incorrect password.",
        variant: "destructive",
      })
      return
    }

    login(email, userData.role, userData.name)

    toast({
      title: "Login Successful",
      description: `Welcome back, ${userData.name || email}!`,
    })

    // Execute pending action if exists
    try {
      const pendingRaw = localStorage.getItem("pendingAction")
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw) as
          | { type: "add-to-cart"; product: any }
          | { type: "buy-now"; product: any }

        localStorage.removeItem("pendingAction")

        if (pending.type === "add-to-cart") {
          addToCart(pending.product)
          toast({
            title: "Added to cart",
            description: `${pending.product.name} has been added to your cart.`,
          })
          navigate("/cart")
          return
        }
        if (pending.type === "buy-now") {
          setBuyNowProduct({
            id: pending.product.id,
            name: pending.product.name,
            price: pending.product.price,
            image: pending.product.image,
          })
          navigate(`/buy-now?id=${pending.product.id}`)
          return
        }
      }
    } catch (e) {
      // fall through to normal redirect
      console.error("Failed to handle pending action after login", e)
    }

    // Redirect based on role or query if no pending action
    const redirect = searchParams.get("redirect")
    if (redirect) {
      navigate(redirect)
    } else if (userData.role === "seller") {
      navigate("/seller/dashboard")
    } else {
      navigate("/")
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="text-cyan-600 font-semibold text-sm hover:text-cyan-700">
            ← Back
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-600">Or</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <span>🔍</span>
            Login with Google
          </button>
          <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <span>📱</span>
            Login with Facebook
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cyan-600 font-semibold hover:text-cyan-700">
            Sign up here
          </Link>
        </p>
      </div>

      <LiteFooter />
    </main>
  )
}

