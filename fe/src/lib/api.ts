const API_BASE_URL = 'http://localhost:8080/api'

// Helper function to get auth token from cookies or localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token')
    if (localToken) return localToken
  }

  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'token') {
      return value
    }
  }
  return null
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    // Note: We can't set cookies manually, they come from backend
    // But we can include token in Authorization header if needed
    (headers as any)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Important for cookies
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Auth APIs
export const authApi = {
  login: async (username: string, password: string) => {
    return apiRequest<{
      token: string
      fullname: string
      username: string
      role: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },

  logout: async () => {
    return apiRequest<void>('/auth/logout', {
      method: 'POST',
    })
  },

  getCurrentUser: async () => {
    return apiRequest<{
      Id: string
      fullname: string
      username: string
      role: string
    }>('/auth/currentUser')
  },
}

// User APIs
export const userApi = {
  create: async (userData: {
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    address: string
    role: 'CUSTOMER' | 'SELLER'
  }) => {
    return apiRequest<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  getAll: async () => {
    return apiRequest<Array<{
      id: string
      fullname: string
      username: string
      email: string
      phone: string
      address: string
      enabled: boolean
      role: 'ADMIN' | 'CUSTOMER' | 'SELLER'
    }>>('/users')
  },

  update: async (id: string, data: Partial<{
    fullname: string
    username: string
    password: string
    email: string
    phone: string
    address: string
    enabled: boolean
    role: 'ADMIN' | 'CUSTOMER' | 'SELLER'
  }>) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  remove: async (id: string) => {
    return apiRequest<void>(`/users/${id}`, { method: 'DELETE' })
  },
}

export interface ApiProduct {
  id: string
  name: string
  description: string
  price: number
  stock: number
  size: string
  color: string
  status: string
  categoryId: number
  categoryName: string
  sellerId: string
  images: Array<{ id: number; imageUrl: string; altText?: string }>
}
// Product APIs
export const productApi = {
  getAll: async (status?: string) => {
    const url = status ? `/products?status=${status}` : '/products'
    return apiRequest<ApiProduct[]>(url)
  },

  getById: async (id: string) => {
    return apiRequest<ApiProduct>(`/products/${id}`)
  },
  getByCategoryName: async (categoryName: string) => {
    return apiRequest<ApiProduct[]>(`/products/category/${categoryName}`)
  },
  getByBrandName: async (brandName: string) => {
    return apiRequest<ApiProduct[]>(`/products/brand/${brandName}`)
  },
  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, { method: 'DELETE' })
  },
  // Lấy danh sách sản phẩm chờ phê duyệt
  getPendingProducts: async () => {
    return apiRequest<ApiProduct[]>('/products/pending')
  },
  // Phê duyệt sản phẩm
  approveProduct: async (productId: string, adminId: string) => {
    return apiRequest(`/admin/products/${productId}/approval`, {
      method: 'PUT',
      headers: { 'X-User-Id': adminId },
      body: JSON.stringify({
        status: 'APPROVED'
      })
    })
  },
  // Từ chối sản phẩm
  rejectProduct: async (productId: string, adminId: string, reason: string) => {
    return apiRequest(`/admin/products/${productId}/approval`, {
      method: 'PUT',
      headers: { 'X-User-Id': adminId },
      body: JSON.stringify({
        status: 'REJECTED',
        rejectionReason: reason
      })
    })
  },
  // Lấy lý do từ chối
  getRejectionReason: async (productId: string) => {
    return apiRequest<{ reason: string }>(`/admin/products/${productId}/rejection-reason`)
  },
  create: async (productData: {
    name: string
    description: string
    price: number
    stock: number
    brand: string,
    discount: number,
    rating: number,
    reviews: number,
    size: string     // JSON string
    color: string    // JSON string
    status: string
    categoryId: number
    sellerId: string
    images: Array<{
      imageUrl: string
      altText?: string
    }>
  }) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  update: async (
    id: string,
    productData: {
      name: string
      description: string
      price: number
      stock: number
      size: string
      color: string
      status: string
      categoryId: number
      images: Array<{
        imageUrl: string
        altText?: string
      }>
    }
  ) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },
}

// Cart APIs
export const cartApi = {
  getCartByUserId: async (userId: string) => {
    return apiRequest<{
      id: string
      userId: string
      items: Array<{
        id: string
        productId: string
        productName: string
        quantity: number
        selectedColor: string | null
        selectedSize: string | null
        price: number
      }>
    }>(`/carts/user/${userId}`)
  },

  createCart: async (userId: string) => {
    return apiRequest<{
      id: string
      userId: string
      items: Array<any>
    }>(`/carts/${userId}`, {
      method: 'POST',
    })
  },

  addItem: async (cartId: string, item: {
    productId: string
    quantity: number
    selectedColor: string | null
    selectedSize: string | null
  }) => {
    return apiRequest<{
      id: string
      userId: string
      items: Array<any>
    }>(`/carts/${cartId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    })
  },

  updateItem: async (cartId: string, itemId: string, item: {
    quantity: number
    selectedColor?: string | null
    selectedSize?: string | null
  }) => {
    return apiRequest<{
      id: string
      userId: string
      items: Array<any>
    }>(`/carts/${cartId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    })
  },

  removeItem: async (cartId: string, itemId: string) => {
    return apiRequest<void>(`/carts/${cartId}/items/${itemId}`, {
      method: 'DELETE',
    })
  },
}

