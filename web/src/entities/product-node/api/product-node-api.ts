import {
  createProductV1ProductNodesPost,
  deleteProductV1ProductNodesObjIdDelete,
  listNodesTreeV1ProductNodesTreeGet,
  type ProductNodeCreateDto,
  type ProductNodeTreeDto,
} from '@/shared/api/openapi'

export async function getProductNodeTree(): Promise<ProductNodeTreeDto[]> {
  const response = await listNodesTreeV1ProductNodesTreeGet()
  if (!Array.isArray(response.data)) {
    throw new Error('API повернув невалідне дерево категорій')
  }

  return response.data
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

export async function deleteProductNode(nodeId: number) {
  await deleteProductV1ProductNodesObjIdDelete({
    path: {
      obj_id: nodeId,
    },
  })
}

