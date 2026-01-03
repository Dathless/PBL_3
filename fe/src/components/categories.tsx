"use client"

// import { Shirt, Pocket as Jacket, Footprints, Watch, Briefcase, Syringe as Ring } from "lucide-react"
import { Link } from "react-router-dom"

const categories = [
  { name: "T-Shirt", image: "/long-sleeved-blouse-beige.jpg", slug: "t-shirt" },
  { name: "Jacket", image: "/dior-fashion-brand.jpg", slug: "jacket" },
  { name: "Pants", image: "/ysl-fashion-collection.jpg", slug: "pants" },
  { name: "Shoes", image: "/adidas-samba-white-shoes.jpg", slug: "shoes" },
  { name: "Watch", image: "/rolex-daydate-watch.jpg", slug: "watch" },
  { name: "Bag", image: "/dior-saddle-bag.jpg", slug: "bag" },
  { name: "Accessories", image: "/gucci-chain-belt.jpg", slug: "accessories" },
]

export function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">SHOP FROM TOP CATEGORIES</h2>
      <div className="grid grid-cols-7 gap-4">
        {categories.map((category, i) => {
          return (
            <Link
              key={i}
              to={`/category/${category.slug}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl hover:shadow-md transition group border border-gray-200"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-cyan-200 transition">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition duration-500"
                />
              </div>
              <span className="text-xs font-bold text-center text-gray-700 group-hover:text-cyan-600 transition">{category.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
