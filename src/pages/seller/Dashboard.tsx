import { useState } from "react"
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

export default function SellerDashboard() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("dashboard")

  // Mock data - in real app, fetch from API
  const stats = {
    revenue: 125000,
    orders: 342,
    products: 28,
    rating: 4.7
  }

  const recentOrders = [
    { id: 1, customer: "John Doe", product: "Adidas Samba", amount: 89, status: "completed" },
    { id: 2, customer: "Jane Smith", product: "Nike Air Force", amount: 120, status: "pending" },
    { id: 3, customer: "Bob Johnson", product: "Dior Belt", amount: 3400, status: "completed" },
  ]

  const lowStockProducts = [
    { id: 1, name: "Adidas Samba", stock: 5 },
    { id: 2, name: "Nike Air Force", stock: 3 },
  ]

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
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              +12.5% from last month
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{stats.orders}</p>
            <p className="text-sm text-blue-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              +8 new orders
            </p>
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
            <p className="text-sm text-gray-600 mt-2">Based on 234 reviews</p>
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

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
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
                    <td className="py-3 px-4 text-sm">#{order.id}</td>
                    <td className="py-3 px-4 text-sm">{order.customer}</td>
                    <td className="py-3 px-4 text-sm">{order.product}</td>
                    <td className="py-3 px-4 text-sm font-semibold">${order.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed" 
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
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

