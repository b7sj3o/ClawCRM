import { useState, useCallback } from 'react'
import { CategoryTree } from './components/CategoryTree'
import { ProductList } from './components/ProductList'
import { ProductForm } from './components/ProductForm'
import type { Product, ProductCreate } from './types'
import { api } from './api'

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [formProduct, setFormProduct] = useState<Product | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  const handleSubmit = async (data: ProductCreate, productId?: number) => {
    if (productId != null) {
      await api.products.update(productId, data)
    } else {
      await api.products.create(data)
    }
    refresh()
  }

  const canAddProduct = selectedNodeId != null

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <aside
        style={{
          width: 280,
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          CRM
        </div>
        <CategoryTree
          selectedId={selectedNodeId}
          onSelect={setSelectedNodeId}
        />
      </aside>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <header
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1 style={{ margin: 0, fontSize: 20 }}>
            {selectedNodeId == null ? 'Усі продукти' : 'Продукти категорії'}
          </h1>
          <button
            type="button"
            onClick={() => {
              setFormProduct(null)
              setFormOpen(true)
            }}
            disabled={!canAddProduct}
            title={
              canAddProduct
                ? 'Додати продукт'
                : 'Оберіть категорію для додавання продукту'
            }
            style={{
              padding: '8px 16px',
              background: canAddProduct ? 'var(--accent)' : 'var(--bg-hover)',
              border: 'none',
              borderRadius: 6,
              color: canAddProduct ? 'var(--bg)' : 'var(--text-muted)',
              cursor: canAddProduct ? 'pointer' : 'not-allowed',
              fontWeight: 500,
            }}
          >
            + Додати продукт
          </button>
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <ProductList
            nodeId={selectedNodeId}
            onEdit={(p) => {
              setFormProduct(p)
              setFormOpen(true)
            }}
            refreshTrigger={refreshKey}
            onRefresh={refresh}
          />
        </div>
      </main>

      {formOpen && (
        <ProductForm
          product={formProduct}
          nodeId={selectedNodeId ?? 0}
          onSubmit={handleSubmit}
          onClose={() => {
            setFormOpen(false)
            setFormProduct(null)
          }}
        />
      )}
    </div>
  )
}

export default App
