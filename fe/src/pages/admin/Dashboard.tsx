import { useEffect, useMemo, useState } from "react"
import { orderApi, productApi, userApi } from "@/lib/api"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {sub && <p className="text-xs text-emerald-600 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [u, p, o] = await Promise.all([
          userApi.getAll().catch(() => []),
          productApi.getAll().catch(() => []),
          orderApi.getAll().catch(() => []),
        ])
        setUsers(u || [])
        setProducts(p || [])
        setOrders(o || [])
      } catch (err: any) {
        setError(err.message || "Could not load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const revenue = useMemo(() => {
    return orders.reduce((sum, o: any) => sum + Number(o.totalAmount || 0), 0)
  }, [orders])

  const chartData = useMemo(() => {
    if (orders.length > 0) {
      const buckets: Record<string, number> = {}
      orders.forEach((o: any) => {
        // Assume orderDate is ISO string e.g. "2023-10-27T..."
        const key = (o.orderDate || "").slice(0, 10) || "N/A"
        if (key !== "N/A") {
          buckets[key] = (buckets[key] || 0) + Number(o.totalAmount || 0)
        }
      })

      return Object.entries(buckets)
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => a.date.localeCompare(b.date))
    }
    return []
  }, [orders])

  if (loading) {
    return <div className="text-slate-600">Loading data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-500">Quick system overview</p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={users.length}
          sub={`${users.filter(u => {
            const date = (u as any).createdAt || "";
            const today = new Date().toISOString().slice(0, 10);
            return date.startsWith(today);
          }).length} joined today`}
        />
        <StatCard
          label="Products"
          value={products.length}
          sub={`${products.filter(p => p.status === 'APPROVED').length} Approved`}
        />
        <StatCard
          label="Orders"
          value={orders.length}
          sub={`${orders.filter(o => {
            const date = o.orderDate || "";
            const today = new Date().toISOString().slice(0, 10);
            return date.startsWith(today);
          }).length} placed today`}
        />
        <StatCard
          label="Revenue ($)"
          value={revenue.toLocaleString()}
          sub="Accumulated total"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold">Daily revenue</p>
            <span className="text-xs text-slate-500">Last 30 days activity</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <p className="font-semibold">System Summary</p>
          <div className="space-y-2 text-sm text-slate-600">
            <p>• Online Users: {users.filter(u => u.enabled !== false).length}</p>
            <p>• Total Sellers: {users.filter(u => u.role === "SELLER").length}</p>
            <p>• Total Buyers: {users.filter(u => u.role === "CUSTOMER").length}</p>
            <p>• Pending Products: {products.filter((p: any) => p.status === 'PENDING').length}</p>
            <p>• Pending Orders: {orders.filter((o: any) => o.status === "PENDING").length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

