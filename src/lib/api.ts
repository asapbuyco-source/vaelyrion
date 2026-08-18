// src/lib/api.ts
// Centralized API client - all calls go through here

const BASE_URL = '/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('tanelia_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
}

export const api = {
  // Auth
  auth: {
    register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (email: string, password: string) =>
      request<{ user: any; session: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request<{ user: any }>('/auth/me'),
  },

  // Products
  products: {
    list: (params?: { category?: string; search?: string }) => {
      const qs = new URLSearchParams(params as any).toString();
      return request<any[]>(`/products${qs ? '?' + qs : ''}`);
    },
    getById: (id: string) => request<any>(`/products/${id}`),
  },

  // Cart
  cart: {
    get: () => request<any>('/cart'),
    addItem: (data: { productId: string; variantId?: string; quantity: number; unitPrice: number; options: any }) =>
      request('/cart/items', { method: 'POST', body: JSON.stringify(data) }),
    updateItem: (itemId: string, quantity: number) =>
      request(`/cart/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
    removeItem: (itemId: string) =>
      request(`/cart/items/${itemId}`, { method: 'DELETE' }),
    clear: () => request('/cart', { method: 'DELETE' }),
  },

  // Checkout
  checkout: {
    createPaymentIntent: (cartId: string, addressSnapshot: any, couponCode?: string) =>
      request<{ clientSecret: string; orderId: string; total: number }>('/checkout/payment-intent', {
        method: 'POST',
        body: JSON.stringify({ cartId, addressSnapshot, couponCode }),
      }),
  },

  // Orders
  orders: {
    list: () => request<any[]>('/orders'),
    getById: (id: string) => request<any>(`/orders/${id}`),
  },
};
