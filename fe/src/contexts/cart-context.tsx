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

export type Promotion = {
  id: string
  name: string
  description: string
  discountPercent: number
  startDate: string
  endDate: string
  active: boolean
}

export interface CartContextType {
  cartItems: CartItem[]
  cartId: string | null
  loading: boolean

  addToCart: (
    item: Omit<CartItem, "quantity" | "productId"> & {
      quantity?: number
      productId: string
    }
  ) => Promise<void>

  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  clearSelectedItems: () => Promise<void>

  getTotalPrice: () => number
  getItemCount: () => number

  refreshCart: () => Promise<void>

  selectedCartItemIds: Set<string>
  toggleSelectItem: (cartItemId: string) => void
  toggleSelectAll: (selectAll: boolean) => void

  appliedPromotion: Promotion | null
  setAppliedPromotion: (promotion: Promotion | null) => void

  getSelectedItems: () => CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<Set<string>>(new Set())
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null)
  const { isAuthenticated, user } = useAuth()

  // Load cart from backend when user is authenticated
  const refreshCart = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      // Try to get existing cart
      try {
        const cart = await cartApi.getCartByUserId(user.id)
        setCartId(cart.id)

        // Fetch product details for each item
        const itemsWithDetails: (CartItem | null)[] = await Promise.all(
          cart.items.map(async (item: any): Promise<CartItem | null> => {
            try {
              const product = await productApi.getById(item.productId)
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0].imageUrl
                  : "/placeholder.svg"

              return {
                id: item.productId,
                productId: item.productId,
                cartItemId: item.id,
                name: item.productName || product.name,
                price: Number(product.discount) > 0
                  ? Number(product.price) * (1 - Number(product.discount) / 100)
                  : Number(item.price || product.price),
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

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshCart()
    } else {
      setCartItems([])
      setCartId(null)
      setSelectedCartItemIds(new Set())
      setAppliedPromotion(null)
    }
  }, [isAuthenticated, user?.id])

  const addToCart: CartContextType["addToCart"] = async (item) => {
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

  const removeFromCart: CartContextType["removeFromCart"] = async (cartItemId) => {
    if (!cartId) return

    try {
      await cartApi.removeItem(cartId, cartItemId)
      await refreshCart()
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  const updateQuantity: CartContextType["updateQuantity"] = async (cartItemId, quantity) => {
    if (!cartId) return

    if (quantity <= 0) {
      await removeFromCart(cartItemId)
      return
    }

    try {
      const cartItem = cartItems.find((item) => item.cartItemId === cartItemId)
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

  const clearCart: CartContextType["clearCart"] = async () => {
    if (!cartId) return

    try {
      await cartApi.clearCart(cartId)
      await refreshCart()
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }
  const clearSelectedItems: CartContextType["clearSelectedItems"] = async () => {
    if (!cartId || selectedCartItemIds.size === 0) return

    try {
      // Remove each selected item one by one
      // (Backend currently only has removeItem by ID, not a bulk clear selected)
      const idsToRemove = Array.from(selectedCartItemIds)
      await Promise.all(idsToRemove.map((id) => cartApi.removeItem(cartId, id)))

      // Clear local selection set
      setSelectedCartItemIds(new Set())

      // Refresh cart to get updated state from backend
      await refreshCart()
    } catch (error) {
      console.error("Error clearing selected items:", error)
      throw error
    }
  }

  const toggleSelectItem = (cartItemId: string) => {
    setSelectedCartItemIds((prev) => {
      const next = new Set(prev)
      if (next.has(cartItemId)) {
        next.delete(cartItemId)
      } else {
        next.add(cartItemId)
      }
      return next
    })
  }

  const toggleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      const allIds = cartItems
        .map((item) => item.cartItemId)
        .filter((id): id is string => !!id)
      setSelectedCartItemIds(new Set(allIds))
    } else {
      setSelectedCartItemIds(new Set())
    }
  }

  const getSelectedItems = () => {
    return cartItems.filter((item) => item.cartItemId && selectedCartItemIds.has(item.cartItemId))
  }

  const getTotalPrice = () => {
    const selectedItems = getSelectedItems()
    const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (appliedPromotion) {
      return subtotal * (1 - appliedPromotion.discountPercent / 100)
    }
    return subtotal
  }

  const getItemCount = () => {
    if (selectedCartItemIds.size > 0) {
      return getSelectedItems().reduce((sum, item) => sum + item.quantity, 0)
    }
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
        clearSelectedItems,
        getTotalPrice,
        getItemCount,
        refreshCart,
        selectedCartItemIds,
        toggleSelectItem,
        toggleSelectAll,
        appliedPromotion,
        setAppliedPromotion,
        getSelectedItems,
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
