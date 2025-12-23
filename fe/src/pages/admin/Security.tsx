const checks = [
  { name: "JWT Authentication", status: "OK", detail: "HttpOnly cookie, token validation" },
  { name: "Authorization", status: "OK", detail: "Admin / Seller / Buyer" },
  { name: "CORS", status: "OK", detail: "Limited to frontend domain" },
  { name: "Error Monitoring", status: "Need to enable", detail: "No APM/Centralized logging integration yet" },
]

export default function Security() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">System Monitoring & Security</h1>
        <p className="text-slate-500">Check security configuration, monitoring</p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm divide-y">
        {checks.map(item => (
          <div key={item.name} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">{item.name}</p>
              <p className="text-sm text-slate-500">{item.detail}</p>
            </div>
            <span
              className={`text-xs rounded-full px-3 py-1 font-semibold ${
                item.status === "OK"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

