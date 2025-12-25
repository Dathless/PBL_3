import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Sat", users: 120, orders: 320 },
  { name: "Sun", users: 140, orders: 280 },
  { name: "Mon", users: 160, orders: 350 },
  { name: "Tue", users: 180, orders: 420 },
  { name: "Wed", users: 170, orders: 390 },
  { name: "Thu", users: 190, orders: 450 },
  { name: "Fri", users: 210, orders: 480 },
]

export default function Reports() {
  const totalUsers = useMemo(() => data.reduce((s, d) => s + d.users, 0), [])
  const totalOrders = useMemo(() => data.reduce((s, d) => s + d.orders, 0), [])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Reports & Charts</h1>
        <p className="text-slate-500">System activity and growth statistics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Number of users (week)</p>
          <p className="text-3xl font-semibold">{totalUsers}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Orders (week)</p>
          <p className="text-3xl font-semibold">{totalOrders}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold">System Activity</p>
          <span className="text-xs text-slate-500">Last week</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#0f172a" name="Users" />
              <Bar dataKey="orders" fill="#94a3b8" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

