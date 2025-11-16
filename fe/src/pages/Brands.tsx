import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { Link } from "react-router-dom"

const BRANDS: { name: string; slug: string; image?: string }[] = [
  { name: "ZARA", slug: "zara" },
  { name: "D&G", slug: "dg" },
  { name: "H&M", slug: "hm" },
  { name: "CHANEL", slug: "chanel" },
  { name: "PRADA", slug: "prada" },
  { name: "ADIDAS", slug: "adidas" },
  { name: "NIKE", slug: "nike" },
  { name: "DIOR", slug: "dior" },
  { name: "GUCCI", slug: "gucci" },
  { name: "BIBA", slug: "biba" },
]

export default function Brands() {
  return (
    <main className="min-h-screen bg-white">
      <TopBanner />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">All Brands</h1>
          <span className="text-sm text-gray-500">{BRANDS.length} brands</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {BRANDS.map((b) => (
            <Link
              key={b.slug}
              to={`/brand/${b.slug}`}
              className="group aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 hover:shadow-lg transition cursor-pointer relative overflow-hidden"
            >
              {b.image ? (
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
              ) : null}
              <span className="absolute inset-0 flex items-center justify-center text-gray-900 font-bold text-lg md:text-xl bg-black/0 group-hover:bg-black/5 transition">
                {b.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <LiteFooter />
    </main>
  )
}
