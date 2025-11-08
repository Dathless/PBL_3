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
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import BuyNow from './pages/BuyNow'
import Brand from './pages/Brand'
import Category from './pages/Category'
import OrderSuccess from './pages/OrderSuccess'
import Offers from './pages/Offers'

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
              <Route path="/signup" element={<Signup />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/buy-now" element={<BuyNow />} />
              <Route path="/brand/:name" element={<Brand />} />
              <Route path="/category/:type" element={<Category />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/offers" element={<Offers />} />
            </Routes>
            <Toaster />
          </ShippingProvider>
        </BuyNowProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App

