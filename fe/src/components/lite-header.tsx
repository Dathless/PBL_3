"use client"

import { Search, User, ShoppingCart, LogOut, MessageSquare, Bell } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationPopover } from "./NotificationPopover"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const { isAuthenticated, user, logout } = useAuth()
  const { getItemCount } = useCart()
  const { toast } = useToast()
  const { unreadCount } = useNotifications()

  const cartItemCount = getItemCount()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    // Redirect to home page after logout
    navigate("/")
  }

  const products = [
    { name: "ADIDAS SAMBA OG", id: "1" },
    { name: "Nike Air Force 1", id: "2" },
    { name: "Long-sleeved Blouse", id: "3" },
    { name: "Maxi Size Hobo Bag", id: "4" },
    { name: "Black Rolex Watch", id: "5" },
    { name: "Pink Leather Jacket", id: "6" },
    { name: "Dior Diorshow Shoes", id: "7" },
  ]

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const navItems = user?.role === "seller"
    ? [
      { href: "/seller/dashboard", label: "DASHBOARD" },
      { href: "/seller/products", label: "PRODUCTS" },
      { href: "/seller/orders", label: "ORDERS" },
    ]
    : [
      { href: "/", label: "HOME" },
      { href: "/offers", label: "OFFERS" },
    ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  // Check if current page is login or signup
  const isAuthPage = pathname === "/login" || pathname.startsWith("/signup")

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Logo and Search */}
        <div className="flex items-center justify-between gap-8 mb-4">
          <Link
            to={user?.role === "seller" ? "/seller/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <img
              src="/logo-new.png"
              alt="LITE"
              className="h-20 w-auto"
            />
          </Link>

          {/* Search Bar - Hidden on auth pages */}
          {!isAuthPage && (
            <div className="flex-1 max-w-md relative">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchResults(e.target.value.length > 0)
                  }}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="bg-transparent border-0 outline-none px-2 py-1 w-full text-sm"
                />
              </div>
              {showSearchResults && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {user?.role === "seller" && (
                  <Link
                    to="/seller/dashboard"
                    className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700 font-semibold"
                  >
                    Seller Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <Link to="/profile" className="max-w-[150px] truncate hover:text-cyan-600 transition">
                    {user?.fullname || user?.username || user?.email}
                  </Link>
                </div>

                {/* Notification Bell */}
                <NotificationPopover>
                  <button className="relative p-1 text-gray-600 hover:text-cyan-600 transition">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </NotificationPopover>

                {user?.role === "buyer" && (
                  <>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-cyan-600 transition font-medium"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/messages"
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-cyan-600 transition font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Messages
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                <User className="w-4 h-4" />
                <span>Log in</span>
              </Link>
            )}
            {(!isAuthenticated || user?.role !== "seller") && (
              <Link to="/cart" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition relative">
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Menu - Hidden on auth pages */}
        {!isAuthPage && (
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${isActive(item.href) ? "bg-black text-white" : "text-gray-800 hover:text-red-600"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="relative group">
              <button className="text-sm font-medium hover:text-red-600 transition flex items-center gap-1">
                CATEGORIES <span className="text-xs">▼</span>
              </button>
              <div className="hidden group-hover:block absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
                <Link to="/category/t-shirt" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  T-Shirt
                </Link>
                <Link to="/category/jacket" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Jacket
                </Link>
                <Link to="/category/pants" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Pants
                </Link>
                <Link to="/category/shoes" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Shoes
                </Link>
                <Link to="/category/watches" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Watches
                </Link>
                <Link to="/category/bag" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Bag
                </Link>
                <Link to="/category/accessories" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Accessories
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="text-sm font-medium hover:text-red-600 transition flex items-center gap-1">
                BRANDS <span className="text-xs">▼</span>
              </button>
              <div className="hidden group-hover:block absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
                <Link to="/brand/zara" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Zara
                </Link>
                <Link to="/brand/dg" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  D&G
                </Link>
                <Link to="/brand/hm" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  H&M
                </Link>
                <Link to="/brand/chanel" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Chanel
                </Link>
                <Link to="/brand/prada" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Prada
                </Link>
                <Link to="/brand/adidas" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Adidas
                </Link>
                <Link to="/brand/nike" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Nike
                </Link>
                <Link to="/brand/dior" className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm">
                  Dior
                </Link>
                <Link
                  to="/brands"
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm font-bold border-t border-gray-200"
                >
                  All Brands
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
