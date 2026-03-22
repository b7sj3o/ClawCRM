import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/react'

import type { ProductReadTreeDto } from '../client'
import { createSale } from '../api/sale'

type SaleFormProps = {
  product: ProductReadTreeDto
}

export function SaleForm({ product }: SaleFormProps) {
  const { getToken, isSignedIn } = useAuth()
  const [buyPrice, setBuyPrice] = useState(product.buy_price)
  const [sellPrice, setSellPrice] = useState(product.sell_price)
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    setBuyPrice(product.buy_price)
    setSellPrice(product.sell_price)
    setQuantity(1)
    setError(null)
    setSuccess(null)
  }, [product])

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const handleQuantityInput = (value: string) => {
    if (!value) {
      setQuantity(1)
      return
    }

    const parsed = Number.parseInt(value, 10)
    setQuantity(Number.isFinite(parsed) && parsed > 0 ? parsed : 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isSignedIn) {
      setError('Спочатку увійди в акаунт.')
      return
    }

    const parsedBuyPrice = Number.parseFloat(buyPrice)
    const parsedSellPrice = Number.parseFloat(sellPrice)

    if (!Number.isFinite(parsedBuyPrice) || !Number.isFinite(parsedSellPrice)) {
      setError('Вкажи коректні ціни.')
      return
    }

    if (quantity < 1) {
      setError('Кількість має бути більше 0.')
      return
    }

    try {
      setIsSubmitting(true)
      const token = await getToken({ skipCache: true })
      await createSale(
        {
          product_id: product.id,
          buy_price: parsedBuyPrice,
          sell_price: parsedSellPrice,
          quantity,
        },
        token,
      )
      setSuccess('Продаж успішно додано.')
    } catch {
      setError('Не вдалося створити продаж.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <h3 className="mb-3 text-sm font-semibold">Додати продаж</h3>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Закупочна ціна</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 dark:border-gray-600 dark:bg-gray-900"
        />
      </label>

      <label className="mb-3 block">
        <span className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Продажна ціна</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 dark:border-gray-600 dark:bg-gray-900"
        />
      </label>

      <div className="mb-3">
        <span className="mb-1 block text-sm text-gray-600 dark:text-gray-300">Кількість</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrementQuantity}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => handleQuantityInput(e.target.value)}
            className="w-24 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500 dark:border-gray-600 dark:bg-gray-900"
          />
          <button
            type="button"
            onClick={incrementQuantity}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            +
          </button>
        </div>
      </div>

      {error ? <p className="mb-2 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {success ? <p className="mb-2 text-sm text-green-600 dark:text-green-400">{success}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Зберігаю...' : 'Створити продаж'}
      </button>
    </form>
  )
}
