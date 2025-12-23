const mockPosts = [
  { id: 1, title: "Chính sách khuyến mãi T12", status: "Đã đăng", updatedAt: "2025-12-15" },
  { id: 2, title: "Hướng dẫn người bán mới", status: "Nháp", updatedAt: "2025-12-12" },
]

const mockBanners = [
  { id: 1, name: "Banner Tết", location: "Homepage hero", status: "Đang bật" },
  { id: 2, name: "Flash sale 12.12", location: "Top bar", status: "Đã tắt" },
]

export default function Content() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Quản lý nội dung</h1>
        <p className="text-slate-500">Bài viết, thông báo, banner</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="font-semibold">Bài viết & thông báo</h2>
            <p className="text-sm text-slate-500">Tạo mới, chỉnh sửa, đổi trạng thái</p>
          </div>
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Tạo bài viết
          </button>
        </div>
        <div className="divide-y">
          {mockPosts.map(post => (
            <div key={post.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{post.title}</p>
                <p className="text-xs text-slate-500">Cập nhật {post.updatedAt}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs rounded-full bg-slate-100 px-2 py-1 text-slate-700">{post.status}</span>
                <button className="text-sm text-slate-600 hover:text-slate-900">Sửa</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="font-semibold">Banner</h2>
            <p className="text-sm text-slate-500">Quản lý vị trí hiển thị banner</p>
          </div>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-100">
            Thêm banner
          </button>
        </div>
        <div className="divide-y">
          {mockBanners.map(banner => (
            <div key={banner.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{banner.name}</p>
                <p className="text-xs text-slate-500">Vị trí: {banner.location}</p>
              </div>
              <span className="text-xs rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{banner.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

