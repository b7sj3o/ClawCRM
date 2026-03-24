import {
  createSaleV1SalesPost,
  listSalesV1SalesGet,
  type SaleCreateDto,
  type SaleReadDto,
} from '@/shared/api/openapi'

export async function getSales(): Promise<SaleReadDto[]> {
  const response = await listSalesV1SalesGet()
  return response.data ?? []
}

export async function createSale(payload: SaleCreateDto) {
  const response = await createSaleV1SalesPost({
    body: payload,
  })

  if (!response.data) {
    throw new Error('Не вдалося створити продаж')
  }

  return response.data
}

