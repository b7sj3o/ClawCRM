const API_BASE = '/api/v1'

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  productNodes: {
    list: (params?: { parent_id?: number }) =>
      fetchApi<{ items: import('./types').ProductNode[]; total: number }>(
        `/product-nodes${params?.parent_id != null ? `?parent_id=${params.parent_id}` : ''}`
      ),
    roots: () => fetchApi<import('./types').ProductNode[]>('/product-nodes/roots'),
    get: (id: number) => fetchApi<import('./types').ProductNode>(`/product-nodes/${id}`),
    create: (data: import('./types').ProductNodeCreate) =>
      fetchApi<import('./types').ProductNode>('/product-nodes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<import('./types').ProductNode>) =>
      fetchApi<import('./types').ProductNode>(`/product-nodes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi<void>(`/product-nodes/${id}`, { method: 'DELETE' }),
  },

  products: {
    list: (params?: { node_id?: number; skip?: number; limit?: number }) => {
      const sp = new URLSearchParams()
      if (params?.node_id != null) sp.set('node_id', String(params.node_id))
      if (params?.skip != null) sp.set('skip', String(params.skip))
      if (params?.limit != null) sp.set('limit', String(params.limit))
      const q = sp.toString()
      return fetchApi<{ items: import('./types').Product[]; total: number }>(
        `/products${q ? `?${q}` : ''}`
      )
    },
    get: (id: number) => fetchApi<import('./types').Product>(`/products/${id}`),
    create: (data: import('./types').ProductCreate) =>
      fetchApi<import('./types').Product>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<import('./types').ProductCreate>) =>
      fetchApi<import('./types').Product>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      fetchApi<void>(`/products/${id}`, { method: 'DELETE' }),
  },
}
