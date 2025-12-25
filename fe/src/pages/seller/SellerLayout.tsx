import { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import {
  Home,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  HelpCircle,
  ShoppingCart,
  MessageSquare
} from "lucide-react"

interface SellerLayoutProps {
  children: ReactNode
  activeMenu: string
  setActiveMenu: (menu: string) => void
}

export default function SellerLayout({ children, activeMenu, setActiveMenu }: SellerLayoutProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/seller/dashboard" },
    { id: "orders", icon: Package, label: "Orders", path: "/seller/orders" },
    { id: "products", icon: ShoppingCart, label: "Products", path: "/seller/products" },
    { id: "messages", icon: MessageSquare, label: "Messages", path: "/seller/messages" },
    { id: "payouts", icon: DollarSign, label: "Payouts", path: "/seller/payouts" },
    { id: "analytics", icon: BarChart3, label: "Analytics", path: "/seller/analytics" },
    { id: "settings", icon: Settings, label: "Settings", path: "/seller/settings" },
    { id: "support", icon: HelpCircle, label: "Support", path: "/seller/support" },
  ]

  const handleMenuClick = (id: string, path: string) => {
    setActiveMenu(id)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-cyan-600">Seller Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeMenu === item.id
                  ? "bg-cyan-50 text-cyan-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => {
              logout()
              navigate("/")
            }}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        {children}
      </main>
    </div>
  )
}

