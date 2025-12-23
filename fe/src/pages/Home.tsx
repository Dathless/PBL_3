import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { HeroCarousel } from "@/components/hero-carousel"
import { InfoCards } from "@/components/info-cards"
import { ShopByBrands } from "@/components/shop-by-brands"
import { DealsOfDay } from "@/components/deals-of-day"
import { Categories } from "@/components/categories"
import { FashionBrands } from "@/components/fashion-brands"
import { FrequentlyBought } from "@/components/frequently-bought"
import { LiteFooter } from "@/components/lite-footer"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Removed auto-redirect for admin/seller to allow viewing home page
    // if (!loading && user?.role === "seller") {
    //   navigate("/seller/dashboard", { replace: true })
    // }
    // if (!loading && user?.role === "admin") {
    //   navigate("/admin/dashboard", { replace: true })
    // }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Allow all users to view home page
  // if (user?.role === "seller" || user?.role === "admin") {
  //   return null
  // }

  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />
      <HeroCarousel />
      <InfoCards />
      <ShopByBrands />
      <DealsOfDay />
      <Categories />
      <FashionBrands />
      <FrequentlyBought />
      <LiteFooter />
    </main>
  )
}

