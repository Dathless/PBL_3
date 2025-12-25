import type React from "react"
import { useState, useEffect } from "react"
import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { useAuth } from "@/contexts/auth-context"
import { userApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { User, MapPin, Mail, Loader2, Save } from "lucide-react"

export default function ProfilePage() {
    const { user, refreshUser } = useAuth()
    const { toast } = useToast()
    const [isSaving, setIsSaving] = useState(false)
    const [profile, setProfile] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        address: "",
    })

    useEffect(() => {
        if (user) {
            setProfile({
                fullname: user.fullname || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            })
        }
    }, [user])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) return

        setIsSaving(true)
        try {
            await userApi.update(user.id, profile)
            toast({
                title: "Success!",
                description: "Your profile has been updated.",
            })
            // Update local auth context if needed
            if (refreshUser) refreshUser()
        } catch (error: any) {
            toast({
                title: "Update failed",
                description: error.message || "Could not update profile.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <TopBanner />
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-cyan-600 px-8 py-12 text-white relative">
                        <div className="flex items-end gap-6 relative z-10">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-cyan-600 shadow-xl border-4 border-white/20">
                                <User className="w-12 h-12" />
                            </div>
                            <div className="mb-2">
                                <h1 className="text-3xl font-bold">{profile.fullname}</h1>
                                <p className="text-cyan-100">@{profile.username} • {user.role === 'seller' ? 'Seller' : 'Buyer'}</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleUpdate} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <User className="w-5 h-5 text-cyan-500" />
                                    Basic Information
                                </h3>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.fullname}
                                        onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
                                        className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-cyan-500 transition font-medium"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={profile.username}
                                        disabled
                                        className="w-full border-b border-gray-200 py-2 bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-cyan-500" />
                                    Contact & Address
                                </h3>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-cyan-500 transition font-medium"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-cyan-500 transition font-medium"
                                        placeholder="0123 456 789"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-cyan-500" />
                                    Default Address
                                </label>
                                <textarea
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:border-cyan-500 transition h-32 resize-none"
                                    placeholder="Enter your shipping address..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-red-700 transition shadow-lg shadow-red-200 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <LiteFooter />
        </main>
    )
}
