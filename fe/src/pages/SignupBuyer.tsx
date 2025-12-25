import type React from "react"
import { TopBanner } from "@/components/top-banner"
import { Header } from "@/components/lite-header"
import { LiteFooter } from "@/components/lite-footer"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { userApi } from "@/lib/api"

export default function SignupBuyerPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [errors, setErrors] = useState<{
        fullName?: string
        email?: string
        password?: string
        confirmPassword?: string
    }>({})

    const navigate = useNavigate()
    const { toast } = useToast()

    const validateForm = () => {
        const newErrors: typeof errors = {}

        // Validate full name (only letters and spaces)
        const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/
        if (!nameRegex.test(fullName)) {
            newErrors.fullName = "Full name can only contain letters and spaces"
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Validate password match
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        // Validate password strength
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            await userApi.create({
                fullname: fullName,
                username,
                password,
                email,
                phone,
                address,
                role: "CUSTOMER",
            })

            toast({
                title: "Registration successful!",
                description: "Your account has been created. Please login to continue.",
            })

            navigate(`/login?username=${username}`)
        } catch (error: any) {
            toast({
                title: "Registration failed",
                description: error.message || "Failed to create account. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <TopBanner />
            <Header />

            <div className="max-w-md mx-auto px-4 py-12">
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-cyan-600 font-semibold text-sm hover:text-cyan-700 flex items-center gap-1"
                    >
                        ← Back
                    </button>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                    <p className="text-gray-600">Let's create your account</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Full name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value)
                                setErrors({ ...errors, fullName: undefined })
                            }}
                            placeholder="Enter your full name"
                            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 ${errors.fullName ? "border-red-500" : "border-gray-300"
                                }`}
                            required
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setErrors({ ...errors, email: undefined })
                            }}
                            placeholder="Enter your email address"
                            className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors({ ...errors, password: undefined })
                                }}
                                placeholder="Enter your password"
                                className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 ${errors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value)
                                    setErrors({ ...errors, confirmPassword: undefined })
                                }}
                                placeholder="Confirm your password"
                                className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                    }`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating account..." : `Sign up as Buyer`}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-cyan-600 font-semibold hover:text-cyan-700">
                        Login here
                    </Link>
                </p>
            </div>

            <LiteFooter />
        </main>
    )
}
