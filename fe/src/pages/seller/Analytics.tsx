import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3
} from "lucide-react"
import SellerLayout from "./SellerLayout"
import { getAnalyticsSummary, getRevenueSeries } from "@/lib/sellerApi"
import { productApi } from "@/lib/api"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("analytics")
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState({
    revenue: { current: 0, previous: 0, change: 0 },
    orders: { current: 0, previous: 0, change: 0 },
    customers: { current: 0, previous: 0, change: 0 },
    conversion: { current: 0, previous: 0, change: 0 },
  })
  const [series, setSeries] = useState<{ label: string; value: number }[]>([])
  const [topProducts, setTopProducts] = useState<Array<{ name: string; sales: number; revenue: number }>>([])
  const sellerId = user?.email || "anonymous-seller"

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user?.id) return
      setLoading(true)
      try {
        // Check if seller has products
        const allProducts = await productApi.getAll()
        const sellerProducts = allProducts.filter((p: any) => {
          return p.sellerId === user.id || (p.seller && p.seller.id === user.id)
        })
        
        // If no products, set all analytics to 0
        if (sellerProducts.length === 0) {
          if (mounted) {
            setAnalytics({
              revenue: { current: 0, previous: 0, change: 0 },
              orders: { current: 0, previous: 0, change: 0 },
              customers: { current: 0, previous: 0, change: 0 },
              conversion: { current: 0, previous: 0, change: 0 },
            })
            setSeries([])
            setTopProducts([])
          }
        } else {
          // Load analytics if products exist
          const [summary, revSeries] = await Promise.all([
            getAnalyticsSummary(sellerId, timeRange as any),
            getRevenueSeries(
              sellerId,
              timeRange === "1y" ? "monthly" : "daily",
            ),
          ])
          if (mounted) {
            setAnalytics(summary)
            setSeries(revSeries)
          }
        }
      } catch (error) {
        console.error("Error loading analytics:", error)
        if (mounted) {
          setAnalytics({
            revenue: { current: 0, previous: 0, change: 0 },
            orders: { current: 0, previous: 0, change: 0 },
            customers: { current: 0, previous: 0, change: 0 },
            conversion: { current: 0, previous: 0, change: 0 },
          })
          setSeries([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user?.id, timeRange])

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Analytics</h2>
            <p className="text-gray-600">Track your business performance</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Revenue</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">${analytics.revenue.current.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{analytics.revenue.change}%</span>
              <span className="text-sm text-gray-600">vs previous period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Orders</h3>
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{analytics.orders.current}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{analytics.orders.change}%</span>
              <span className="text-sm text-gray-600">vs previous period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Customers</h3>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">{analytics.customers.current}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{analytics.customers.change}%</span>
              <span className="text-sm text-gray-600">vs previous period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Conversion Rate</h3>
              <BarChart3 className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{analytics.conversion.current}%</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{analytics.conversion.change}%</span>
              <span className="text-sm text-gray-600">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">{loading ? "Loading..." : `Chart will be displayed here (${series.length} points)`}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Order Trend</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">{loading ? "Loading..." : "Chart will be displayed here"}</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Top Selling Products</h3>
          <div className="overflow-x-auto">
            {topProducts.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sales</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-sm font-semibold">{product.name}</td>
                      <td className="py-3 px-4 text-sm">{product.sales}</td>
                      <td className="py-3 px-4 text-sm font-semibold">${product.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No products yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

