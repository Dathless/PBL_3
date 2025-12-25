export default function Settings() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">System Configuration</h1>
        <p className="text-slate-500">Fees, policies, categories</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Fee Configuration</p>
          <p className="text-sm text-slate-500 mb-3">Transaction fees, commission</p>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600">Transaction Fee (%)</label>
              <input type="number" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue={2} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Seller Commission (%)</label>
              <input type="number" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue={5} />
            </div>
            <button className="w-full rounded-md bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800">Save</button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Policies</p>
          <p className="text-sm text-slate-500 mb-3">Regulations, terms</p>
          <textarea className="w-full h-40 rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue="Update return policy, warranty..."></textarea>
          <button className="mt-3 w-full rounded-md border border-slate-200 py-2 text-sm font-medium hover:bg-slate-100">Update</button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Categories</p>
          <p className="text-sm text-slate-500 mb-3">Add / edit categories</p>
          <div className="space-y-3">
            <input placeholder="New category name" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            <button className="w-full rounded-md border border-slate-200 py-2 text-sm font-medium hover:bg-slate-100">Add</button>
            <p className="text-xs text-slate-500">Current categories are synced from backend</p>
          </div>
        </section>
      </div>
    </div>
  )
}

