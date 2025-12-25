import { useEffect, useState } from "react"
import { orderApi, productApi } from "@/lib/api"

export default function Operations() {
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [o, p] = await Promise.all([
          orderApi.getAll().catch(() => []),
          productApi.getAll().catch(() => []),
        ])
        setOrders(o || [])
        setProducts(p || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Operations Management</h1>
        <p className="text-slate-500">Orders / Deliveries / Products</p>
      </header>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">Orders</h2>
              <span className="text-xs text-slate-500">{orders.length} orders</span>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {orders.map(order => (
                <div key={order.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">#{order.id?.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500">
                      Customer: {order.customerName || order.customerId?.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {(Number(order.totalAmount || 0)).toLocaleString()} $
                    </p>
                    <p className="text-xs text-slate-500">{order.status}</p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="px-4 py-3 text-sm text-slate-500">No orders yet</p>}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">Products</h2>
              <span className="text-xs text-slate-500">{products.length} products</span>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {products.map(product => (
                <div key={product.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{product.name}</p>
                    <p className="text-xs text-slate-500">Stock: {product.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {(Number(product.price || 0)).toLocaleString()} $
                    </p>
                    <p className="text-xs text-slate-500">{product.status}</p>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="px-4 py-3 text-sm text-slate-500">No products yet</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

