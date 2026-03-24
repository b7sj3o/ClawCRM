import { useState } from 'react'

import { createProductNode } from '@/entities/product-node/api/product-node-api'
import { ModalShell } from '@/shared/ui/modal-shell'

export function CreateProductNodeModal({
  parentId,
  parentName,
  onClose,
  onCreated,
}: {
  parentId: number
  parentName: string
  onClose: () => void
  onCreated: () => Promise<void>
}) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <ModalShell title="Створити підкатегорію" subtitle={`Батьківська категорія: ${parentName}`} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault()

          const trimmedName = name.trim()
          if (!trimmedName) {
            setError('Введіть назву підкатегорії')
            return
          }

          try {
            setIsSubmitting(true)
            setError(null)

            await createProductNode({
              name: trimmedName,
              parent_id: parentId,
            })

            await onCreated()
            onClose()
          } catch {
            setError('Не вдалося створити підкатегорію')
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

