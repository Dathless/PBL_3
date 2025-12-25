const mockComplaints = [
  { id: "CP-001", user: "buyer01", type: "Order Complaint", status: "In progress", createdAt: "2025-12-18" },
  { id: "CP-002", user: "seller02", type: "Violation Report", status: "Received", createdAt: "2025-12-17" },
]

export default function Complaints() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Complaints & Violations</h1>
        <p className="text-slate-500">Receive, classify, and track progress</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div>
            <p className="font-semibold">Request List</p>
            <p className="text-sm text-slate-500">Updated in real-time</p>
          </div>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-100">
            Create ticket
          </button>
        </div>
        <div className="divide-y">
          {mockComplaints.map(item => (
            <div key={item.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{item.id} - {item.type}</p>
                <p className="text-xs text-slate-500">Sender: {item.user} | {item.createdAt}</p>
              </div>
              <span className="text-xs rounded-full bg-amber-50 px-2 py-1 text-amber-700">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

