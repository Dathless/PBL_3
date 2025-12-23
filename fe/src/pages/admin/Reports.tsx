import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "T7", users: 120, orders: 320 },
  { name: "CN", users: 140, orders: 280 },
  { name: "T2", users: 160, orders: 350 },
  { name: "T3", users: 180, orders: 420 },
  { name: "T4", users: 170, orders: 390 },
  { name: "T5", users: 190, orders: 450 },
  { name: "T6", users: 210, orders: 480 },
]

export default function Reports() {
  const totalUsers = useMemo(() => data.reduce((s, d) => s + d.users, 0), [])
  const totalOrders = useMemo(() => data.reduce((s, d) => s + d.orders, 0), [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Báo cáo & biểu đồ</h1>
        <p className="text-slate-500">Hoạt động hệ thống và thống kê tăng trưởng</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Số người dùng (tuần)</p>
          <p className="text-3xl font-semibold">{totalUsers}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Đơn hàng (tuần)</p>
          <p className="text-3xl font-semibold">{totalOrders}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">Hoạt động hệ thống</p>
          <span className="text-xs text-slate-500">Tuần gần nhất</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#0f172a" name="Người dùng" />
              <Bar dataKey="orders" fill="#94a3b8" name="Đơn hàng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

