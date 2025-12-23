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
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const { addToCart } = useCart()
  const { setBuyNowProduct } = useBuyNow()
  const { toast } = useToast()

  // Pre-fill username if coming from signup
  useEffect(() => {
    const usernameParam = searchParams.get("username")
    if (usernameParam) {
      setUsername(usernameParam)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { authApi } = await import("@/lib/api")
      const response = await authApi.login(username, password)
      await login(username, password)

      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.fullname || username}!`,
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
      } else {
        const role = response.role === "CUSTOMER" ? "buyer" : response.role === "SELLER" ? "seller" : response.role === "ADMIN" ? "admin" : "buyer"
        if (role === "admin") {
          navigate("/admin/dashboard")
        } else if (role === "seller") {
          navigate("/seller/dashboard")
        } else {
          navigate("/")
        }
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
            <label className="block text-sm font-semibold text-gray-800 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
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
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
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

