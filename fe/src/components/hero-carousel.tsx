"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    title: "LATEST NIKE SHOES",
    subtitle: "UP TO 80% OFF",
    description: "Best Deals Online for Genuine Products",
    image: "/nike-dau-trang.png",
  },
  {
    title: "ADIDAS COLLECTION",
    subtitle: "UP TO 70% OFF",
    description: "Premium Sports Gear at Unbeatable Prices",
    image: "/mu-adidas-dau-trang.png",
  },
  {
    title: "DIOR LUXURY",
    subtitle: "UP TO 60% OFF",
    description: "Exclusive Designer Items",
    image: "/dior-dau-trang.png",
  },
]

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % slides.length)
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="relative bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl overflow-hidden h-52 flex items-center">
        {/* Left Button */}
        <button onClick={prev} className="absolute left-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Slider Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full flex items-center relative px-12">
              <div className="w-full z-5">
                <p className="text-white text-sm font-medium mb-2">{slide.description}</p>
                <h2 className="text-white text-4xl font-bold mb-1">{slide.title}</h2>
                <p className="text-white text-lg font-bold mb-4">{slide.subtitle}</p>
                <div className="flex gap-1 absolute bottom-8 left-12">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-2 bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>
              <img
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                className="absolute right-8 h-48 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button onClick={next} className="absolute right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition">
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </div>
  )
}
