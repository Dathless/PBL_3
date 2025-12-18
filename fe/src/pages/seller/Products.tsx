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
import { productApi, categoryApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  category: string
  categoryId: number
  status: string
  size?: string
  color?: string
  brand?: string
  images?: Array<{ id: number; imageUrl: string; altText?: string }>
}

export default function ProductsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeMenu, setActiveMenu] = useState("products")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", stock: "", categoryId: "", description: "", brand: "", color: "", imageUrl: "" })
  const [addSizes, setAddSizes] = useState<string[]>([])
  const [addColors, setAddColors] = useState<string[]>([])
  const [editForm, setEditForm] = useState<{ id: string; name: string; price: string; stock: string; categoryId: string; size?: string; color?: string; imageUrl?: string; description?: string } | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editSizes, setEditSizes] = useState<string[]>([])
  const [editColors, setEditColors] = useState<string[]>([])

  const sizeOptions: Record<string, string[]> = {
    Shoes: ["36","37","38","39","40","41","42","43","44","45"],
    "T-Shirt": ["XS","S","M","L","XL","XXL"],
    Bag: ["One Size"],
    Accessories: ["One Size"],
    Watches: ["One Size"],
  }

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryApi.getAll()
        setCategories(cats)
        // Set default category if available
        if (cats.length > 0 && !form.categoryId) {
          setForm(prev => ({ ...prev, categoryId: String(cats[0].id) }))
        }
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }
    loadCategories()
  }, [])

  // Load products from backend - filter by seller_id
  useEffect(() => {
    const loadProducts = async () => {
      if (!user?.id) return
      else console.log("Loading products for seller id =", user.id)
      setLoading(true)
      try {
        // Get all products
        const allProducts = await productApi.getAll()
        // Filter products by seller_id (assuming ProductDTO has sellerId field)
        // If backend doesn't have seller_id yet, this will show empty list
        const sellerProducts = allProducts.filter((p: any) => {
          // Check if product has sellerId field and matches current user
          // For now, if sellerId doesn't exist, return empty array
          return p.sellerId === user.id || (p.seller && p.seller.id === user.id)
        })
        
        const productList = sellerProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          stock: p.stock,
          category: "", // Will be loaded from category
          categoryId: p.categoryId || 0,
          status: p.status || "ACTIVE",
          size: p.size,
          color: p.color,
          brand: p.brand,
          images: p.images || [],
        }))
        setProducts(productList)
      } catch (error) {
        console.error("Error loading products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [user?.id])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Helper to parse JSON array string
  const parseJsonArray = (jsonString: string | null | undefined): string[] => {
    if (!jsonString) return []
    try {
      const parsed = JSON.parse(jsonString)
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item && item.trim() !== "")
      }
      return []
    } catch {
      return []
    }
  }

  // Helper to create JSON array string
  const createJsonArray = (arr: string[]): string => {
    return JSON.stringify(arr.filter(item => item && item.trim() !== ""))
  }

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
                  src={product.images && product.images.length > 0 ? product.images[0].imageUrl : "/placeholder.svg"}
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
                <p className="text-sm text-gray-600 mb-4">
                  Category: {categories.find(c => c.id === product.categoryId)?.name || "Unknown"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const sizes = parseJsonArray(product.size)
                      const colors = parseJsonArray(product.color)
                      setEditForm({
                        id: product.id,
                        name: product.name,
                        price: String(product.price),
                        stock: String(product.stock),
                        categoryId: String(product.categoryId),
                        size: product.size,
                        color: product.color,
                        imageUrl: product.images && product.images.length > 0 ? product.images[0].imageUrl : "",
                        description: product.description || "",
                      })
                      setEditSizes(sizes)
                      setEditColors(colors)
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
                      try {
                        await productApi.delete(product.id)
                        setProducts(products.filter(p => p.id !== product.id))
                        toast({
                          title: "Success",
                          description: "Product deleted successfully",
                        })
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message || "Failed to delete product",
                          variant: "destructive",
                        })
                      }
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
                  if (!user?.id) {
                    toast({
                      title: "Error",
                      description: "User not authenticated",
                      variant: "destructive",
                    })
                    return
                  }

                  try {
                    //Parse color and size
                    // const colorInp : string[] = document.getElementById("color-input") ? (document.getElementById("color-input") as HTMLInputElement).value.split(",").map(v => v.trim()).filter(Boolean) : []

                    // Create product with backend API
                    const sizeJson = createJsonArray(addSizes)
                    const colorJson = createJsonArray(addColors)
                    console.log("Creating product with sizes:", sizeJson, "and colors:", colorJson)
                    console.log("Seller ID:", user.id)
                    // Format image URL: "/" + filename + extension
                    let imageUrl = form.imageUrl.trim()
                    if (imageUrl && !imageUrl.startsWith("/")) {
                      // Extract filename and extension
                      const lastSlash = imageUrl.lastIndexOf("/")
                      const filename = lastSlash >= 0 ? imageUrl.substring(lastSlash + 1) : imageUrl
                      imageUrl = "/" + filename
                    }
                    
                    const images = imageUrl ? [{
                      imageUrl: imageUrl,
                      altText: form.name,
                    }] : []

                    const newProduct = await productApi.create({
                      name: form.name,
                      description: form.description,
                      price: Number(form.price || 0),
                      stock: Number(form.stock || 0),
                      brand: form.brand,
                      discount: 0,
                      rating: 0,
                      reviews: 0,
                      size: sizeJson,
                      color: colorJson,
                      status: "AVAILABLE",
                      categoryId: Number(form.categoryId),
                      images: images,
                      sellerId: user.id, // Add seller_id when creating product
                    })
                    console.log("Created product:", newProduct)
                    // Reload products - filter by seller_id
                    const allProducts = await productApi.getAll()
                    const sellerProducts = allProducts.filter((p: any) => {
                      return p.sellerId === user.id || (p.seller && p.seller.id === user.id)
                    })
                    const productList = sellerProducts.map((p: any) => ({
                      id: p.id,
                      name: p.name,
                      description: p.description,
                      price: Number(p.price),
                      stock: p.stock,
                      category: "",
                      categoryId: p.categoryId || 0,
                      status: p.status || "AVAILABLE",
                      size: p.size,
                      color: p.color,
                      images: p.images || [],
                    }))
                    setProducts(productList)

                    setShowAddModal(false)
                    setForm({ name: "", price: "", stock: "", categoryId: form.categoryId, description: "",brand: "", color: "", imageUrl: "" })
                    setAddSizes([])
                    setAddColors([])
                    toast({
                      title: "Success",
                      description: "Product created successfully",
                    })
                  } catch (error: any) {
                    console.error("Error creating product:", error)
                    toast({
                      title: "Error",
                      description: error.message || "Failed to create product",
                      variant: "destructive",
                    })
                  }
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
                    value={form.categoryId}
                    onChange={(e) => { setForm({ ...form, categoryId: e.target.value }); setAddSizes([]) }}
                    required
                  >
                    {categories.length === 0 ? (
                      <option>Loading categories...</option>
                    ) : (
                      categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter product description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Brand</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter product's brand"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Color</label>
                  <input
                    type="text"
                    id="color-input"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter colors separated by comma (e.g. red, blue, green)"
                    value={addColors.join(", ")}
                    onChange={(e) => setAddColors(e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter colors separated by comma. Data will be saved as JSON array.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter image URL"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Size</label>
                  {(() => {
                    const selectedCategory = categories.find(c => String(c.id) === form.categoryId)
                    const categoryName = selectedCategory?.name || ""
                    return sizeOptions[categoryName] ? (
                      <div className="flex flex-wrap gap-2">
                        {sizeOptions[categoryName].map((s) => {
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
                    )
                  })()}
                  <p className="text-xs text-gray-500 mt-1">You can select multiple sizes. Data will be saved as JSON array.</p>
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
                  if (!editForm) return

                  try {
                    const sizeJson = createJsonArray(editSizes)
                    const colorJson = createJsonArray(editColors)
                    
                    // Format image URL: "/" + filename + extension
                    let imageUrl = (editForm.imageUrl || "").trim()
                    if (imageUrl && !imageUrl.startsWith("/")) {
                      // Extract filename and extension
                      const lastSlash = imageUrl.lastIndexOf("/")
                      const filename = lastSlash >= 0 ? imageUrl.substring(lastSlash + 1) : imageUrl
                      imageUrl = "/" + filename
                    }
                    
                    const images = imageUrl ? [{
                      imageUrl: imageUrl,
                      altText: editForm.name,
                    }] : []

                    await productApi.update(editForm.id, {
                      name: editForm.name,
                      description: editForm.description || "",
                      price: Number(editForm.price || 0),
                      stock: Number(editForm.stock || 0),
                      size: sizeJson,
                      color: colorJson,
                      status: "AVAILABLE",
                      categoryId: Number(editForm.categoryId),
                      images: images,
                    })

                    // Reload products - filter by seller_id
                    const allProducts = await productApi.getAll()
                    const sellerProducts = allProducts.filter((p: any) => {
                      return p.sellerId === user.id || (p.seller && p.seller.id === user.id)
                    })
                    const productList = sellerProducts.map((p: any) => ({
                      id: p.id,
                      name: p.name,
                      description: p.description,
                      price: Number(p.price),
                      stock: p.stock,
                      category: "",
                      categoryId: p.categoryId || 0,
                      status: p.status || "ACTIVE",
                      size: p.size,
                      color: p.color,
                      images: p.images || [],
                    }))
                    setProducts(productList)

                    setShowEditModal(false)
                    setEditForm(null)
                    setEditSizes([])
                    setEditColors([])
                    toast({
                      title: "Success",
                      description: "Product updated successfully",
                    })
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description: error.message || "Failed to update product",
                      variant: "destructive",
                    })
                  }
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
                    value={editForm.categoryId}
                    onChange={(e) => { setEditForm({ ...editForm, categoryId: e.target.value }); setEditSizes([]) }}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Size</label>
                  {(() => {
                    const selectedCategory = categories.find(c => String(c.id) === editForm.categoryId)
                    const categoryName = selectedCategory?.name || ""
                    return sizeOptions[categoryName] ? (
                      <div className="flex flex-wrap gap-2">
                        {sizeOptions[categoryName].map((s) => {
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
                    )
                  })()}
                  <p className="text-xs text-gray-500 mt-1">You can select multiple sizes. Data will be saved as JSON array.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Color</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    placeholder="Enter colors separated by comma"
                    value={editColors.join(", ")}
                    onChange={(e) => setEditColors(e.target.value.split(",").map(v => v.trim()).filter(Boolean))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter colors separated by comma. Data will be saved as JSON array.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    value={editForm.imageUrl || ""}
                    onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
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

