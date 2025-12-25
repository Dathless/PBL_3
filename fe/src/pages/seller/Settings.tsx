import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  Save,
  User,
  Building,
  CreditCard,
  Bell,
  Shield
} from "lucide-react"
import SellerLayout from "./SellerLayout"
import { getSellerProfile, updateSellerProfile, getSellerBusiness } from "@/lib/sellerApi"

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("settings")
  const [activeTab, setActiveTab] = useState("profile")
  const sellerId = user?.email || "anonymous-seller"
  const [saving, setSaving] = useState(false)

  // Mock settings data
  const [profile, setProfile] = useState({ name: user?.fullname || "", email: user?.email || "", phone: "", address: "" })

  const [business, setBusiness] = useState({ businessName: "", taxId: "", description: "" })

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!sellerId) return
      const [p, b] = await Promise.all([
        getSellerProfile(sellerId),
        getSellerBusiness(sellerId),
      ])
      if (!mounted) return
      setProfile({
        name: p.name || "",
        email: p.email || user?.email || "",
        phone: p.phone || "",
        address: p.address || "",
      })
      setBusiness({
        businessName: b.businessName || "",
        taxId: b.taxId || "",
        description: b.description || "",
      })
    }
    load()
    return () => { mounted = false }
  }, [sellerId])

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Access denied. Please login as seller.</p>
      </div>
    )
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <SellerLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === tab.id
                      ? "bg-cyan-50 text-cyan-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {activeTab === "profile" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address</label>
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      setSaving(true)
                      try {
                        const saved = await updateSellerProfile(sellerId, profile)
                        setProfile({
                          name: saved.name || "",
                          email: saved.email || "",
                          phone: saved.phone || "",
                          address: saved.address || "",
                        })
                      } finally {
                        setSaving(false)
                      }
                    }}
                    disabled={saving}
                    className="flex items-center gap-2 bg-cyan-600 disabled:opacity-60 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Business Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Business Name</label>
                    <input
                      type="text"
                      value={business.businessName}
                      onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tax ID</label>
                    <input
                      type="text"
                      value={business.taxId}
                      onChange={(e) => setBusiness({ ...business, taxId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description</label>
                    <textarea
                      value={business.description}
                      onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                      placeholder="Describe your business..."
                    />
                  </div>
                  <button className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Bank Transfer</span>
                      <button className="text-cyan-600 hover:text-cyan-700 font-semibold">Edit</button>
                    </div>
                    <p className="text-sm text-gray-600">Account ending in ****1234</p>
                  </div>
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-cyan-500 hover:text-cyan-600 transition">
                    + Add Payment Method
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive email updates about your orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Order Alerts</p>
                      <p className="text-sm text-gray-600">Get notified when you receive new orders</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Low Stock Alerts</p>
                      <p className="text-sm text-gray-600">Receive alerts when products are running low</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h3 className="text-xl font-bold mb-6">Security Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition">
                    <Save className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  )
}

