"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface ShippingContextType {
  savedAddress: ShippingAddress | null
  saveAddress: (address: ShippingAddress) => void
  clearAddress: () => void
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined)

export function ShippingProvider({ children }: { children: React.ReactNode }) {
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("shippingAddress")
    if (saved) {
      setSavedAddress(JSON.parse(saved))
    }
  }, [])

  const saveAddress = useCallback((address: ShippingAddress) => {
    setSavedAddress(address)
    localStorage.setItem("shippingAddress", JSON.stringify(address))
  }, [])

  const clearAddress = useCallback(() => {
    setSavedAddress(null)
    localStorage.removeItem("shippingAddress")
  }, [])

  return (
    <ShippingContext.Provider value={{ savedAddress, saveAddress, clearAddress }}>
      {children}
    </ShippingContext.Provider>
  )
}

export function useShipping() {
  const context = useContext(ShippingContext)
  if (context === undefined) {
    throw new Error("useShipping must be used within a ShippingProvider")
  }
  return context
}

