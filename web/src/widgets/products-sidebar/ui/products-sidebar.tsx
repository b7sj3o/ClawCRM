import { useEffect, useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'

import { deleteProduct } from '@/entities/product/api/product-api'
import { deleteProductNode } from '@/entities/product-node/api/product-node-api'
import { CreateProductModal } from '@/features/create-product/ui/create-product-modal'
import { CreateRootCategoryForm } from '@/features/create-product-node/ui/create-root-category-form'
import { CreateProductNodeModal } from '@/features/create-product-node/ui/create-product-node-modal'
import { useProductBrowserStore } from '@/features/product-browser/model/store'
import type { ProductNodeTreeDto, ProductReadTreeDto } from '@/shared/api/openapi'

function TreeNode({
  node,
  depth = 0,
  onNodeContextMenu,
  onProductContextMenu,
}: {
  node: ProductNodeTreeDto
  depth?: number
  onNodeContextMenu: (event: React.MouseEvent<HTMLButtonElement>, node: ProductNodeTreeDto) => void
  onProductContextMenu: (event: React.MouseEvent<HTMLAnchorElement>, product: ProductReadTreeDto) => void
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
        onContextMenu={(event) => onNodeContextMenu(event, node)}
      >
        <span className="w-3.5 shrink-0 text-[10px] text-zinc-500">
          {hasChildren || hasProducts ? (isExpanded ? '▼' : '▶') : '•'}
        </span>
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{node.name}</span>
      </button>

      {isExpanded ? (
        <>
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onNodeContextMenu={onNodeContextMenu}
              onProductContextMenu={onProductContextMenu}
            />
          ))}
          {node.products?.map((product) => (
            <ProductLink
              key={product.id}
              product={product}
              depth={depth + 1}
              onContextMenu={onProductContextMenu}
            />
          ))}
        </>
      ) : null}
    </div>
  )
}

function ProductLink({
  product,
  depth,
  onContextMenu,
}: {
  product: ProductReadTreeDto
  depth: number
  onContextMenu: (event: React.MouseEvent<HTMLAnchorElement>, product: ProductReadTreeDto) => void
}) {
  return (
    <NavLink
      to={`/products/${product.id}`}
      onContextMenu={(event) => onContextMenu(event, product)}
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
  const navigate = useNavigate()
  const openCreateRoot = useProductBrowserStore((state) => state.openCreateRoot)
  const [contextMenu, setContextMenu] = useState<
    | { kind: 'node'; x: number; y: number; node: ProductNodeTreeDto }
    | { kind: 'product'; x: number; y: number; product: ProductReadTreeDto }
    | null
  >(null)
  const [createChildNode, setCreateChildNode] = useState<ProductNodeTreeDto | null>(null)
  const [createProductForNode, setCreateProductForNode] = useState<ProductNodeTreeDto | null>(null)

  useEffect(() => {
    const handleClose = () => setContextMenu(null)

    window.addEventListener('click', handleClose)
    window.addEventListener('scroll', handleClose, true)

    return () => {
      window.removeEventListener('click', handleClose)
      window.removeEventListener('scroll', handleClose, true)
    }
  }, [])

  const showNodeMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    node: ProductNodeTreeDto,
  ) => {
    event.preventDefault()
    setContextMenu({
      kind: 'node',
      x: event.clientX,
      y: event.clientY,
      node,
    })
  }

  const showProductMenu = (
    event: React.MouseEvent<HTMLAnchorElement>,
    product: ProductReadTreeDto,
  ) => {
    event.preventDefault()
    setContextMenu({
      kind: 'product',
      x: event.clientX,
      y: event.clientY,
      product,
    })
  }

  const closeContextMenu = () => setContextMenu(null)

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
        <TreeNode
          key={node.id}
          node={node}
          onNodeContextMenu={showNodeMenu}
          onProductContextMenu={showProductMenu}
        />
      ))}

      {contextMenu?.kind === 'node' ? (
        <div
          className="fixed z-40 min-w-56 rounded-xl border border-white/10 bg-[#14141a] p-2 shadow-2xl shadow-black/60"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <ContextMenuButton
            label="Створити підкатегорію"
            onClick={() => {
              setCreateChildNode(contextMenu.node)
              closeContextMenu()
            }}
          />
          <ContextMenuButton
            label="Створити продукт"
            onClick={() => {
              setCreateProductForNode(contextMenu.node)
              closeContextMenu()
            }}
          />
          <ContextMenuButton
            label="Редагувати категорію (заглушка)"
            onClick={() => {
              closeContextMenu()
              window.alert('Редагування категорії буде додано пізніше.')
            }}
          />
          <ContextMenuButton
            label="Видалити категорію"
            tone="danger"
            onClick={async () => {
              closeContextMenu()

              if (!window.confirm(`Видалити категорію "${contextMenu.node.name}"?`)) {
                return
              }

              try {
                await deleteProductNode(contextMenu.node.id)
                navigate('/products')
                await onRefresh()
              } catch {
                window.alert('Не вдалося видалити категорію.')
              }
            }}
          />
        </div>
      ) : null}

      {contextMenu?.kind === 'product' ? (
        <div
          className="fixed z-40 min-w-56 rounded-xl border border-white/10 bg-[#14141a] p-2 shadow-2xl shadow-black/60"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <ContextMenuButton
            label="Редагувати продукт (заглушка)"
            onClick={() => {
              closeContextMenu()
              window.alert('Редагування продукту буде додано пізніше.')
            }}
          />
          <ContextMenuButton
            label="Видалити продукт"
            tone="danger"
            onClick={async () => {
              closeContextMenu()

              if (!window.confirm(`Видалити продукт "${contextMenu.product.name}"?`)) {
                return
              }

              try {
                await deleteProduct(contextMenu.product.id)
                navigate('/products')
                await onRefresh()
              } catch {
                window.alert('Не вдалося видалити продукт.')
              }
            }}
          />
        </div>
      ) : null}

      {createChildNode ? (
        <CreateProductNodeModal
          parentId={createChildNode.id}
          parentName={createChildNode.name}
          onClose={() => setCreateChildNode(null)}
          onCreated={onRefresh}
        />
      ) : null}

      {createProductForNode ? (
        <CreateProductModal
          nodeId={createProductForNode.id}
          nodeName={createProductForNode.name}
          onClose={() => setCreateProductForNode(null)}
          onCreated={onRefresh}
        />
      ) : null}
    </aside>
  )
}

function ContextMenuButton({
  label,
  onClick,
  tone = 'default',
}: {
  label: string
  onClick: () => void
  tone?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/8 ${
        tone === 'danger' ? 'text-red-400' : 'text-zinc-200'
      }`}
    >
      {label}
    </button>
  )
}

