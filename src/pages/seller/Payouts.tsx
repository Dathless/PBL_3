import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  DollarSign,
  Download,
  Calendar,
  TrendingUp
} from "lucide-react"
import SellerLayout from "./SellerLayout"

export default function PayoutsPage() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("payouts")

  // Mock payout data
  const payouts = [
    { id: 1, amount: 12500, status: "completed", date: "2024-01-15", method: "Bank Transfer" },
    { id: 2, amount: 8900, status: "pending", date: "2024-01-20", method: "Bank Transfer" },
    { id: 3, amount: 15200, status: "completed", date: "2024-01-10", method: "PayPal" },
    { id: 4, amount: 6700, status: "processing", date: "2024-01-18", method: "Bank Transfer" },
  ]

  const stats = {
    totalEarnings: 125000,
    pendingPayout: 8900,
    completedPayouts: 116100,
    nextPayout: "2024-01-25"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Please login as seller.</p>
      </div>
    )
  }

  return (
    <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Payouts</h2>
          <p className="text-gray-600">Manage your earnings and payouts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Earnings</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Pending Payout</h3>
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">${stats.pendingPayout.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Completed Payouts</h3>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">${stats.completedPayouts.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Next Payout</h3>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{stats.nextPayout}</p>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xl font-bold">Payout History</h3>
            <button className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Payout ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Method</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-sm font-semibold">#{payout.id}</td>
                    <td className="py-4 px-6 text-sm font-semibold">${payout.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm">{payout.method}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{payout.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Payment Method</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Bank Transfer</p>
                <p className="text-sm text-gray-600">****1234</p>
              </div>
              <button className="text-cyan-600 hover:text-cyan-700 font-semibold">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

