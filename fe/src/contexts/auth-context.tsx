"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {api} from "../api/axios"

interface User {
  username: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState< User | null>(null)
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/currentUser");
        console.log(res.data);
        setUser(res.data);
        setIsAuthenticated(true);
      }
      catch (error) {
        console.log("No authenticated user");
        setUser(null);
        setIsAuthenticated(false);
      }
      finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [])

  const login = (username: string) => {
    setIsAuthenticated(true)
    setUser({ username })
    // localStorage.setItem("isAuthenticated", "true")
    // localStorage.setItem("user", JSON.stringify({ email }))
  }

  const logout = async () => {
    // setIsAuthenticated(false)
    // setUser(null)
    // localStorage.removeItem("isAuthenticated")
    // localStorage.removeItem("user")
    try {
      await api.post("/api/auth/logout");
    }
    catch (error) {}
    finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider 
        value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

