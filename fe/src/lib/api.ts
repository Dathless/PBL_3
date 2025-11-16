const API_BASE_URL = 'http://localhost:8080/api'

// Helper function to get auth token from cookies
function getAuthToken(): string | null {
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
}

// Product APIs
export const productApi = {
  getAll: async () => {
    return apiRequest<Array<{
      id: string
      name: string
      description: string
      price: number
      stock: number
      size: string
      color: string
      status: string
      categoryId: number
      sellerId: string
      images: Array<{ id: number; imageUrl: string; altText?: string }>
    }>>('/products')
  },

  getById: async (id: string) => {
    return apiRequest(`/products/${id}`)
  },

  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, { method: 'DELETE' })
  },

  create: async (productData: {
    name: string
    description: string
    price: number
    stock: number
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

  getById: async (id: string) => {
    return apiRequest<{
      id: string
      customerId: string
      orderDate: string
      status: string
      totalAmount: number
      shippingAddress: string
      paymentMethod: string
      items: Array<any>
    }>(`/orders/${id}`)
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
}

