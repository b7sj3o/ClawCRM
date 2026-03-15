export interface Product {
  id: number
  name: string
  description: string
  buy_price: string
  sell_price: string
  quantity: number
  node_id: number
  created_at: string
  updated_at: string
}

export interface ProductCreate {
  name: string
  description: string
  buy_price: string
  sell_price: string
  quantity: number
  node_id: number
}

export interface ProductNode {
  id: number
  name: string
  parent_id: number | null
}

export interface ProductNodeCreate {
  name: string
  parent_id: number | null
}
