"use client"

import { useState, useEffect } from "react"
import { Tag, Calendar } from "lucide-react"
import { promotionApi } from "@/lib/api"

interface Promotion {
    id: string
    name: string
    description: string
    discountPercent: number
    startDate: string
    endDate: string
    active: boolean
}

export function ActivePromotions() {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadPromotions = async () => {
            try {
                setLoading(true)
                const allPromotions = await promotionApi.getAll()

                // Filter for active promotions within valid date range
                const now = new Date()
                const activePromotions = allPromotions.filter(promo => {
                    if (!promo.active) return false

                    const startDate = new Date(promo.startDate)
                    const endDate = new Date(promo.endDate)

                    return now >= startDate && now <= endDate
                })

                setPromotions(activePromotions)
            } catch (error) {
                console.error("Error loading promotions:", error)
            } finally {
                setLoading(false)
            }
        }

        loadPromotions()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center py-8">Loading promotions...</div>
            </div>
        )
    }

    if (promotions.length === 0) {
        return null // Don't show section if no active promotions
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Tag className="w-6 h-6 text-purple-600" />
                    ACTIVE PROMOTIONS
                </h2>
                <p className="text-gray-600 text-sm mt-1">Don't miss out on these amazing deals!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                    <div
                        key={promo.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border-2 border-purple-200"
                    >
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg">{promo.name}</h3>
                                <div className="bg-white text-purple-600 px-3 py-1 rounded-full font-bold text-xl">
                                    {promo.discountPercent}% OFF
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-gray-700 text-sm mb-4">{promo.description}</p>

                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <div>
                                    <div className="font-semibold text-xs text-gray-500">Valid Period</div>
                                    <div className="font-medium">
                                        {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Promotion Code</span>
                                    <span className="font-mono font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded">
                                        {promo.name.toUpperCase().replace(/\s+/g, '')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
