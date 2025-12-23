"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { authApi } from "@/lib/api"

export type UserRole = "buyer" | "seller" | "admin"

interface User {
  id: string
  username: string
  email?: string
  role: UserRole
  name?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const userData = await authApi.getCurrentUser()
      const role = userData.role === "CUSTOMER"
        ? "buyer"
        : userData.role === "SELLER"
          ? "seller"
          : "admin"
      setUser({
        id: userData.Id,
        username: userData.username,
        role: role as UserRole,
        name: userData.fullname,
      })
      console.log("id = " + userData.Id)
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password)
      const role = response.role === "CUSTOMER"
        ? "buyer"
        : response.role === "SELLER"
          ? "seller"
          : "admin"
      const userData: User = {
        id: "", // Will be fetched from getCurrentUser
        username: response.username,
        role: role as UserRole,
        name: response.fullname,
      }
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem("token", response.token)
      }
      setUser(userData)
      setIsAuthenticated(true)
      // Refresh to get full user data including ID
      await refreshUser()
    } catch (error: any) {
      throw new Error(error.message || "Login failed")
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await authApi.getCurrentUser()
      const role = userData.role === "CUSTOMER"
        ? "buyer"
        : userData.role === "SELLER"
          ? "seller"
          : "admin"
      setUser({
        id: userData.Id,
        username: userData.username,
        role: role as UserRole,
        name: userData.fullname,
      })
      setIsAuthenticated(true)
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

