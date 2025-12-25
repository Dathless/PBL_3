"use client"

import { Link } from "react-router-dom"

export function ShopByBrands() {
  const brands = [
    { name: "ZARA", slug: "zara", image: "/logos/zara_logo_1766693704886.png" },
    { name: "D&G", slug: "dg", image: "/logos/dg_logo_1766693722076.png" },
    { name: "H&M", slug: "hm", image: "/logos/hm_logo_1766693736751.png" },
    { name: "CHANEL", slug: "chanel", image: "/logos/chanel_logo_1766693752504.png" },
    { name: "PRADA", slug: "prada", image: "/logos/prada_logo_1766693765801.png" },
    { name: "BIBA", slug: "biba", image: "/logos/biba_logo_1766693781762.png" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">SHOP BY BRANDS</h2>
        <Link
          to="/brands"
          className="bg-yellow-400 text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-500 transition"
        >
          VIEW ALL
        </Link>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            to={`/brand/${brand.slug}`}
            className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-lg transition cursor-pointer group border border-gray-100"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="w-[70%] h-auto object-contain opacity-70 group-hover:opacity-100 transition duration-300 grayscale group-hover:grayscale-0"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
