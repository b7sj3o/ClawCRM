import {
  createProductV1ProductNodesPost,
  listNodesTreeV1ProductNodesTreeGet,
  type ProductNodeCreateDto,
  type ProductNodeTreeDto,
} from '@/shared/api/openapi'

export async function getProductNodeTree(): Promise<ProductNodeTreeDto[]> {
  const response = await listNodesTreeV1ProductNodesTreeGet()
  return response.data ?? []
}

export async function createProductNode(payload: ProductNodeCreateDto) {
  const response = await createProductV1ProductNodesPost({
    body: payload,
  })

  if (!response.data) {
    throw new Error('Не вдалося створити категорію')
  }

  return response.data
}

