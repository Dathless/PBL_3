import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { payoutApi } from "@/lib/api"
import {
  DollarSign,
  Download,
  TrendingUp,
  Loader2,
  RefreshCcw
} from "lucide-react"
import SellerLayout from "./SellerLayout"
import { toast } from "sonner"
import { syncBalance } from "@/lib/sellerApi"

export default function PayoutsPage() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("payouts")
  const [loading, setLoading] = useState(true)
  const [payouts, setPayouts] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    currentBalance: 0,
    pendingPayout: 0,
    completedPayouts: 0
  })
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [payoutsData, statsData] = await Promise.all([
        payoutApi.getBySeller(user!.id),
        payoutApi.getStats(user!.id)
      ])
      setPayouts(payoutsData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to fetch payout data:", error)
      toast.error("Failed to load payout data")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = async () => {
    // For now, simple prompt or just request all available balance
    // In a real app, you'd have a modal
    if (stats.currentBalance <= 0) {
      toast.error("No balance available to withdraw")
      return
    }

    try {
      await payoutApi.request(user!.id, stats.currentBalance, "Bank Transfer")
      toast.success("Payout requested successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to request payout")
    }
  }

  const handleSyncBalance = async () => {
    try {
      setSyncing(true)
      await syncBalance(user!.id)
      toast.success("Balance synchronized successfully")
      await fetchData()
    } catch (error) {
      console.error("Failed to sync balance:", error)
      toast.error("Failed to synchronize balance")
    } finally {
      setSyncing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSED":
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

  if (loading) {
    return (
      <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </SellerLayout>
    )
  }

  return (
    <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Payouts</h2>
            <p className="text-gray-600">Manage your earnings and payouts</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSyncBalance}
              className="flex items-center gap-2 border border-black text-black px-4 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              disabled={syncing}
            >
              <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Balance'}
            </button>
            <button
              onClick={handleRequestPayout}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
              disabled={stats.currentBalance <= 0}
            >
              Request Payout (${stats.currentBalance.toLocaleString()})
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No payout history found</td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-sm font-semibold">...{payout.id.slice(-8)}</td>
                      <td className="py-4 px-6 text-sm font-semibold">${payout.amount.toLocaleString()}</td>
                      <td className="py-4 px-6 text-sm">{payout.method}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{new Date(payout.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
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

