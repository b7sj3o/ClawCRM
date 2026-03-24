import {
  createProductV1ProductsPost,
  deleteProductsV1ProductsObjIdDelete,
  type ProductCreateDto,
  type ProductReadDto,
} from '@/shared/api/openapi'

export async function createProduct(payload: ProductCreateDto): Promise<ProductReadDto> {
  const response = await createProductV1ProductsPost({
    body: payload,
  })

  if (!response.data) {
    throw new Error('Не вдалося створити продукт')
  }

  return response.data
}

export async function deleteProduct(productId: number) {
  await deleteProductsV1ProductsObjIdDelete({
    path: {
      obj_id: productId,
    },
  })
}

