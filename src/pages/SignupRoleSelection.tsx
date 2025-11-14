import { Link, useNavigate } from "react-router-dom"
import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { ShoppingBag, Store } from "lucide-react"

export default function SignupRoleSelectionPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="text-cyan-600 font-semibold text-sm hover:text-cyan-700">
            ← Back
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
          <p className="text-gray-600">Choose your account type</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Buyer Option */}
          <button
            onClick={() => navigate("/signup/buyer")}
            className="p-8 border-2 border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition text-left group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4 group-hover:bg-cyan-200 transition">
              <ShoppingBag className="w-8 h-8 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">I'm a Buyer</h2>
            <p className="text-gray-600 text-sm">
              Shop and purchase products from our marketplace
            </p>
          </button>

          {/* Seller Option */}
          <button
            onClick={() => navigate("/signup/seller")}
            className="p-8 border-2 border-gray-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition text-left group"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-4 group-hover:bg-cyan-200 transition">
              <Store className="w-8 h-8 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">I'm a Seller</h2>
            <p className="text-gray-600 text-sm">
              Sell your products and manage your store
            </p>
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-600 font-semibold hover:text-cyan-700">
            Login here
          </Link>
        </p>
      </div>

      <LiteFooter />
    </main>
  )
}

