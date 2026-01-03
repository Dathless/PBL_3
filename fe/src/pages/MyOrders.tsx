import { useState, useEffect } from "react"
import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useAuth } from "@/contexts/auth-context"
import { orderApi, reviewApi, type OrderDetail } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { Package, Truck, CheckCircle, Clock, XCircle, Search, ChevronRight, ShoppingBag, Star } from "lucide-react"
import { Link } from "react-router-dom"

export default function MyOrdersPage() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<OrderDetail[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
    const [reviewProductId, setReviewProductId] = useState<string | null>(null)
    const [reviewProductName, setReviewProductName] = useState<string>("")
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState("")

    const fetchOrders = async () => {
        if (!user?.id) return
        try {
            const data = await orderApi.getByCustomerId(user.id)
            setOrders(data || [])
        } catch (error) {
            console.error("Failed to fetch orders:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [user])

    const handleCancelOrder = async (orderId: string) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return

        try {
            await orderApi.cancelOrder(orderId)
            alert("Cancellation request submitted successfully.")
            fetchOrders() // Refresh list
            if (selectedOrder?.id === orderId) {
                setIsModalOpen(false)
            }
        } catch (error: any) {
            console.error("Failed to cancel order:", error)
            alert(error.message || "Failed to cancel order. Please try again.")
        }
    }

    const handleReviewClick = (productId: string, productName: string) => {
        setReviewProductId(productId)
        setReviewProductName(productName)
        setReviewRating(5)
        setReviewComment("")
        setIsReviewModalOpen(true)
    }

    const handleSubmitReview = async () => {
        if (!user?.id || !reviewProductId) return

        try {
            await reviewApi.create({
                productId: reviewProductId,
                userId: user.id,
                rating: reviewRating,
                comment: reviewComment
            })
            alert("Review submitted successfully! It will be visible after admin approval.")
            setIsReviewModalOpen(false)
            setReviewProductId(null)
            setReviewComment("")
            setReviewRating(5)
        } catch (error: any) {
            console.error("Failed to submit review:", error)
            alert(error.message || "Failed to submit review. Please try again.")
        }
    }

    const getStatusConfig = (status: string) => {
        switch (status.toUpperCase()) {
            case "PENDING_CONFIRMATION":
                return { label: "Pending Confirmation", color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-4 h-4" /> }
            case "WAITING_FOR_PICKUP":
                return { label: "Waiting for Pickup", color: "bg-orange-100 text-orange-700", icon: <Package className="w-4 h-4" /> }
            case "SHIPPING":
                return { label: "Shipping", color: "bg-blue-100 text-blue-700", icon: <Truck className="w-4 h-4" /> }
            case "DELIVERED":
                return { label: "Delivered", color: "bg-green-100 text-green-700", icon: <CheckCircle className="w-4 h-4" /> }
            case "CANCEL_REQUESTED":
                return { label: "Cancellation Requested", color: "bg-purple-100 text-purple-700", icon: <Clock className="w-4 h-4" /> }
            case "CANCELED":
                return { label: "Canceled", color: "bg-red-100 text-red-700", icon: <XCircle className="w-4 h-4" /> }
            default:
                return { label: status, color: "bg-gray-100 text-gray-700", icon: <Clock className="w-4 h-4" /> }
        }
    }

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some(it => it.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <TopBanner />
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-500 mt-1">Track the journey of your placed orders</p>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-cyan-500 shadow-sm transition"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white h-48 rounded-2xl animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No orders found</h3>
                        <p className="text-gray-500 mt-2 mb-8">It looks like you haven't placed any orders with LITE yet.</p>
                        <Link to="/" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-100">
                            Continue Shopping
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const config = getStatusConfig(order.status)
                            return (
                                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                                    {/* Order Header */}
                                    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs font-medium text-gray-500">{formatDate(order.orderDate)}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
                                            {config.icon}
                                            {config.label}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6 space-y-4">
                                        {order.items.map((item, idx) => (
                                            <Link key={idx} to={`/product/${item.productId}`} className="flex gap-4 group cursor-pointer">
                                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden group-hover:ring-2 ring-cyan-500 transition">
                                                    {item.productImageUrl ? (
                                                        <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-800 truncate group-hover:text-cyan-600 transition">{item.productName}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity} • {item.selectedColor || 'N/A'} • {item.selectedSize || 'N/A'}</p>
                                                    <p className="text-sm font-bold text-cyan-600 mt-2">${item.price.toLocaleString()}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="px-6 py-4 bg-gray-50/30 flex items-center justify-between mt-2">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Total:</span>
                                            <span className="ml-2 font-bold text-xl text-red-600">${order.totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order)
                                                    setIsModalOpen(true)
                                                }}
                                                className="px-5 py-2 rounded-full border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
                                            >
                                                Details
                                            </button>
                                            {(order.status === "PENDING_CONFIRMATION" || order.status === "WAITING_FOR_PICKUP") && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="px-5 py-2 rounded-full border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 transition"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                            {order.status === "DELIVERED" && (
                                                <button
                                                    onClick={() => handleReviewClick(order.items[0].productId, order.items[0].productName)}
                                                    className="px-5 py-2 rounded-full border border-yellow-200 text-sm font-bold text-yellow-600 hover:bg-yellow-50 transition flex items-center gap-1"
                                                >
                                                    <Star className="w-4 h-4" />
                                                    Review
                                                </button>
                                            )}
                                            <button className="px-5 py-2 rounded-full bg-cyan-600 text-white text-sm font-bold hover:bg-cyan-700 transition shadow-lg shadow-cyan-100">
                                                Buy Again
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <p className="text-sm text-gray-500 mt-0.5">#{selectedOrder.id}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
                            >
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-8">
                            {/* Status & Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusConfig(selectedOrder.status).color}`}>
                                        {getStatusConfig(selectedOrder.status).icon}
                                        {getStatusConfig(selectedOrder.status).label}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
                                    <p className="font-bold text-gray-800">{formatDate(selectedOrder.orderDate)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl col-span-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Shipping Address</p>
                                    <p className="font-medium text-gray-700">{selectedOrder.shippingAddress}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
                                    <p className="font-bold text-gray-800">{selectedOrder.paymentMethod}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Amount</p>
                                    <p className="font-bold text-red-600 text-lg">${selectedOrder.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Items Summary</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, idx) => (
                                        <Link key={idx} to={`/product/${item.productId}`} className="flex gap-4 items-center group cursor-pointer" onClick={() => setIsModalOpen(false)}>
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0 group-hover:ring-2 ring-cyan-500 transition">
                                                {item.productImageUrl ? (
                                                    <img src={item.productImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-cyan-600 transition">{item.productName}</h4>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} • {item.selectedColor || 'N/A'} • {item.selectedSize || 'N/A'}</p>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                            {(selectedOrder.status === "PENDING_CONFIRMATION" || selectedOrder.status === "WAITING_FOR_PICKUP") && (
                                <button
                                    onClick={() => handleCancelOrder(selectedOrder.id)}
                                    className="px-8 py-3 rounded-full border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 transition"
                                >
                                    Cancel Order
                                </button>
                            )}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{reviewProductName}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setReviewRating(star)}
                                            className="transition"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= reviewRating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share your experience with this product..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsReviewModalOpen(false)}
                                className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="bg-cyan-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-cyan-700 transition shadow-lg"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <LiteFooter />
        </main>
    )
}
