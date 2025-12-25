import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Eye
} from "lucide-react"
import SellerLayout from "./SellerLayout"
import { orderApi } from "@/lib/api"
import { formatDate } from "@/lib/utils"

interface OrderForSeller {
  orderId: string
  productId: string
  productName: string
  customerId: string
  customerName: string
  sellerId: string
  quantity: number
  price: number
  selectedColor: string
  selectedSize: string
  status: string
  orderDate: string
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  productId: string;
  price: number;
  selectedColor: string;
  selectedSize: string;
}

interface OrderDetail {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("orders")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [orderSeller, setOrderSeller] = useState<OrderForSeller[]>([])
  const [loading, setLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null)
  const sellerId = user?.id || "anonymous-seller"
  useEffect(() => {
    let mounted = true
    async function load() {
      if (!sellerId) return
      console.log("Fetching orders for seller:", sellerId)
      setLoading(true)
      try {
        const res = await orderApi.getOrdersForSeller(sellerId)
        console.log("Orders for seller:", res)
        if (mounted) {
          setOrderSeller(res)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [sellerId])


  const filteredOrders = orderSeller.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "PENDING_CONFIRMATION":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "WAITING_FOR_PICKUP":
        return <Truck className="w-4 h-4 text-orange-600" />
      case "SHIPPING":
        return <Truck className="w-4 h-4 text-blue-600" />
      case "CANCEL_REQUESTED":
        return <Clock className="w-4 h-4 text-purple-600" />
      case "CANCELED":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "PENDING_CONFIRMATION":
        return "bg-yellow-100 text-yellow-800"
      case "WAITING_FOR_PICKUP":
        return "bg-orange-100 text-orange-800"
      case "SHIPPING":
        return "bg-blue-100 text-blue-800"
      case "CANCEL_REQUESTED":
        return "bg-purple-100 text-purple-800"
      case "CANCELED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "DELIVERED":
        return "Delivered"
      case "PENDING_CONFIRMATION":
        return "Pending Confirmation"
      case "WAITING_FOR_PICKUP":
        return "Waiting for Pickup"
      case "SHIPPING":
        return "Shipping"
      case "CANCEL_REQUESTED":
        return "Cancellation Requested"
      case "CANCELED":
        return "Canceled"
      default:
        return status
    }
  }

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = ""
    switch (currentStatus.toUpperCase()) {
      case "PENDING_CONFIRMATION":
        nextStatus = "WAITING_FOR_PICKUP"
        break
      case "WAITING_FOR_PICKUP":
        nextStatus = "SHIPPING"
        break
      case "SHIPPING":
        nextStatus = "DELIVERED"
        break
      case "CANCEL_REQUESTED_APPROVE":
        nextStatus = "CANCELED"
        break
      case "CANCEL_REQUESTED_REJECT":
        nextStatus = "WAITING_FOR_PICKUP"
        break
      default:
        return
    }

    try {
      await orderApi.updateStatus(orderId, nextStatus)
      // Refresh list
      const res = await orderApi.getOrdersForSeller(sellerId)
      setOrderSeller(res)
    } catch (error) {
      console.error("Failed to update status:", error)
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
          <h2 className="text-3xl font-bold mb-2">Orders</h2>
          <p className="text-gray-600">Manage and track your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by customer or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING_CONFIRMATION">Pending Confirmation</option>
                <option value="WAITING_FOR_PICKUP">Waiting for Pickup</option>
                <option value="SHIPPING">Shipping</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCEL_REQUESTED">Cancellation Requested</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Product</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Total Price</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Order Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-6 text-sm font-semibold">#{order.orderId}</td>
                      <td className="py-4 px-6 text-sm">{order.customerName}</td>
                      <td className="py-4 px-6 text-sm">{order.productName}</td>
                      <td className="py-4 px-6 text-sm">{order.quantity}</td>
                      <td className="py-4 px-6 text-sm font-semibold">${(order.price * order.quantity).toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{formatDate(order.orderDate)}</td>
                      <td className="py-4 px-6 overflow-hidden">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={async () => {
                              setDetailLoading(true)
                              setDetailOpen(true)
                              try {
                                const fetchDetail = await orderApi.getById(order.orderId)
                                setSelectedOrderDetail(fetchDetail)
                              } finally {
                                setDetailLoading(false)
                              }
                            }}
                            className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          {order.status.toUpperCase() === "CANCEL_REQUESTED" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateStatus(order.orderId, "CANCEL_REQUESTED_APPROVE")}
                                className="inline-flex items-center justify-center px-2 py-1 bg-red-500 text-white rounded-md text-[10px] font-bold hover:bg-red-600 transition"
                              >
                                Approve Cancel
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.orderId, "CANCEL_REQUESTED_REJECT")}
                                className="inline-flex items-center justify-center px-2 py-1 bg-gray-500 text-white rounded-md text-[10px] font-bold hover:bg-gray-600 transition"
                              >
                                Reject Cancel
                              </button>
                            </div>
                          ) : (
                            ["PENDING_CONFIRMATION", "WAITING_FOR_PICKUP", "SHIPPING"].includes(order.status.toUpperCase()) && (
                              <button
                                onClick={() => handleUpdateStatus(order.orderId, order.status)}
                                className="inline-flex items-center justify-center px-3 py-1 bg-cyan-500 text-white rounded-md text-xs font-bold hover:bg-cyan-600 transition"
                              >
                                {order.status.toUpperCase() === "PENDING_CONFIRMATION" && "Confirm Order"}
                                {order.status.toUpperCase() === "WAITING_FOR_PICKUP" && "Picked Up"}
                                {order.status.toUpperCase() === "SHIPPING" && "Delivered"}
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      {loading ? "Loading..." : "No orders found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Showing {filteredOrders.length} orders
              </span>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-600">
                  Total Revenue: <span className="font-semibold text-green-600">
                    ${filteredOrders
                      .filter(o => o.status.toUpperCase() === 'DELIVERED')
                      .reduce((sum, order) => sum + (order.price * order.quantity), 0)
                      .toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {detailOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-start justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Order Details</h3>
                  {selectedOrderDetail && (
                    <p className="text-sm text-gray-600 mt-1"><b>Order ID</b>: #{selectedOrderDetail?.id}</p>
                  )}
                </div>
                <button
                  onClick={() => { setDetailOpen(false); setSelectedOrderDetail(null) }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>

              {detailLoading ? (
                <div className="py-12 text-center text-gray-500">Loading...</div>
              ) : selectedOrderDetail ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrderDetail.status)}`}>
                      {getStatusIcon(selectedOrderDetail.status)}
                      {getStatusLabel(selectedOrderDetail.status)}
                    </span>
                    <span className="text-sm text-gray-600"><b>Ordered at</b>: {formatDate(selectedOrderDetail.orderDate)}</span>
                    {selectedOrderDetail.shippingAddress && (
                      <span className="text-sm text-gray-600">, <b>Deliver to</b>: {selectedOrderDetail.shippingAddress}</span>
                    )}
                    {selectedOrderDetail.paymentMethod && (
                      <span className="text-sm text-gray-600">, <b>Payment</b>: {selectedOrderDetail.paymentMethod}</span>
                    )}
                    {/* {selectedOrderDetail.status && (
                      <span className="text-sm text-gray-600">, Order status: {selectedOrderDetail.status}</span>
                    )} */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Customer</h4>
                      <p className="text-sm text-gray-700">{selectedOrderDetail.customerName}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Overview</h4>
                      <p className="text-sm text-gray-700">Items: {selectedOrderDetail.items.reduce((s, i) => s + i.quantity, 0)}</p>
                      <p className="text-sm text-gray-700">Total Amount: ${selectedOrderDetail.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-2 px-3">Product</th>
                            <th className="text-left py-2 px-3">Qty</th>
                            <th className="text-left py-2 px-3">Price</th>
                            <th className="text-left py-2 px-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrderDetail.items.map((it, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="py-2 px-3">{it.productName}</td>
                              <td className="py-2 px-3">{it.quantity}</td>
                              <td className="py-2 px-3">${it.price.toLocaleString()}</td>
                              <td className="py-2 px-3">${(it.price * it.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => { setDetailOpen(false); setSelectedOrderDetail(null) }}
                      className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">No order selected</div>
              )}
            </div>
          </div>
        )}

      </div>
    </SellerLayout>
  )
}

// Detail Modal
// Render modal at end of component return


