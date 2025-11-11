import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <LiteFooter />
    </main>
  )
}

