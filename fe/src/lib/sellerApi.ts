// Lightweight FE-first mock API for seller dashboard
// This module stores in-memory data per session and returns Promises to mimic HTTP calls.

export type UUID = string

export type Product = {
  id: UUID
  sellerId: UUID
  name: string
  description?: string
  price: number
  stock: number
  category: string
  status: "active" | "low_stock" | "inactive"
  size?: string
  color?: string
  image?: string
}

export type Order = {
  id: UUID
  sellerId: UUID
  customer: string
  items: Array<{ productId: UUID; productName: string; quantity: number; price: number }>
  amount: number
  status: "pending" | "shipping" | "completed" | "cancelled"
  date: string // ISO date
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
}

export type OrderForSeller = {
  orderId : string
  productId : string
  productName : string
  customerId : string
  customerName : string
  sellerId : string
  quantity : number
  price : number
  selectedColor : string
  selectedSize : string
  status : string
  orderDate: string

}

export type AnalyticsSummary = {
  revenue: { current: number; previous: number; change: number }
  orders: { current: number; previous: number; change: number }
  customers: { current: number; previous: number; change: number }
  conversion: { current: number; previous: number; change: number }
}

export type SeriesPoint = { label: string; value: number }

// In-memory db
const db = {
  products: [] as Product[],
  orders: [] as Order[],
  profiles: new Map<UUID, { name: string; email: string; phone?: string; address?: string }>(),
  business: new Map<UUID, { businessName?: string; taxId?: string; description?: string }>(),
}

// seed some sample data per seller
function seedIfEmpty(sellerId: UUID) {
  if (!db.products.some(p => p.sellerId === sellerId)) {
    const p1: Product = {
      id: crypto.randomUUID(),
      sellerId,
      name: "Adidas Samba OG",
      price: 89,
      stock: 15,
      category: "Shoes",
      status: "active",
      image: "/adidas-samba-white-shoes.jpg",
    }
    const p2: Product = {
      id: crypto.randomUUID(),
      sellerId,
      name: "Nike Air Force 1",
      price: 120,
      stock: 8,
      category: "Shoes",
      status: "active",
      image: "/nike-air-force-sneakers.jpg",
    }
    const p3: Product = {
      id: crypto.randomUUID(),
      sellerId,
      name: "Balenciaga Bag",
      price: 1800,
      stock: 3,
      category: "Bag",
      status: "low_stock",
      image: "/balenciaga-bag.jpg",
    }
    db.products.push(p1, p2, p3)

    const today = new Date()
    const iso = (d: Date) => d.toISOString()
    const mkOrder = (offsetDays: number, amount: number, status: Order["status"]) => {
      const d = new Date(today)
      d.setDate(today.getDate() - offsetDays)
      const items = [
        { productId: p1.id, productName: p1.name, quantity: 1, price: p1.price },
        { productId: p2.id, productName: p2.name, quantity: 1, price: p2.price },
      ]
      const base: Order = {
        id: crypto.randomUUID(),
        sellerId,
        customer: "John Doe",
        items,
        amount,
        status,
        date: iso(d),
      }
      if (status === "shipping") {
        base.shippedAt = iso(new Date(d))
      } else if (status === "completed") {
        base.shippedAt = iso(new Date(d))
        const delivered = new Date(d)
        delivered.setDate(delivered.getDate() + 2)
        base.deliveredAt = iso(delivered)
      } else if (status === "cancelled") {
        const cancelled = new Date(d)
        cancelled.setDate(cancelled.getDate() + 1)
        base.cancelledAt = iso(cancelled)
      }
      return base
    }

    db.orders.push(
      mkOrder(1, 209, "completed"),
      mkOrder(2, 120, "pending"),
      mkOrder(3, 89, "completed"),
      mkOrder(7, 1800, "completed"),
      mkOrder(10, 320, "shipping"),
      mkOrder(15, 89, "completed"),
      mkOrder(20, 89, "cancelled"),
      mkOrder(27, 120, "completed"),
      mkOrder(35, 89, "completed"),
    )
  }
}

function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms))
}

// Products
export async function getSellerProducts(sellerId: UUID): Promise<Product[]> {
  seedIfEmpty(sellerId)
  return delay(db.products.filter(p => p.sellerId === sellerId))
}

export async function createProduct(sellerId: UUID, input: Partial<Product>): Promise<Product> {
  const product: Product = {
    id: crypto.randomUUID(),
    sellerId,
    name: input.name || "New Product",
    price: input.price ?? 0,
    stock: input.stock ?? 0,
    category: input.category || "Uncategorized",
    status: (input.status as Product["status"]) || "active",
    size: input.size,
    color: input.color,
    image: input.image,
    description: input.description,
  }
  db.products.push(product)
  return delay(product)
}

export async function updateProduct(productId: UUID, input: Partial<Product>): Promise<Product> {
  const idx = db.products.findIndex(p => p.id === productId)
  if (idx === -1) throw new Error("Product not found")
  db.products[idx] = { ...db.products[idx], ...input }
  return delay(db.products[idx])
}

