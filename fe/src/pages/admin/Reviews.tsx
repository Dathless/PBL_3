import { useEffect, useState } from "react"
import { reviewApi } from "@/lib/api"

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

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await reviewApi.getAll()
      setReviews(data)
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách đánh giá")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await reviewApi.approve(id)
      await fetchReviews()
    } catch (err: any) {
      setError(err.message || "Failed to approve review")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return
    try {
      await reviewApi.delete(id)
      await fetchReviews()
    } catch (err: any) {
      setError(err.message || "Failed to delete review")
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Review Management</h1>
          <p className="text-slate-500">View and moderate product reviews</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.userName}</span>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-medium text-blue-600">{review.productName}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!review.approved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}