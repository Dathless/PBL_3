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
      await login(username, password)

      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}!`,
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

      // Redirect based on query if exists
      const redirect = searchParams.get("redirect")
      if (redirect) {
        navigate(redirect)
        return
      }

      // Otherwise handle default role-based navigation is often handled in effects or by the auth context refresh
      // but for immediate feedback we can wait a bit or use the response if login returned it.
      // Since refreshUser in login(auth-context) updates the state, we can navigate here.
      // We navigate to / to let the App's protected routes handle redirection if needed,
      // or we can just wait for the state sync.
      navigate("/")

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
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
            </svg>
            Login with Google
          </button>
          <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
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

