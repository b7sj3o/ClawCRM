import { useCallback, useEffect, useState } from 'react'
import { OrganizationSwitcher, SignInButton, useAuth } from '@clerk/react'
import { FolderPlus } from 'lucide-react'
import { createProductNode, getProductsTree } from './api/product'
import type { ProductNodeTreeDto, ProductReadTreeDto } from './client'
import { SaleForm } from './components/SaleForm'
import { AppSidebar, type AppView } from './components/AppSidebar'
import { SalesTable } from './components/SalesTable'

function App() {
  const { isSignedIn } = useAuth()
  const [view, setView] = useState<AppView>('products')
  const [tree, setTree] = useState<ProductNodeTreeDto[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<ProductReadTreeDto | null>(null)
  const [folderContextMenu, setFolderContextMenu] = useState<number | null>(null)
  const [showAddRootCategory, setShowAddRootCategory] = useState(false)
  const [rootCategoryName, setRootCategoryName] = useState('')
  const [addingRoot, setAddingRoot] = useState(false)
  const [addRootError, setAddRootError] = useState<string | null>(null)

  const refreshTree = useCallback(async () => {
    const res = await getProductsTree()
    setTree(res)
  }, [])

  useEffect(() => {
    void refreshTree()
  }, [refreshTree])

  const toggleFolder = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleProductClick = (product: ProductReadTreeDto) => {
    setSelectedProduct(product)
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>, node: ProductNodeTreeDto) => {
    e.preventDefault()
    console.log(node)
    setFolderContextMenu(node.id)
  }

  const TreeNode = ({ node, depth = 0 }: { node: ProductNodeTreeDto; depth?: number }) => {
    const hasChildren = (node.children?.length ?? 0) > 0
    const hasProducts = (node.products?.length ?? 0) > 0
    const isExpanded = expandedIds.has(node.id)

    return (
      <div className="m-0" style={{ paddingLeft: depth ? `${depth * 16}px` : undefined }}>
        <button
          type="button"
          className="flex w-full items-center gap-1.5 rounded-lg border-none bg-transparent px-2 py-1.5 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white/6"
          onClick={() => toggleFolder(node.id)}
          onContextMenu={(e) => handleContextMenu(e, node)}
          key={node.id}
        >
          <span className="w-3.5 shrink-0 text-[10px] text-zinc-500">
            {hasChildren || hasProducts ? (isExpanded ? '▼' : '▶') : '•'}
          </span>
          <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{node.name}</span>
        </button>

        {isExpanded && (
          <>
            {node.children?.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
            {node.products?.map((product) => (
              <button
                type="button"
                className={`flex w-full items-center gap-1.5 rounded-lg border-none bg-transparent px-2 py-1.5 text-left text-sm font-normal transition-colors hover:bg-white/6 ${selectedProduct?.id === product.id ? 'bg-violet-500/20 text-violet-200' : 'text-zinc-400'}`}
                onClick={() => handleProductClick(product)}
                key={product.id}
                style={{ paddingLeft: `${16}px` }}
              >
                <span className="w-3.5 shrink-0 text-[10px]">📄</span>
                <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{product.name}</span>
              </button>
            ))}
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen bg-[#0c0c0f] text-zinc-200"
      onClick={() => setFolderContextMenu(null)}
    >
      <AppSidebar active={view} onChange={setView} />

      {view === 'products' ? (
        <aside className="w-[280px] shrink-0 overflow-y-auto border-r border-white/6 bg-zinc-950/40 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Категорії</h2>
            <button
              type="button"
              title="Додати кореневу категорію"
              onClick={() => {
                setShowAddRootCategory((v) => !v)
                setAddRootError(null)
                setRootCategoryName('')
              }}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[11px] font-medium text-violet-200 transition hover:bg-violet-500/20"
            >
              <FolderPlus className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">Коренева</span>
            </button>
          </div>
          {showAddRootCategory ? (
            <form
              className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3"
              onSubmit={async (e) => {
                e.preventDefault()
                const name = rootCategoryName.trim()
                if (!name) {
                  setAddRootError('Введіть назву')
                  return
                }
                setAddingRoot(true)
                setAddRootError(null)
                try {
                  await createProductNode({ name, parent_id: null })
                  setRootCategoryName('')
                  setShowAddRootCategory(false)
                  await refreshTree()
                } catch {
                  setAddRootError('Не вдалося створити категорію')
                } finally {
                  setAddingRoot(false)
                }
              }}
            >
              <label className="mb-2 block text-xs text-zinc-400">Назва кореневої категорії</label>
              <input
                type="text"
                value={rootCategoryName}
                onChange={(e) => setRootCategoryName(e.target.value)}
                placeholder="Наприклад, Електроніка"
                className="mb-2 w-full rounded-md border border-white/10 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
                autoFocus
              />
              {addRootError ? <p className="mb-2 text-xs text-red-400">{addRootError}</p> : null}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addingRoot}
                  className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {addingRoot ? 'Збереження…' : 'Додати'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRootCategory(false)
                    setRootCategoryName('')
                    setAddRootError(null)
                  }}
                  className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
                >
                  Скасувати
                </button>
              </div>
            </form>
          ) : null}
          {tree.map((node) => (
            <TreeNode key={node.id} node={node} />
          ))}
        </aside>
      ) : null}

      <main className="min-w-0 flex-1 p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
              {view === 'products' ? 'Товари' : 'Продажі'}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {view === 'products' ? 'Оберіть продукт у дереві категорій' : 'Усі продажі поточної організації'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isSignedIn ? (
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/"
                appearance={{
                  elements: {
                    rootBox: 'flex justify-end',
                    organizationSwitcherTrigger:
                      'rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10',
                  },
                }}
              />
            ) : (
              <SignInButton>
                <button
                  type="button"
                  className="cursor-pointer rounded-xl border border-violet-500/40 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/25"
                >
                  Увійти
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {view === 'products' ? (
          selectedProduct ? (
            <div className="max-w-lg rounded-2xl border border-white/8 bg-[#14141a]/80 p-6 shadow-xl shadow-black/50 backdrop-blur-xl">
              <h2 className="mb-2 text-xl font-semibold text-zinc-50">{selectedProduct.name}</h2>
              <p className="mb-3 text-sm leading-relaxed text-zinc-400">{selectedProduct.description ?? '—'}</p>
              <p className="mb-2 text-sm text-zinc-300">
                Купівля: {selectedProduct.buy_price} · Продаж: {selectedProduct.sell_price}
              </p>
              <p className="mb-2 text-sm text-zinc-300">Кількість на складі: {selectedProduct.quantity}</p>
              <p className="mb-4 text-xs text-zinc-500">Створено: {selectedProduct.created_at}</p>
              <SaleForm product={selectedProduct} />
            </div>
          ) : (
            <p className="text-zinc-500">Оберіть продукт у списку зліва.</p>
          )
        ) : (
          <SalesTable />
        )}
      </main>

      {folderContextMenu && (
        <div className="fixed left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-xl border border-white/10 bg-zinc-900 p-2 shadow-2xl">
          <button className="rounded-lg px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/10">Створити підкатегорію</button>
          <button className="rounded-lg px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/10">Створити продукт</button>
          <button className="rounded-lg px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/10">Редагувати</button>
          <button className="rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10">Вилучити</button>
        </div>
      )}
    </div>
  )
}

export default App
