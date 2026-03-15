import { useState, useEffect } from 'react'
import type { Product, ProductCreate } from '../types'

interface ProductFormProps {
  product: Product | null
  nodeId: number
  onSubmit: (data: ProductCreate, productId?: number) => Promise<void>
  onClose: () => void
}

export function ProductForm({ product, nodeId, onSubmit, onClose }: ProductFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description)
      setBuyPrice(product.buy_price)
      setSellPrice(product.sell_price)
      setQuantity(product.quantity)
    } else {
      setName('')
      setDescription('')
      setBuyPrice('')
      setSellPrice('')
      setQuantity(0)
    }
    setError('')
  }, [product, nodeId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit(
        {
          name,
          description,
          buy_price: buyPrice,
          sell_price: sellPrice,
          quantity,
          node_id: product?.node_id ?? nodeId,
        },
        product?.id
      )
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-elevated)',
          borderRadius: 12,
          padding: 24,
          width: '100%',
          maxWidth: 480,
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 20px', fontSize: 18 }}>
          {product ? 'Редагувати продукт' : 'Новий продукт'}
        </h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                background: 'rgba(248,81,73,0.15)',
                borderRadius: 6,
                color: 'var(--danger)',
              }}
            >
              {error}
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Назва</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Опис</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Ціна закупки</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Ціна продажу</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Кількість</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '8px 16px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 6,
                color: 'var(--bg)',
                cursor: 'pointer',
              }}
            >
              {saving ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