// Order APIs
interface OrderForSeller {
  orderId: string
  productId: string
  productName: string
  customerId: string
  customerName: string
  sellerId: string
  quantity: number
  price: number
  selectedColor: string
  selectedSize: string
  status: string
  orderDate: string
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  productId: string;
  price: number;
  selectedColor: string;
  selectedSize: string;
}

interface OrderDetail {
  id: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

export const orderApi = {
  create: async (orderData: {
    customerId: string
    shippingAddress: string
    paymentMethod: 'COD' | 'EWALLET'
    items: Array<{
      productId: string
      quantity: number
      price: number
      selectedColor: string | null
      selectedSize: string | null
    }>
  }) => {
    return apiRequest<{
      id: string
      customerId: string
      orderDate: string
      status: string
      totalAmount: number
      shippingAddress: string
      paymentMethod: string
      items: Array<any>
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  },

  getById: async (orderId: string) => {
    return apiRequest<OrderDetail>(`/orders/${orderId}`)
  },
  getAll: async () => {
    return apiRequest<OrderDetail[]>(`/orders`)
  },
  getOrdersForSeller: async (sellerId: string) => {
    return apiRequest<OrderForSeller[]>(`/order-items/seller/${sellerId}`);
  },
}

// Payment APIs
export const paymentApi = {
  create: async (paymentData: {
    orderId: string
    amount: number
    method: 'COD' | 'EWALLET'
  }) => {
    return apiRequest<{
      id: string
      orderId: string
      amount: number
      paymentDate: string | null
      status: string
      method: string
      createdAt: string
      updatedAt: string
    }>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  },

  getByOrderId: async (orderId: string) => {
    return apiRequest<{
      id: string
      orderId: string
      amount: number
      paymentDate: string | null
      status: string
      method: string
      createdAt: string
      updatedAt: string
    }>(`/payments/order/${orderId}`)
  },
}

// Category APIs
export const categoryApi = {
  getAll: async () => {
    return apiRequest<Array<{
      id: number
      name: string
      parentId: number | null
    }>>('/categories')
  },

  getById: async (id: number) => {
    return apiRequest<{
      id: number
      name: string
      parentId: number | null
    }>(`/categories/${id}`)
  },

  create: async (categoryData: {
    name: string
    parentId?: number | null
  }) => {
    return apiRequest<{
      id: number
      name: string
      parentId: number | null
    }>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  },

  update: async (id: number, categoryData: {
    name: string
    parentId?: number | null
  }) => {
    return apiRequest<{
      id: number
      name: string
      parentId: number | null
    }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  },

  delete: async (id: number) => {
    return apiRequest<void>(`/categories/${id}`, { method: 'DELETE' })
  },
}

// Promotion APIs
export const promotionApi = {
  getAll: async () => {
    return apiRequest<Array<{
      id: string
      name: string
      description: string
      discountPercent: number
      startDate: string
      endDate: string
      active: boolean
    }>>('/promotions')
  },

  create: async (promotionData: {
    name: string
    description: string
    discountPercent: number
    startDate: string
    endDate: string
    active: boolean
  }) => {
    return apiRequest('/promotions', {
      method: 'POST',
      body: JSON.stringify(promotionData),
    })
  },

  update: async (id: string, promotionData: Partial<{
    name: string
    description: string
    discountPercent: number
    startDate: string
    endDate: string
    active: boolean
  }>) => {
    return apiRequest(`/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotionData),
    })
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/promotions/${id}`, { method: 'DELETE' })
  },
}

// Review APIs
export const reviewApi = {
  getAll: async () => {
    return apiRequest<Array<{
      id: string
      productId: string
      productName: string
      userId: string
      userName: string
      rating: number
      comment: string
      createdAt: string
      approved: boolean
    }>>('/reviews')
  },

  approve: async (id: string) => {
    return apiRequest(`/reviews/${id}/approve`, {
      method: 'PUT',
    })
  },

  delete: async (id: string) => {
    return apiRequest<void>(`/reviews/${id}`, { method: 'DELETE' })
  },
}

// File Upload APIs
export interface FileUploadResponse {
  fileName: string;
  fileDownloadUri: string;
  fileType: string;
  size: string;
}

export const fileApi = {
  upload: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Upload failed');
    }

    return response.json();
  },

  delete: async (fileName: string): Promise<void> => {
    return apiRequest(`/files/${fileName}`, {
      method: 'DELETE'
    });
  },

  getFileUrl: (fileName: string): string => {
    return `${API_BASE_URL}/files/download/${fileName}`;
  }
};

