import { useCallback, useEffect, useState } from 'react'
import { useAuth, useOrganization } from '@clerk/react'
import { RefreshCw } from 'lucide-react'

import { getSales } from '@/entities/sale/api/sale-api'
import type { SaleReadDto } from '@/shared/api/openapi'

export function SalesTable() {
  const { isSignedIn } = useAuth()
  const { organization } = useOrganization()
  const [rows, setRows] = useState<SaleReadDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isSignedIn) {
      setRows([])
      setLoading(false)
      setError('Увійдіть, щоб переглянути продажі.')
      return
    }

    if (!organization) {
      setRows([])
      setLoading(false)
      setError('Оберіть організацію в Clerk.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getSales()
      setRows(data)
    } catch {
      setError('Не вдалося завантажити продажі.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [isSignedIn, organization])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="rounded-2xl border border-white/8 bg-[#14141a]/80 p-4 shadow-xl shadow-black/50 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Продажі
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-zinc-100">
            {organization?.name ?? 'Організація'}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Оновити
        </button>
      </div>

      {error ? <p className="mb-3 text-sm text-amber-400/90">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-white/6">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/6 bg-white/3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Продукт</th>
              <th className="px-4 py-3">Закупівля</th>
              <th className="px-4 py-3">Продаж</th>
              <th className="px-4 py-3">К-сть</th>
              <th className="px-4 py-3">Створено</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  Завантаження…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  Немає продажів для цієї організації.
                </td>
              </tr>
            ) : (
              rows.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-white/4 text-zinc-200 transition hover:bg-white/3 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{sale.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{sale.product_id}</td>
                  <td className="px-4 py-3">{sale.buy_price}</td>
                  <td className="px-4 py-3">{sale.sell_price}</td>
                  <td className="px-4 py-3">{sale.quantity}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {new Date(sale.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

