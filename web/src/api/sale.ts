import { api } from './base'

export type SaleCreatePayload = {
  product_id: number
  buy_price: number
  sell_price: number
  quantity: number
}

export type SaleRead = {
  id: number
  product_id: number
  buy_price: string
  sell_price: string
  quantity: number
  created_by: string
  org_id: string
  created_at: string
}

export const createSale = async (payload: SaleCreatePayload, token?: string | null) => {
  const response = await api.post('/sales/', payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })

  return response.data
}

export const getSales = async (token?: string | null): Promise<SaleRead[]> => {
  const response = await api.get<SaleRead[]>('/sales/', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return response.data
}
