export default function Settings() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Cấu hình hệ thống</h1>
        <p className="text-slate-500">Phí, chính sách, danh mục</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Cấu hình phí</p>
          <p className="text-sm text-slate-500 mb-3">Phí giao dịch, hoa hồng</p>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600">Phí giao dịch (%)</label>
              <input type="number" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue={2} />
            </div>
            <div>
              <label className="text-sm text-slate-600">Hoa hồng seller (%)</label>
              <input type="number" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue={5} />
            </div>
            <button className="w-full rounded-md bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800">Lưu</button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Chính sách</p>
          <p className="text-sm text-slate-500 mb-3">Quy định, điều khoản</p>
          <textarea className="w-full h-40 rounded-md border border-slate-200 px-3 py-2 text-sm" defaultValue="Cập nhật chính sách đổi trả, bảo hành..."></textarea>
          <button className="mt-3 w-full rounded-md border border-slate-200 py-2 text-sm font-medium hover:bg-slate-100">Cập nhật</button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="font-semibold">Danh mục</p>
          <p className="text-sm text-slate-500 mb-3">Thêm / sửa danh mục</p>
          <div className="space-y-3">
            <input placeholder="Tên danh mục mới" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            <button className="w-full rounded-md border border-slate-200 py-2 text-sm font-medium hover:bg-slate-100">Thêm</button>
            <p className="text-xs text-slate-500">Danh mục hiện tại được đồng bộ từ backend</p>
          </div>
        </section>
      </div>
    </div>
  )
}

