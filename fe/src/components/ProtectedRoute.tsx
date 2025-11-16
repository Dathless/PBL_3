import { ReactNode, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ("buyer" | "seller")[]
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles,
  redirectTo 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        navigate("/login", { state: { from: location.pathname } })
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Wrong role, redirect based on user role
        if (user.role === "seller") {
          navigate("/seller/dashboard", { replace: true })
        } else {
          navigate(redirectTo || "/", { replace: true })
        }
      }
    }
  }, [user, loading, allowedRoles, navigate, location, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

