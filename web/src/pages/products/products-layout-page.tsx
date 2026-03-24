import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { getProductNodeTree } from '@/entities/product-node/api/product-node-api'
import type { ProductNodeTreeDto } from '@/shared/api/openapi'
import { countProductsInTree } from '@/shared/lib/product-tree'
import { ProductsSidebar } from '@/widgets/products-sidebar/ui/products-sidebar'

export function ProductsLayoutPage() {
  const [tree, setTree] = useState<ProductNodeTreeDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshTree = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getProductNodeTree()
      setTree(data)
    } catch {
      setError('Не вдалося завантажити дерево продуктів.')
      setTree([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshTree()
  }, [refreshTree])

  return (
    <section className="flex min-h-[calc(100vh-152px)] overflow-hidden rounded-3xl border border-white/6 bg-black/10">
      <ProductsSidebar tree={tree} isLoading={isLoading} onRefresh={refreshTree} />

      <div className="min-w-0 flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">Товари</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Категорій: {tree.length} · Товарів: {countProductsInTree(tree)}
          </p>
          {error ? <p className="mt-2 text-sm text-amber-400/90">{error}</p> : null}
        </div>

        <Outlet context={{ tree, refreshTree, isLoading }} />
      </div>
    </section>
  )
}

