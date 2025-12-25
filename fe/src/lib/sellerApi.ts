import { apiRequest } from "./api";

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
  orderId: UUID
  productId: UUID
  productName: string
  customerId: UUID
  customerName: string
  sellerId: UUID
  quantity: number
  price: number
  selectedColor: string
  selectedSize: string
  status: string
  orderDate: string
}

export type AnalyticsSummary = {
  revenue: { current: number; previous: number; change: number }
  orders: { current: number; previous: number; change: number }
  customers: { current: number; previous: number; change: number }
  conversion: { current: number; previous: number; change: number }
}

export type SeriesPoint = { label: string; value: number }
export type TopProduct = { name: string; sales: number; revenue: number; imageUrl?: string } // Added TopProduct type

// Products
export async function getSellerProducts(sellerId: UUID): Promise<Product[]> {
  return apiRequest<Product[]>(`/products/seller/${sellerId}`);
}

export async function createProduct(sellerId: UUID, input: Partial<Product>): Promise<Product> {
  return apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify({ ...input, sellerId })
  });
}

export async function updateProduct(productId: UUID, input: Partial<Product>): Promise<Product> {
  return apiRequest(`/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(input)
  });
}

export async function deleteProduct(productId: UUID): Promise<void> {
  return apiRequest(`/products/${productId}`, { method: 'DELETE' });
}

// Orders
export async function getSellerOrders(sellerId: UUID): Promise<Order[]> {
  return apiRequest(`/orders/seller/${sellerId}`);
}

export async function getOrderDetail(orderId: UUID): Promise<Order> {
  return apiRequest(`/orders/${orderId}`);
}


// Analytics
export async function getAnalyticsSummary(sellerId: UUID, range: "7d" | "30d" | "90d" | "1y"): Promise<AnalyticsSummary> {
  return apiRequest<AnalyticsSummary>(`/seller/${sellerId}/analytics/summary?period=${range}`);
}

export async function getRevenueSeries(
  sellerId: UUID,
  period: string
): Promise<SeriesPoint[]> {
  return apiRequest<SeriesPoint[]>(`/seller/${sellerId}/analytics/revenue-trend?period=${period}`);
}

export async function getOrderSeries(
  sellerId: UUID,
  period: string
): Promise<SeriesPoint[]> {
  return apiRequest<SeriesPoint[]>(`/seller/${sellerId}/analytics/order-trend?period=${period}`);
}

export async function getTopSellingProducts(sellerId: UUID, period: string = '7d'): Promise<TopProduct[]> {
  return apiRequest<TopProduct[]>(`/seller/${sellerId}/analytics/top-products?period=${period}`);
}

export async function syncBalance(sellerId: UUID): Promise<void> {
  return apiRequest(`/seller/${sellerId}/sync-balance`, { method: 'POST' });
}

// Profile & Business (Settings)
export type SellerProfile = { name: string; email: string; phone?: string; address?: string }
export type SellerBusiness = { businessName?: string; taxId?: string; description?: string }

export async function getSellerProfile(_sellerId: UUID): Promise<SellerProfile> {
  return { name: "Seller", email: _sellerId };
}

export async function updateSellerProfile(_sellerId: UUID, input: Partial<SellerProfile>): Promise<SellerProfile> {
  return { ...input } as SellerProfile;
}

export async function getSellerBusiness(_sellerId: UUID): Promise<SellerBusiness> {
  return { businessName: "", taxId: "", description: "" };
}

export async function updateSellerBusiness(_sellerId: UUID, input: Partial<SellerBusiness>): Promise<SellerBusiness> {
  return { ...input } as SellerBusiness;
}