export async function deleteProduct(productId: UUID): Promise<void> {
  const idx = db.products.findIndex(p => p.id === productId)
  if (idx !== -1) db.products.splice(idx, 1)
  return delay(undefined)
}

// Orders

export async function getSellerOrders(sellerId: UUID): Promise<Order[]> {
  seedIfEmpty(sellerId)
  return delay(db.orders.filter(o => o.sellerId === sellerId))
}

export async function getOrderDetail(orderId: UUID): Promise<Order> {
  const order = db.orders.find(o => o.id === orderId)
  if (!order) throw new Error("Order not found")
  return delay(order)
}


// Analytics
function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0) }

export async function getAnalyticsSummary(sellerId: UUID, range: "7d" | "30d" | "90d" | "1y"): Promise<AnalyticsSummary> {
  seedIfEmpty(sellerId)
  const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
  const today = new Date()
  const start = new Date()
  start.setDate(today.getDate() - days)
  const within = db.orders.filter(o => o.sellerId === sellerId && new Date(o.date) >= start)
  const prevWithin = db.orders.filter(o => o.sellerId === sellerId && new Date(o.date) < start && new Date(o.date) >= new Date(start.getTime() - days * 86400000))

  const revenue = sum(within.filter(o => o.status === "completed").map(o => o.amount))
  const prevRevenue = sum(prevWithin.filter(o => o.status === "completed").map(o => o.amount))
  const orders = within.length
  const prevOrders = prevWithin.length

  const pct = (cur: number, prev: number) => prev === 0 ? 100 : Number(((cur - prev) / prev) * 100).toFixed(1) as unknown as number

  return delay({
    revenue: { current: revenue, previous: prevRevenue, change: pct(revenue, prevRevenue) },
    orders: { current: orders, previous: prevOrders, change: pct(orders, prevOrders) },
    customers: { current: Math.max(5, Math.round(orders * 0.6)), previous: Math.max(3, Math.round(prevOrders * 0.6)), change: pct(Math.max(5, Math.round(orders * 0.6)), Math.max(3, Math.round(prevOrders * 0.6))) },
    conversion: { current: 3.2, previous: 2.9, change: 10.3 },
  })
}

export async function getRevenueSeries(
  sellerId: UUID,
  granularity: "daily" | "monthly",
  from?: string,
  to?: string,
): Promise<SeriesPoint[]> {
  seedIfEmpty(sellerId)
  const fromDate = from ? new Date(from) : undefined
  const toDate = to ? new Date(to) : undefined
  const orders = db.orders.filter(o => {
    if (o.sellerId !== sellerId || o.status !== "completed") return false
    const d = new Date(o.date)
    if (fromDate && d < fromDate) return false
    if (toDate && d > toDate) return false
    return true
  })
  const dateKey = (d: Date) => granularity === "daily"
    ? d.toISOString().slice(0, 10)
    : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

  const map = new Map<string, number>()
  for (const o of orders) {
    const d = new Date(o.date)
    const k = dateKey(d)
    map.set(k, (map.get(k) || 0) + o.amount)
  }
  const points = Array.from(map.entries()).sort((a, b) => a[0] < b[0] ? -1 : 1).map(([label, value]) => ({ label, value }))

  return delay(points)
}

// Profile & Business (Settings)
export type SellerProfile = { name: string; email: string; phone?: string; address?: string }
export type SellerBusiness = { businessName?: string; taxId?: string; description?: string }

function seedProfileIfEmpty(sellerId: UUID) {
  if (!db.profiles.has(sellerId)) {
    const name = sellerId.includes("@") ? sellerId.split("@")[0] : "Seller"
    db.profiles.set(sellerId, { name, email: sellerId, phone: "", address: "" })
  }
  if (!db.business.has(sellerId)) {
    db.business.set(sellerId, { businessName: "", taxId: "", description: "" })
  }
}

export async function getSellerProfile(sellerId: UUID): Promise<SellerProfile> {
  seedProfileIfEmpty(sellerId)
  return delay({ ...(db.profiles.get(sellerId) as SellerProfile) })
}

export async function updateSellerProfile(sellerId: UUID, input: Partial<SellerProfile>): Promise<SellerProfile> {
  seedProfileIfEmpty(sellerId)
  const cur = db.profiles.get(sellerId) as SellerProfile
  const next = { ...cur, ...input }
  db.profiles.set(sellerId, next)
  return delay(next)
}

export async function getSellerBusiness(sellerId: UUID): Promise<SellerBusiness> {
  seedProfileIfEmpty(sellerId)
  return delay({ ...(db.business.get(sellerId) as SellerBusiness) })
}

export async function updateSellerBusiness(sellerId: UUID, input: Partial<SellerBusiness>): Promise<SellerBusiness> {
  seedProfileIfEmpty(sellerId)
  const cur = db.business.get(sellerId) as SellerBusiness
  const next = { ...cur, ...input }
  db.business.set(sellerId, next)
  return delay(next)
}
