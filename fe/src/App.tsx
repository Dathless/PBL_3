import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './components/PageTransition'

import { AuthProvider } from '@/contexts/auth-context'
import { CartProvider } from '@/contexts/cart-context'
import { BuyNowProvider } from '@/contexts/buy-now-context'
import { ShippingProvider } from '@/contexts/shipping-context'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ChatbotWidget } from '@/components/ChatbotWidget'
import ProtectedRoute from './components/ProtectedRoute'
import { NotificationProvider } from '@/contexts/notification-context'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignupBuyer from './pages/SignupBuyer'
import SignupSeller from './pages/SignupSeller'
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
import SellerReviews from './pages/seller/Reviews'
import SellerSettings from './pages/seller/Settings'
import SellerSupport from './pages/seller/Support'
import SellerMessages from './pages/seller/Messages'
import BuyerMessages from './pages/BuyerMessages'
import MyOrders from './pages/MyOrders'
import Profile from './pages/Profile'
import Deals from './pages/Deals'
import FrequentlyBoughtPage from './pages/FrequentlyBoughtPage'
import AdminRouter from './pages/admin/AdminRouter'

function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <BuyNowProvider>
            <ShippingProvider>
              <ScrollToTop />
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                  <Route path="/signup" element={<PageTransition><SignupRoleSelection /></PageTransition>} />
                  <Route path="/signup/buyer" element={<PageTransition><SignupBuyer /></PageTransition>} />
                  <Route path="/signup/seller" element={<PageTransition><SignupSeller /></PageTransition>} />
                  <Route path="/product/:id" element={<PageTransition><Product /></PageTransition>} />
                  <Route path="/cart" element={<PageTransition><BuyerOnly><Cart /></BuyerOnly></PageTransition>} />
                  <Route path="/checkout" element={<PageTransition><BuyerOnly><Checkout /></BuyerOnly></PageTransition>} />
                  <Route path="/buy-now" element={<PageTransition><BuyerOnly><BuyNow /></BuyerOnly></PageTransition>} />
                  <Route path="/brands" element={<PageTransition><Brands /></PageTransition>} />
                  <Route path="/brand/:name" element={<PageTransition><Brand /></PageTransition>} />
                  <Route path="/category/:type" element={<PageTransition><Category /></PageTransition>} />
                  <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
                  <Route path="/offers" element={<PageTransition><Offers /></PageTransition>} />
                  <Route path="/deals" element={<PageTransition><Deals /></PageTransition>} />
                  <Route path="/frequently-bought" element={<PageTransition><FrequentlyBoughtPage /></PageTransition>} />
                  <Route path="/profile" element={<PageTransition><ProtectedRoute allowedRoles={["buyer", "seller"]}><Profile /></ProtectedRoute></PageTransition>} />
                  <Route path="/my-orders" element={<PageTransition><ProtectedRoute allowedRoles={["buyer"]}><MyOrders /></ProtectedRoute></PageTransition>} />
                  <Route path="/messages" element={<PageTransition><ProtectedRoute allowedRoles={["buyer"]}><BuyerMessages /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/dashboard" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerDashboard /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/orders" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerOrders /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/products" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerProducts /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/payouts" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerPayouts /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/analytics" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerAnalytics /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/reviews" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerReviews /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/settings" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerSettings /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/support" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerSupport /></ProtectedRoute></PageTransition>} />
                  <Route path="/seller/messages" element={<PageTransition><ProtectedRoute allowedRoles={["seller"]}><SellerMessages /></ProtectedRoute></PageTransition>} />
                  {/* Admin */}
                  <Route path="/admin/*" element={<PageTransition><ProtectedRoute allowedRoles={["admin"]}><AdminRouter /></ProtectedRoute></PageTransition>} />
                </Routes>
              </AnimatePresence>
              <ChatbotWidget />
              <Toaster />
              <SonnerToaster />
            </ShippingProvider>
          </BuyNowProvider>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App

