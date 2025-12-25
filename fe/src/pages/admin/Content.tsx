const mockPosts = [
  { id: 1, title: "Promotion Policy Dec", status: "Published", updatedAt: "2025-12-15" },
  { id: 2, title: "New Seller Guide", status: "Draft", updatedAt: "2025-12-12" },
]

const mockBanners = [
  { id: 1, name: "New Year Banner", location: "Homepage hero", status: "Enabled" },
  { id: 2, name: "Flash sale 12.12", location: "Top bar", status: "Disabled" },
]

export default function Content() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Content Management</h1>
        <p className="text-slate-500">Posts, announcements, banners</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="font-semibold">Posts & Announcements</h2>
            <p className="text-sm text-slate-500">Create, edit, change status</p>
          </div>
          <button className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Create post
          </button>
        </div>
        <div className="divide-y">
          {mockPosts.map(post => (
            <div key={post.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{post.title}</p>
                <p className="text-xs text-slate-500">Updated {post.updatedAt}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs rounded-full bg-slate-100 px-2 py-1 text-slate-700">{post.status}</span>
                <button className="text-sm text-slate-600 hover:text-slate-900">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="font-semibold">Banners</h2>
            <p className="text-sm text-slate-500">Manage banner display locations</p>
          </div>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-100">
            Add banner
          </button>
        </div>
        <div className="divide-y">
          {mockBanners.map(banner => (
            <div key={banner.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">{banner.name}</p>
                <p className="text-xs text-slate-500">Location: {banner.location}</p>
              </div>
              <span className="text-xs rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{banner.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

