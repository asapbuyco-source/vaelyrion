// src/lib/api.ts
// Centralized API client - all calls go through here

const BASE_URL = '/api/v1';

const REQUEST_TIMEOUT_MS = 15000;
const DEFAULT_RETRIES = 1;

async function request<T>(path: string, options?: RequestInit & { retries?: number }): Promise<T> {
  const token = localStorage.getItem('tanelia_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const { retries = DEFAULT_RETRIES, ...fetchOptions } = options || {};
  const method = fetchOptions.method || 'GET';

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'API request failed');
      }
      return res.json();
    } catch (err: any) {
      lastError = err;
      // Retry only network/timeout failures on idempotent methods
      if (method !== 'GET' || attempt >= retries) throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  throw lastError;
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

  contact: {
    submit: (data: { name: string; email: string; message: string }) =>
      request<{ id: string; message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  admin: {
    overview: () => request<any>('/admin/overview'),
    products: (search?: string) => request<any[]>(`/admin/products${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    updateProduct: (id: string, data: Record<string, unknown>) => request<any>(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    orders: () => request<any[]>('/admin/orders'),
    updateOrder: (id: string, status: string) => request<any>(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    customers: () => request<any[]>('/admin/customers'),
    contacts: () => request<any[]>('/admin/contacts'),
    updateContact: (id: string, status: string) => request<any>(`/admin/contacts/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    articles: () => request<any[]>('/admin/articles'),
    saveArticle: (data: Record<string, unknown>) => request<any>('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
    generateArticle: (topic: string, focus_keyword?: string) => request<any>('/admin/ai/article-draft', { method: 'POST', body: JSON.stringify({ topic, focus_keyword }) }),
  },

  content: {
    articles: () => request<any[]>('/content/articles'),
    article: (slug: string) => request<any>(`/content/articles/${encodeURIComponent(slug)}`),
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
    createPaymentIntent: (cartId: string, addressSnapshot: any, shippingMethod: 'standard' | 'express' = 'standard', couponCode?: string) =>
      request<{ clientSecret: string; orderId: string; total: number }>('/checkout/payment-intent', {
        method: 'POST',
        body: JSON.stringify({ cartId, addressSnapshot, shippingMethod, couponCode }),
      }),
  },

  // Orders
  orders: {
    list: () => request<any[]>('/orders'),
    getById: (id: string) => request<any>(`/orders/${id}`),
  },
};
