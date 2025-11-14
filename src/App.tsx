import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/auth-context'
import { CartProvider } from '@/contexts/cart-context'
import { BuyNowProvider } from '@/contexts/buy-now-context'
import { ShippingProvider } from '@/contexts/shipping-context'
import { Toaster } from '@/components/ui/toaster'
import { ScrollToTop } from '@/components/ScrollToTop'

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
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/orders" element={<SellerOrders />} />
              <Route path="/seller/products" element={<SellerProducts />} />
              <Route path="/seller/payouts" element={<SellerPayouts />} />
              <Route path="/seller/analytics" element={<SellerAnalytics />} />
              <Route path="/seller/settings" element={<SellerSettings />} />
              <Route path="/seller/support" element={<SellerSupport />} />
            </Routes>
            <Toaster />
          </ShippingProvider>
        </BuyNowProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

