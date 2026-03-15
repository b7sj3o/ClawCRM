import { useState, useEffect } from 'react'
import type { Product } from '../types'
import { api } from '../api'

interface ProductListProps {
  nodeId: number | null
  onEdit: (p: Product) => void
  refreshTrigger: number
  onRefresh: () => void
}

export function ProductList({ nodeId, onEdit, refreshTrigger, onRefresh }: ProductListProps) {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    api.products.list(nodeId != null ? { node_id: nodeId } : {}).then((r) => {
      setItems(r.items)
      setLoading(false)
    })
  }, [nodeId, refreshTrigger])

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити цей продукт?')) return
    setDeleting(id)
    try {
      await api.products.delete(id)
      onRefresh()
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
        Завантаження...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
        Немає продуктів у цій категорії
      </div>
    )
  }

  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Назва</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>Опис</th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>Закупка</th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>Ціна</th>
            <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: 600 }}>Кількість</th>
            <th style={{ width: 100 }} />
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr
              key={p.id}
              style={{
                borderBottom: '1px solid var(--border)',
              }}
            >
              <td style={{ padding: '12px 16px' }}>{p.name}</td>
              <td
                style={{
                  padding: '12px 16px',
                  color: 'var(--text-muted)',
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={p.description}
              >
                {p.description}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right' }}>{p.buy_price}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right' }}>{p.sell_price}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right' }}>{p.quantity}</td>
              <td style={{ padding: '12px 16px' }}>
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  style={{
                    marginRight: 8,
                    padding: '4px 10px',
                    background: 'var(--bg-hover)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    color: 'var(--accent)',
                    cursor: 'pointer',
                  }}
                >
                  Редагувати
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  disabled={deleting === p.id}
                  style={{
                    padding: '4px 10px',
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    color: 'var(--danger)',
                    cursor: 'pointer',
                  }}
                >
                  {deleting === p.id ? '...' : 'Видалити'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
