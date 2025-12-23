import { useEffect, useMemo, useState } from "react"
import { orderApi, OrderDetail } from "@/lib/api"

export default function Orders() {
  const [orders, setOrders] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderApi.getAll()
      setOrders(data)
    } catch (err: any) {
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filtered = useMemo(() => {
    if (!keyword) return orders
    const kw = keyword.toLowerCase()
    return orders.filter(
      o =>
        o.id.toLowerCase().includes(kw) ||
        o.customerName.toLowerCase().includes(kw) ||
        o.status.toLowerCase().includes(kw)
    )
  }, [orders, keyword])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Order Management</h1>
          <p className="text-slate-500">View and manage all orders</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Search by order ID, customer name..."
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Order ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Customer</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Order Date</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Total Amount</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Payment</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Products</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium">{order.id}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3">{order.totalAmount.toLocaleString()} VND</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    {order.items.length} products
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}