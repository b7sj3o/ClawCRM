import { useMemo } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

import { findProductInTree } from '@/shared/lib/product-tree'
import { ProductDetailsPanel } from '@/widgets/product-details-panel/ui/product-details-panel'

export function ProductDetailsPage() {
  const { productId } = useParams()
  const { tree } = useOutletContext<{
    tree: Parameters<typeof findProductInTree>[0]
    refreshTree: () => Promise<void>
    isLoading: boolean
  }>()

  const selectedProduct = useMemo(() => {
    const parsedId = Number(productId)
    if (!Number.isFinite(parsedId)) {
      return null
    }

    return findProductInTree(tree, parsedId)
  }, [productId, tree])

  if (!selectedProduct) {
    return <p className="text-zinc-500">Продукт не знайдено.</p>
  }

  return <ProductDetailsPanel product={selectedProduct} />
}

