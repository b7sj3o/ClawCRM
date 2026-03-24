import { useState } from 'react'

import { createProductNode } from '@/entities/product-node/api/product-node-api'
import { useProductBrowserStore } from '@/features/product-browser/model/store'

export function CreateRootCategoryForm({
  onCreated,
}: {
  onCreated: () => Promise<void>
}) {
  const isOpen = useProductBrowserStore((state) => state.isCreateRootOpen)
  const name = useProductBrowserStore((state) => state.rootCategoryName)
  const setName = useProductBrowserStore((state) => state.setRootCategoryName)
  const close = useProductBrowserStore((state) => state.closeCreateRoot)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) {
    return null
  }

  return (
    <form
      className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3"
      onSubmit={async (event) => {
        event.preventDefault()

        const trimmedName = name.trim()
        if (!trimmedName) {
          setError('Введіть назву')
          return
        }

        try {
          setIsSubmitting(true)
          setError(null)

          await createProductNode({
            name: trimmedName,
            parent_id: null,
          })

          close()
          await onCreated()
        } catch {
          setError('Не вдалося створити категорію')
        } finally {
          setIsSubmitting(false)
        }
      }}
    >
      <label className="mb-2 block text-xs text-zinc-400">Назва кореневої категорії</label>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Наприклад, Електроніка"
        className="mb-2 w-full rounded-md border border-white/10 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-violet-500/50"
        autoFocus
      />
      {error ? <p className="mb-2 text-xs text-red-400">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Збереження…' : 'Додати'}
        </button>
        <button
          type="button"
          onClick={close}
          className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
        >
          Скасувати
        </button>
      </div>
    </form>
  )
}

