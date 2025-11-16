import { ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"

export default function BuyerOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.role === "seller") {
      navigate("/seller/dashboard", { replace: true })
    }
  }, [user, navigate])

  if (user?.role === "seller") return null
  return <>{children}</>
}
