import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { CartProvider } from '@/contexts/cart-context'
import { BuyNowProvider } from '@/contexts/buy-now-context'
import { ShippingProvider } from '@/contexts/shipping-context'
import { Toaster } from '@/components/ui/toaster'
import { ScrollToTop } from '@/components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SignupRoleSelection from './pages/SignupRoleSelection'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import BuyNow from './pages/BuyNow'
import Brand from './pages/Brand'
import Category from './pages/Category'
import OrderSuccess from './pages/OrderSuccess'
import Offers from './pages/Offers'
import Brands from './pages/Brands'
import BuyerOnly from './components/BuyerOnly'
import SellerDashboard from './pages/seller/Dashboard'
import SellerOrders from './pages/seller/Orders'
import SellerProducts from './pages/seller/Products'
import SellerPayouts from './pages/seller/Payouts'
import SellerAnalytics from './pages/seller/Analytics'
import SellerSettings from './pages/seller/Settings'
import SellerSupport from './pages/seller/Support'
import AdminRouter from './pages/admin/AdminRouter'

// Component to redirect based on role
function RoleBasedRedirect() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role === "seller") {
    return <Navigate to="/seller/dashboard" replace />
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return <Navigate to="/" replace />
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BuyNowProvider>
          <ShippingProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignupRoleSelection />} />
              <Route path="/signup/:type" element={<Signup />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<BuyerOnly><Cart /></BuyerOnly>} />
              <Route path="/checkout" element={<BuyerOnly><Checkout /></BuyerOnly>} />
              <Route path="/buy-now" element={<BuyerOnly><BuyNow /></BuyerOnly>} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/brand/:name" element={<Brand />} />
              <Route path="/category/:type" element={<Category />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/seller/dashboard" element={<ProtectedRoute allowedRoles={["seller"]}><SellerDashboard /></ProtectedRoute>} />
              <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={["seller"]}><SellerOrders /></ProtectedRoute>} />
              <Route path="/seller/products" element={<ProtectedRoute allowedRoles={["seller"]}><SellerProducts /></ProtectedRoute>} />
              <Route path="/seller/payouts" element={<ProtectedRoute allowedRoles={["seller"]}><SellerPayouts /></ProtectedRoute>} />
              <Route path="/seller/analytics" element={<ProtectedRoute allowedRoles={["seller"]}><SellerAnalytics /></ProtectedRoute>} />
              <Route path="/seller/settings" element={<ProtectedRoute allowedRoles={["seller"]}><SellerSettings /></ProtectedRoute>} />
              <Route path="/seller/support" element={<ProtectedRoute allowedRoles={["seller"]}><SellerSupport /></ProtectedRoute>} />
              {/* Admin */}
              <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["admin"]}><AdminRouter /></ProtectedRoute>} />
            </Routes>
            <Toaster />
          </ShippingProvider>
        </BuyNowProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

