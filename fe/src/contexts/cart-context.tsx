"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { cartApi, productApi } from "@/lib/api"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  color?: string
  size?: string
  cartItemId?: string // Backend cart item ID
}

interface CartContextType {
  cartItems: CartItem[]
  cartId: string | null
  loading: boolean
  addToCart: (item: Omit<CartItem, "quantity" | "productId"> & { quantity?: number; productId: string }) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalPrice: () => number
  getItemCount: () => number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, user } = useAuth()

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshCart()
    } else {
      setCartItems([])
      setCartId(null)
    }
  }, [isAuthenticated, user?.id])

  const refreshCart = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      // Try to get existing cart
      try {
        const cart = await cartApi.getCartByUserId(user.id)
        setCartId(cart.id)
        
        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(
          cart.items.map(async (item: any) => {
            try {
              const product = await productApi.getById(item.productId)
              const imageUrl = product.images && product.images.length > 0 
                ? product.images[0].imageUrl 
                : "/placeholder.svg"
              
              return {
                id: item.productId,
                productId: item.productId,
                cartItemId: item.id,
                name: item.productName || product.name,
                price: Number(item.price || product.price),
                quantity: item.quantity,
                image: imageUrl,
                color: item.selectedColor || undefined,
                size: item.selectedSize || undefined,
              }
            } catch (error) {
              console.error("Error loading product:", error)
              return null
            }
          })
        )
        
        setCartItems(itemsWithDetails.filter((item): item is CartItem => item !== null))
      } catch (error: any) {
        // Cart doesn't exist, create one
        if (error.message?.includes("not found") || error.message?.includes("404")) {
          const newCart = await cartApi.createCart(user.id)
          setCartId(newCart.id)
        } else {
          throw error
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (item: Omit<CartItem, "quantity" | "productId"> & { quantity?: number; productId: string }) => {
    if (!user?.id || !cartId) {
      // Create cart if it doesn't exist
      if (user?.id) {
        try {
          const cart = await cartApi.createCart(user.id)
          setCartId(cart.id)
          await cartApi.addItem(cart.id, {
            productId: item.productId,
            quantity: item.quantity || 1,
            selectedColor: item.color || null,
            selectedSize: item.size || null,
          })
          await refreshCart()
        } catch (error) {
          console.error("Error adding to cart:", error)
          throw error
        }
      }
      return
    }

    try {
      await cartApi.addItem(cartId, {
        productId: item.productId,
        quantity: item.quantity || 1,
        selectedColor: item.color || null,
        selectedSize: item.size || null,
      })
      await refreshCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    if (!cartId) return
    
    try {
      await cartApi.removeItem(cartId, cartItemId)
      await refreshCart()
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!cartId) return
    
    if (quantity <= 0) {
      await removeFromCart(cartItemId)
      return
    }

    try {
      const cartItem = cartItems.find(item => item.cartItemId === cartItemId)
      if (!cartItem) return

      await cartApi.updateItem(cartId, cartItemId, {
        quantity,
        selectedColor: cartItem.color || null,
        selectedSize: cartItem.size || null,
      })
      await refreshCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
      throw error
    }
  }

  const clearCart = async () => {
    if (!cartId) return
    
    try {
      // Remove all items
      for (const item of cartItems) {
        if (item.cartItemId) {
          await cartApi.removeItem(cartId, item.cartItemId)
        }
      }
      await refreshCart()
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartId,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

