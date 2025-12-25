import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  TrendingUp,
  ShoppingCart,
  Star,
  AlertTriangle,
  Bell,
  DollarSign,
  Package
} from "lucide-react"
import SellerLayout from "./SellerLayout"
import { getSellerProducts, getSellerOrders, getAnalyticsSummary, getRevenueSeries } from "@/lib/sellerApi"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function SellerDashboard() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    rating: 0
  })
  const [summary, setSummary] = useState<any>(null)
  const [revenueSeries, setRevenueSeries] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return
      setLoading(true)
      try {
        const [products, orders, analytics, series] = await Promise.all([
          getSellerProducts(user.id),
          getSellerOrders(user.id),
          getAnalyticsSummary(user.id, "30d"),
          getRevenueSeries(user.id, "30d")
        ])

        setStats({
          revenue: analytics.revenue.current,
          orders: analytics.orders.current,
          products: products.length,
          rating: 4.8 // Mock rating for now or fetch if available
        })

        setSummary(analytics)
        setRevenueSeries(series)
        setSummary(analytics)
        setRevenueSeries(series)
        setRecentOrders((orders || []).slice(0, 5).map(o => ({
          id: o.orderId || Math.random().toString(),
          customer: o.customerName || "Walking Customer",
          product: o.productName || "Product",
          amount: (o.price && o.quantity) ? (o.price * o.quantity) : 0,
          status: o.status
        })))

        setLowStockProducts(products.filter(p => p.stock < 10))
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user?.id])

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
        <div className="flex h-screen items-center justify-center text-slate-500">Loading dashboard...</div>
      </SellerLayout>
    )
  }

  return (
    <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
            {summary && (
              <p className={`text-sm flex items-center gap-1 mt-2 ${summary.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-4 h-4 ${summary.revenue.change < 0 ? 'rotate-180' : ''}`} />
                {summary.revenue.change > 0 ? '+' : ''}{summary.revenue.change}% from last 30d
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{stats.orders}</p>
            {summary && (
              <p className={`text-sm flex items-center gap-1 mt-2 ${summary.orders.change >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-4 h-4 ${summary.orders.change < 0 ? 'rotate-180' : ''}`} />
                {summary.orders.change > 0 ? '+' : ''}{summary.orders.change}% from last 30d
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Products</h3>
              <ShoppingCart className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{stats.products}</p>
            <p className="text-sm text-gray-600 mt-2">Active products</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Rating</h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{stats.rating}</p>
            <p className="text-sm text-gray-600 mt-2">Seller Rating</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Low Stock Alert</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-amber-700">
              {lowStockProducts.map((product) => (
                <li key={product.id}>
                  {product.name} - Only {product.stock} left in stock
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              {recentOrders.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm">#{order.id.toString().slice(0, 8)}</td>
                        <td className="py-3 px-4 text-sm">{order.customer}</td>
                        <td className="py-3 px-4 text-sm">{order.product}</td>
                        <td className="py-3 px-4 text-sm font-semibold">${order.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Revenue Trend</h3>
            <div className="h-64">
              {revenueSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueSeries}>
                    <XAxis dataKey="label" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#0891b2" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg text-gray-500 text-sm">
                  No trend data available
                </div>
              )}
            </div>
            <p className="text-center text-xs text-gray-500 mt-4">Last 30 days revenue</p>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

