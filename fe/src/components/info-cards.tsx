import { Truck, RotateCcw, DollarSign, Headphones } from "lucide-react"

const cards = [
  {
    icon: Truck,
    title: "FAST DELIVERY",
    subtitle: "Dispatch within 24 hours",
  },
  {
    icon: RotateCcw,
    title: "24-HOURS RETURN",
    subtitle: "100% money-back guarantee",
  },
  {
    icon: DollarSign,
    title: "DOLLAR PAYMENT",
    subtitle: "Safe secure & trusted",
  },
  {
    icon: Headphones,
    title: "SUPPORT 24/7",
    subtitle: "Call us anytime 24/7",
  },
]

export function InfoCards() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:shadow-md hover:bg-white transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <h3 className="font-serif font-black text-base text-gray-900 tracking-wide uppercase">{card.title}</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">{card.subtitle}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
