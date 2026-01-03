"use client"

import { Search, User, ShoppingCart, LogOut, MessageSquare, Bell } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/contexts/notification-context"
import { NotificationPopover } from "./NotificationPopover"
import { productApi, ApiProduct } from "@/lib/api"
import { useEffect } from "react"

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
  const [dynamicProducts, setDynamicProducts] = useState<ApiProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)

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

  // Dynamic search effect with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDynamicProducts([])
      setShowSearchResults(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await productApi.search(searchQuery)
        setDynamicProducts(results)
        setShowSearchResults(true)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

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
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 overflow-hidden">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : dynamicProducts.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {dynamicProducts.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b last:border-0 border-gray-100 group"
                        >
                          <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0].imageUrl : "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-cyan-600 transition">
                              {product.name}
                            </p>
                            <p className="text-xs text-red-600 font-bold">${product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No products found for "{searchQuery}"
                    </div>
                  )}
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
              <button className={`text-sm font-medium hover:text-red-600 transition flex items-center gap-1 ${pathname.startsWith('/category') ? 'text-red-600' : ''}`}>
                CATEGORIES <span className="text-xs">▼</span>
              </button>
              <div className="hidden group-hover:block absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
                {[
                  { to: "/category/t-shirt", label: "T-Shirt" },
                  { to: "/category/jacket", label: "Jacket" },
                  { to: "/category/pants", label: "Pants" },
                  { to: "/category/shoes", label: "Shoes" },
                  { to: "/category/watches", label: "Watches" },
                  { to: "/category/bag", label: "Bag" },
                  { to: "/category/accessories", label: "Accessories" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${pathname === link.to ? 'font-bold text-cyan-600 bg-gray-50' : 'text-gray-700'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button className={`text-sm font-medium hover:text-red-600 transition flex items-center gap-1 ${pathname.startsWith('/brand') ? 'text-red-600' : ''}`}>
                BRANDS <span className="text-xs">▼</span>
              </button>
              <div className="hidden group-hover:block absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max">
                {[
                  { to: "/brand/zara", label: "Zara" },
                  { to: "/brand/dg", label: "D&G" },
                  { to: "/brand/hm", label: "H&M" },
                  { to: "/brand/chanel", label: "Chanel" },
                  { to: "/brand/prada", label: "Prada" },
                  { to: "/brand/adidas", label: "Adidas" },
                  { to: "/brand/nike", label: "Nike" },
                  { to: "/brand/dior", label: "Dior" },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 ${pathname === link.to ? 'font-bold text-cyan-600 bg-gray-50' : 'text-gray-700'}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/brands"
                  className={`block px-4 py-2 text-sm hover:bg-gray-100 border-t border-gray-200 ${pathname === '/brands' ? 'font-bold text-cyan-600 bg-gray-50' : 'text-gray-700'}`}
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
