import { useEffect, useMemo, useState } from "react"
import { productApi, ApiProduct } from "@/lib/api"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "@/contexts/auth-context"

type TabType = "all" | "pending"

export default function Products() {
  const { user } = useAuth()
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data =
        activeTab === "all"
          ? await productApi.getAll("ALL")
          : await productApi.getPendingProducts()
      setProducts(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Cannot load product list")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const filtered = useMemo(() => {
    if (!keyword) return products
    const kw = keyword.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw) ||
        p.categoryName.toLowerCase().includes(kw)
    )
  }, [products, keyword])

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await productApi.delete(id)
      // Optimistic update: Remove from local state immediately
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success("Product deleted successfully")
    } catch (err: any) {
      setError(err.message || "Failed to delete product")
      toast.error("Failed to delete product")
      // Re-fetch on error to ensure sync
      fetchProducts()
    }
  }

  const approveProduct = async (productId: string) => {
    if (!user?.id) {
      toast.error("User not authenticated")
      return
    }
    try {
      await productApi.approveProduct(productId, user.id)
      // Optimistic update: Update local state immediately
      setProducts(prev => prev.map(p =>
        p.id === productId ? { ...p, status: "APPROVED" } : p
      ))
      toast.success("Product approved")
    } catch (err: any) {
      setError(err.message || "Product approval failed")
      toast.error("Product approval failed")
      // Revert or re-fetch on error if needed, but for now just show error
      fetchProducts()
    }
  }

  const handleRejectClick = (product: ApiProduct) => {
    setSelectedProduct(product)
    setShowRejectModal(true)
  }

  const rejectProduct = async () => {
    if (!selectedProduct || !rejectionReason.trim()) {
      toast.error("Please enter rejection reason")
      return
    }
    if (!user?.id) {
      toast.error("User not authenticated")
      return
    }
    try {
      await productApi.rejectProduct(selectedProduct.id, user.id, rejectionReason)
      // Optimistic update: Update local state immediately
      setProducts(prev => prev.map(p =>
        p.id === selectedProduct.id ? { ...p, status: "REJECTED" } : p
      ))
      setShowRejectModal(false)
      setRejectionReason("")
      setSelectedProduct(null)
      toast.success("Product rejected")
    } catch (err: any) {
      setError(err.message || "Product rejection failed")
      toast.error("Product rejection failed")
      fetchProducts()
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Product Management</h1>
            <p className="text-slate-500">View and manage all products</p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by name, description..."
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`${activeTab === "all"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`${activeTab === "pending"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Pending Approval
            </button>
          </nav>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Image
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Product Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Category
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">Price</th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Stock
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt={product.images[0].altText || product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-xs text-gray-500">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.categoryName}</td>
                    <td className="px-4 py-3">
                      {product.price.toLocaleString()} VND
                    </td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${product.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : product.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {product.status === "APPROVED"
                          ? "Approved"
                          : product.status === "PENDING"
                            ? "Pending"
                            : "Rejected"}
                      </span>
                    </td>
                    <td className="space-x-2 px-4 py-3">
                      {product.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => approveProduct(product.id)}
                            className="mr-2 text-sm font-medium text-green-600 hover:text-green-800"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectClick(product)}
                            className="mr-2 text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">Reject Product</h3>
            <p className="mb-2">
              Product: <span className="font-semibold">{selectedProduct?.name}</span>
            </p>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="h-24 w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter rejection reason..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason("")
                  setSelectedProduct(null)
                }}
                className="rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={rejectProduct}
                disabled={!rejectionReason.trim()}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
