import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ShoppingCart
} from "lucide-react"
import SellerLayout from "./SellerLayout"
import { getSellerProducts, createProduct, deleteProduct, updateProduct, type Product } from "@/lib/sellerApi"

export default function ProductsPage() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("products")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const sellerId = user?.email || "anonymous-seller"
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "Shoes" })
  const [addSizes, setAddSizes] = useState<string[]>([])
  const [editForm, setEditForm] = useState<{ id: string; name: string; price: string; stock: string; category: string; size?: string; color?: string; image?: string; description?: string } | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editSizes, setEditSizes] = useState<string[]>([])

  const sizeOptions: Record<string, string[]> = {
    Shoes: ["36","37","38","39","40","41","42","43","44","45"],
    "T-Shirt": ["XS","S","M","L","XL","XXL"],
    Bag: ["One Size"],
    Accessories: ["One Size"],
    Watches: ["One Size"],
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!sellerId) return
      setLoading(true)
      try {
        const data = await getSellerProducts(sellerId)
        if (mounted) setProducts(data)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [sellerId])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Please login as seller.</p>
      </div>
    )
  }

  return (
    <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Products</h2>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(!loading ? filteredProducts : []).map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.status === "low_stock" && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Low Stock
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-600 font-semibold">${product.price}</span>
                  <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Category: {product.category}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditForm({
                        id: product.id as unknown as string,
                        name: product.name,
                        price: String(product.price),
                        stock: String(product.stock),
                        category: product.category,
                        size: product.size,
                        color: product.color,
                        image: product.image,
                        description: product.description,
                      })
                      setEditSizes((product.size || "").split(",").map(s => s.trim()).filter(Boolean))
                      setShowEditModal(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Are you sure you want to delete this product?")) return
                      await deleteProduct(product.id as unknown as string)
                      const data = await getSellerProducts(sellerId)
                      setProducts(data)
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No products found</p>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-start justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Add New Product</h3>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  await createProduct(sellerId, {
                    name: form.name,
                    price: Number(form.price || 0),
                    stock: Number(form.stock || 0),
                    category: form.category,
                    status: "active",
                    size: (addSizes.length > 0 ? addSizes : []).join(", "),
                  })
                  const data = await getSellerProducts(sellerId)
                  setProducts(data)
                  setShowAddModal(false)
                  setForm({ name: "", price: "", stock: "", category: form.category })
                  setAddSizes([])
                }}
              >
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Price</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min={0}
                    step={0.01}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stock</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter stock quantity"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={form.category}
                    onChange={(e) => { setForm({ ...form, category: e.target.value }); setAddSizes([]) }}
                  >
                    <option>Shoes</option>
                    <option>Bag</option>
                    <option>Accessories</option>
                    <option>T-Shirt</option>
                    <option>Watches</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Size</label>
                  {sizeOptions[form.category] ? (
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions[form.category].map((s) => {
                        const active = addSizes.includes(s)
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setAddSizes(active ? addSizes.filter(x => x !== s) : [...addSizes, s])}
                            className={`px-3 py-1 rounded-full text-sm border ${active ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"}`}
                          >
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                      placeholder="e.g. One Size or custom"
                      value={addSizes.join(", ")}
                      onChange={(e) => setAddSizes(e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">Bạn có thể chọn nhiều size. Dữ liệu sẽ lưu dạng danh sách.</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setAddSizes([]) }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && editForm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-start justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100 max-h-[85vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4">Edit Product</h3>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  await updateProduct(editForm.id, {
                    name: editForm.name,
                    price: Number(editForm.price || 0),
                    stock: Number(editForm.stock || 0),
                    category: editForm.category,
                    size: (editSizes.length > 0 ? editSizes : []).join(", "),
                    color: editForm.color,
                    image: editForm.image,
                    description: editForm.description,
                  })
                  const data = await getSellerProducts(sellerId)
                  setProducts(data)
                  setShowEditModal(false)
                  setEditForm(null)
                  setEditSizes([])
                }}
              >
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Price</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    required
                    min={0}
                    step={0.01}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Stock</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    required
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.category}
                    onChange={(e) => { setEditForm({ ...editForm, category: e.target.value }); setEditSizes([]) }}
                  >
                    <option>Shoes</option>
                    <option>Bag</option>
                    <option>Accessories</option>
                    <option>T-Shirt</option>
                    <option>Watches</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Size</label>
                  {sizeOptions[editForm.category] ? (
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions[editForm.category].map((s) => {
                        const active = editSizes.includes(s)
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setEditSizes(active ? editSizes.filter(x => x !== s) : [...editSizes, s])}
                            className={`px-3 py-1 rounded-full text-sm border ${active ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"}`}
                          >
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                      placeholder="e.g. One Size or custom"
                      value={editSizes.join(", ")}
                      onChange={(e) => setEditSizes(e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">Bạn có thể chọn nhiều size. Dữ liệu sẽ lưu dạng danh sách.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Color</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.color || ""}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.image || ""}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditForm(null) }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  )
}

