"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

type User = {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

type AuthProviderState = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const initialState: AuthProviderState = {
  user: null,
  login: async () => false,
  logout: () => null,
  isLoading: true,
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("portfolio-token")
    if (token) {
      // Verify token with backend
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem("portfolio-token")
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      localStorage.removeItem("portfolio-token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("portfolio-token", data.token)
        setUser(data.user)
        toast.success("Login successful!")
        return true
      } else {
        toast.error(data.message || "Login failed")
        return false
      }
    } catch (error) {
      toast.error("Network error occurred")
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("portfolio-token")
    setUser(null)
    toast.success("Logged out successfully")
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
  }

  return <AuthProviderContext.Provider value={value}>{children}</AuthProviderContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext)

  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider")

  return context
}
