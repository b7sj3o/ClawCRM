import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createProduct } from '@/entities/product/api/product-api'
import { ModalShell } from '@/shared/ui/modal-shell'

export function CreateProductModal({
  nodeId,
  nodeName,
  onClose,
  onCreated,
}: {
  nodeId: number
  nodeName: string
  onClose: () => void
  onCreated: () => Promise<void>
}) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [buyPrice, setBuyPrice] = useState('0')
  const [sellPrice, setSellPrice] = useState('0')
  const [quantity, setQuantity] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <ModalShell title="Створити продукт" subtitle={`Категорія: ${nodeName}`} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()

          const parsedBuyPrice = Number.parseFloat(buyPrice)
          const parsedSellPrice = Number.parseFloat(sellPrice)
          const parsedQuantity = Number.parseInt(quantity, 10)

          if (!name.trim()) {
            setError('Введіть назву продукту')
            return
          }

          if (
            !Number.isFinite(parsedBuyPrice) ||
            !Number.isFinite(parsedSellPrice) ||
            !Number.isFinite(parsedQuantity) ||
            parsedQuantity < 0
          ) {
            setError('Вкажіть коректні дані продукту')
            return
          }

          try {
            setIsSubmitting(true)
            setError(null)

            const product = await createProduct({
              node_id: nodeId,
              name: name.trim(),
              description: description.trim() || null,
              buy_price: parsedBuyPrice,
              sell_price: parsedSellPrice,
              quantity: parsedQuantity,
            })

            await onCreated()
            onClose()
            navigate(`/products/${product.id}`)
          } catch {
            setError('Не вдалося створити продукт')
          } finally {
            setIsSubmitting(false)
          }
        }}
      >
        <label className="block">
          <span className="mb-2 block text-sm text-zinc-300">Назва</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
            autoFocus
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-300">Опис</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-24 w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Купівля</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={buyPrice}
              onChange={(event) => setBuyPrice(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Продаж</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={sellPrice}
              onChange={(event) => setSellPrice(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Кількість</span>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-500/50"
            />
          </label>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
          >
            {isSubmitting ? 'Створення…' : 'Створити'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Скасувати
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

