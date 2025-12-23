import { useEffect, useState } from "react"
import { promotionApi } from "@/lib/api"

type Promotion = {
  id: string
  name: string
  description: string
  discountPercent: number
  startDate: string
  endDate: string
  active: boolean
}

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountPercent: '',
    startDate: '',
    endDate: '',
    active: true
  })

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const data = await promotionApi.getAll()
      setPromotions(data)
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách khuyến mãi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        name: formData.name,
        description: formData.description,
        discountPercent: parseInt(formData.discountPercent),
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: formData.active
      }

      if (editingPromotion) {
        await promotionApi.update(editingPromotion.id, data)
      } else {
        await promotionApi.create(data)
      }

      await fetchPromotions()
      setShowForm(false)
      setEditingPromotion(null)
      setFormData({
        name: '',
        description: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        active: true
      })
    } catch (err: any) {
      setError(err.message || "Failed to save promotion")
    }
  }

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setFormData({
      name: promotion.name,
      description: promotion.description,
      discountPercent: promotion.discountPercent.toString(),
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      active: promotion.active
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return
    try {
      await promotionApi.delete(id)
      await fetchPromotions()
    } catch (err: any) {
      setError(err.message || "Failed to delete promotion")
    }
  }

  const toggleActive = async (promotion: Promotion) => {
    try {
      await promotionApi.update(promotion.id, { active: !promotion.active })
      await fetchPromotions()
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật trạng thái")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Promotion Management</h1>
          <p className="text-slate-500">Add / edit / delete promotional campaigns</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Promotion
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-lg font-medium mb-4">
            {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Promotion Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.active.toString()}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                  className="w-full border border-slate-200 rounded px-3 py-2"
                >
                  <option value="true">Active</option>
                  <option value="false">Paused</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingPromotion ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingPromotion(null)
                  setFormData({
                    name: '',
                    description: '',
                    discountPercent: '',
                    startDate: '',
                    endDate: '',
                    active: true
                  })
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Discount</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Duration</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => (
                <tr key={promotion.id} className="border-t border-slate-200">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{promotion.name}</div>
                      <div className="text-sm text-gray-500">{promotion.description}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{promotion.discountPercent}%</td>
                  <td className="px-4 py-3">
                    {new Date(promotion.startDate).toLocaleDateString('vi-VN')} - {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(promotion)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        promotion.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {promotion.active ? 'Active' : 'Paused'}
                    </button>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(promotion)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(promotion.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
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
  )
}