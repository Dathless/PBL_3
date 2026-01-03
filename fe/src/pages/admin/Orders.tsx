import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { orderApi, OrderDetail } from "@/lib/api"
import { Eye, X } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function Orders() {
  const [orders, setOrders] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
                <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium">#{order.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString('en-US')}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">${order.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                      }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setIsModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">Order Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Customer</p>
                  <p className="text-slate-900 font-medium">{selectedOrder.customerName}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Order Date</p>
                  <p className="text-slate-900 font-medium">{formatDate(selectedOrder.orderDate)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Shipping Address</p>
                  <p className="text-slate-900 font-medium">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  Order Items ({selectedOrder.items.length})
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-slate-600">Product</th>
                        <th className="px-4 py-2 font-semibold text-slate-600 text-center">Qty</th>
                        <th className="px-4 py-2 font-semibold text-slate-600 text-right">Price</th>
                        <th className="px-4 py-2 font-semibold text-slate-600 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((item: any, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <Link to={`/product/${item.productId}`} className="font-medium text-cyan-600 hover:underline">
                              {item.productName}
                            </Link>
                            {(item.selectedColor || item.selectedSize) && (
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                {item.selectedColor && item.selectedSize && ' • '}
                                {item.selectedSize && `Size: ${item.selectedSize}`}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-slate-600">${item.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">
                            ${(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-slate-800">Total Amount</td>
                        <td className="px-4 py-3 text-right font-black text-emerald-600 text-lg">
                          ${selectedOrder.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}