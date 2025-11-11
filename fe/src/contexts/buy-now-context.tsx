"use client"

import React, { createContext, useContext } from "react"

interface BuyNowProduct {
  id: string
  name: string
  price: number
  image: string
}

interface BuyNowContextType {
  setBuyNowProduct: (product: BuyNowProduct) => void
  getBuyNowProduct: (productId: string) => BuyNowProduct | null
  clearBuyNowProduct: () => void
}

const BuyNowContext = createContext<BuyNowContextType | undefined>(undefined)

export function BuyNowProvider({ children }: { children: React.ReactNode }) {
  const setBuyNowProduct = (product: BuyNowProduct) => {
    localStorage.setItem("buyNowProduct", JSON.stringify(product))
  }

  const getBuyNowProduct = (productId: string): BuyNowProduct | null => {
    const stored = localStorage.getItem("buyNowProduct")
    if (stored) {
      try {
        const product = JSON.parse(stored)
        if (product.id === productId) {
          return product
        }
      } catch (e) {
        console.error("Error parsing buyNowProduct", e)
      }
    }
    return null
  }

  const clearBuyNowProduct = () => {
    localStorage.removeItem("buyNowProduct")
  }

  return (
    <BuyNowContext.Provider value={{ setBuyNowProduct, getBuyNowProduct, clearBuyNowProduct }}>
      {children}
    </BuyNowContext.Provider>
  )
}

export function useBuyNow() {
  const context = useContext(BuyNowContext)
  if (context === undefined) {
    throw new Error("useBuyNow must be used within a BuyNowProvider")
  }
  return context
}

