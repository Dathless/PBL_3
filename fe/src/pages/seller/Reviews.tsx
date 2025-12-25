import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { reviewApi, productApi } from "@/lib/api"
import { Star } from "lucide-react"
import SellerLayout from "./SellerLayout"

type Review = {
    id: string
    productId: string
    productName: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: string
    approved: boolean
}

export default function SellerReviews() {
    const { user } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeMenu, setActiveMenu] = useState("reviews")

    useEffect(() => {
        const fetchReviews = async () => {
            if (!user?.id) return

            try {
                setLoading(true)
                // Get all products by this seller
                const products = await productApi.getBySeller(user.id)

                // Get reviews for each product
                const allReviews: Review[] = []
                for (const product of products) {
                    const productReviews = await reviewApi.getByProduct(product.id)
                    allReviews.push(...productReviews)
                }

                setReviews(allReviews)
            } catch (err: any) {
                setError(err.message || "Failed to load reviews")
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [user])

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
            />
        ))
    }

    const approvedReviews = reviews.filter(r => r.approved)
    const pendingReviews = reviews.filter(r => !r.approved)

    return (
        <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Product Reviews</h2>
                    <p className="text-gray-600">View customer reviews for your products</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-600">Loading reviews...</p>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
                                <p className="text-3xl font-bold">{reviews.length}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                                <p className="text-sm text-green-700 mb-1">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{approvedReviews.length}</p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                                <p className="text-sm text-yellow-700 mb-1">Pending Approval</p>
                                <p className="text-3xl font-bold text-yellow-600">{pendingReviews.length}</p>
                            </div>
                        </div>

                        {/* Reviews List */}
                        {reviews.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                <p className="text-gray-500">No reviews yet</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-bold text-gray-900">{review.userName}</span>
                                                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString("en-US")}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-cyan-600 mb-2">
                                                    Product: {review.productName}
                                                </p>
                                                <p className="text-gray-700">{review.comment}</p>
                                            </div>
                                            <div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${review.approved
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {review.approved ? "Approved" : "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </SellerLayout>
    )
}
