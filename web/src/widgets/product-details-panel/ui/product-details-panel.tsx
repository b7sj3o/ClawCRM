import { CreateSaleForm } from '@/features/create-sale/ui/create-sale-form'
import type { ProductReadTreeDto } from '@/shared/api/openapi'

export function ProductDetailsPanel({
  product,
}: {
  product: ProductReadTreeDto
}) {
  return (
    <div className="max-w-lg rounded-2xl border border-white/8 bg-[#14141a]/80 p-6 shadow-xl shadow-black/50 backdrop-blur-xl">
      <h2 className="mb-2 text-xl font-semibold text-zinc-50">{product.name}</h2>
      <p className="mb-3 text-sm leading-relaxed text-zinc-400">{product.description ?? '—'}</p>
      <p className="mb-2 text-sm text-zinc-300">
        Купівля: {product.buy_price} · Продаж: {product.sell_price}
      </p>
      <p className="mb-2 text-sm text-zinc-300">Кількість на складі: {product.quantity}</p>
      <p className="mb-4 text-xs text-zinc-500">Створено: {product.created_at}</p>

      <CreateSaleForm product={product} />
    </div>
  )
}

