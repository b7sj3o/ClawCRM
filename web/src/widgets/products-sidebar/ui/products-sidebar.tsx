import { FolderPlus } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { CreateRootCategoryForm } from '@/features/create-product-node/ui/create-root-category-form'
import { useProductBrowserStore } from '@/features/product-browser/model/store'
import type { ProductNodeTreeDto, ProductReadTreeDto } from '@/shared/api/openapi'

function TreeNode({
  node,
  depth = 0,
}: {
  node: ProductNodeTreeDto
  depth?: number
}) {
  const expandedIds = useProductBrowserStore((state) => state.expandedIds)
  const toggleExpanded = useProductBrowserStore((state) => state.toggleExpanded)

  const hasChildren = (node.children?.length ?? 0) > 0
  const hasProducts = (node.products?.length ?? 0) > 0
  const isExpanded = expandedIds.includes(node.id)

  return (
    <div className="m-0" style={{ paddingLeft: depth ? `${depth * 16}px` : undefined }}>
      <button
        type="button"
        className="flex w-full items-center gap-1.5 rounded-lg border-none bg-transparent px-2 py-1.5 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white/6"
        onClick={() => toggleExpanded(node.id)}
      >
        <span className="w-3.5 shrink-0 text-[10px] text-zinc-500">
          {hasChildren || hasProducts ? (isExpanded ? '▼' : '▶') : '•'}
        </span>
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{node.name}</span>
      </button>

      {isExpanded ? (
        <>
          {node.children?.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
          {node.products?.map((product) => (
            <ProductLink key={product.id} product={product} depth={depth + 1} />
          ))}
        </>
      ) : null}
    </div>
  )
}

function ProductLink({
  product,
  depth,
}: {
  product: ProductReadTreeDto
  depth: number
}) {
  return (
    <NavLink
      to={`/products/${product.id}`}
      className={({ isActive }) =>
        `flex w-full items-center gap-1.5 rounded-lg border-none px-2 py-1.5 text-left text-sm font-normal transition-colors hover:bg-white/6 ${
          isActive ? 'bg-violet-500/20 text-violet-200' : 'text-zinc-400'
        }`
      }
      style={{ paddingLeft: `${depth * 16 + 16}px` }}
    >
      <span className="w-3.5 shrink-0 text-[10px]">#</span>
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</span>
    </NavLink>
  )
}

export function ProductsSidebar({
  tree,
  isLoading,
  onRefresh,
}: {
  tree: ProductNodeTreeDto[]
  isLoading: boolean
  onRefresh: () => Promise<void>
}) {
  const openCreateRoot = useProductBrowserStore((state) => state.openCreateRoot)

  return (
    <aside className="w-[280px] shrink-0 overflow-y-auto border-r border-white/6 bg-zinc-950/40 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Категорії
        </h2>
        <button
          type="button"
          title="Додати кореневу категорію"
          onClick={openCreateRoot}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[11px] font-medium text-violet-200 transition hover:bg-violet-500/20"
        >
          <FolderPlus className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="hidden sm:inline">Коренева</span>
        </button>
      </div>

      <CreateRootCategoryForm onCreated={onRefresh} />

      {isLoading ? <p className="text-sm text-zinc-500">Завантаження дерева…</p> : null}

      {!isLoading && tree.length === 0 ? (
        <p className="text-sm text-zinc-500">Поки що немає категорій для цього користувача.</p>
      ) : null}

      {tree.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </aside>
  )
}

