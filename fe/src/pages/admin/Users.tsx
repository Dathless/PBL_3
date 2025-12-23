import { useEffect, useMemo, useState } from "react"
import { userApi } from "@/lib/api"

type AdminUser = {
  id: string
  fullname: string
  username: string
  email: string
  phone: string
  address: string
  enabled: boolean
  role: "ADMIN" | "CUSTOMER" | "SELLER"
}

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log("Fetching users...")
      
      const data = await userApi.getAll()
      console.log("Users data:", data)
      setUsers(data)
    } catch (err: any) {
      console.error("Error fetching users:", err)
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = useMemo(() => {
    if (!keyword) return users
    const kw = keyword.toLowerCase()
    return users.filter(
      u =>
        u.username.toLowerCase().includes(kw) ||
        (u.fullname || "").toLowerCase().includes(kw) ||
        (u.email || "").toLowerCase().includes(kw)
    )
  }, [users, keyword])

  const toggleActive = async (user: AdminUser) => {
    try {
      setSavingId(user.id)
      await userApi.update(user.id, { enabled: !user.enabled })
      await fetchUsers()
    } catch (err: any) {
      setError(err.message || "Failed to update status")
    } finally {
      setSavingId(null)
    }
  }

  const changeRole = async (user: AdminUser, role: AdminUser["role"]) => {
    try {
      setSavingId(user.id)
      await userApi.update(user.id, { role })
      await fetchUsers()
    } catch (err: any) {
      setError(err.message || "Failed to update role")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-slate-500">Add / edit / lock / assign roles</p>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Search by name, email..."
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>

      {loading ? (
        <p className="text-slate-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Username</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{user.fullname || "Chưa cập nhật"}</p>
                    <p className="text-xs text-slate-500">{user.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{user.username}</td>
                  <td className="px-4 py-3 text-slate-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={e => changeRole(user, e.target.value as AdminUser["role"])}
                      className="rounded border border-slate-200 px-2 py-1 text-sm"
                      disabled={savingId === user.id}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="SELLER">SELLER</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.enabled
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {user.enabled ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleActive(user)}
                      disabled={savingId === user.id}
                      className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium hover:bg-slate-100"
                    >
                      {user.enabled ? "Khóa" : "Mở khóa"}
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

