import { useState, useEffect, useCallback } from 'react'
import type { ProductNode } from '../types'
import { api } from '../api'

interface CategoryTreeProps {
  selectedId: number | null
  onSelect: (id: number | null) => void
}

function TreeNode({
  node,
  level,
  selectedId,
  onSelect,
  expandedIds,
  onToggle,
}: {
  node: ProductNode
  level: number
  selectedId: number | null
  onSelect: (id: number) => void
  expandedIds: Set<number>
  onToggle: (id: number) => void
}) {
  const [children, setChildren] = useState<ProductNode[]>([])
  const [loading, setLoading] = useState(false)
  const isExpanded = expandedIds.has(node.id)

  useEffect(() => {
    if (!isExpanded) return
    setLoading(true)
    api.productNodes.list({ parent_id: node.id }).then((r) => {
      setChildren(r.items)
      setLoading(false)
    })
  }, [node.id, isExpanded])

  const handleClick = () => {
    onSelect(node.id)
  }

  const handleChevron = () => {
    onToggle(node.id)
  }

  return (
    <div style={{ marginLeft: level * 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          borderRadius: 6,
          cursor: 'pointer',
          background: selectedId === node.id ? 'var(--bg-hover)' : 'transparent',
        }}
        onClick={handleClick}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleChevron()
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 2,
            width: 20,
          }}
        >
          <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}>
            ▶
          </span>
        </button>
        <span>{node.name}</span>
      </div>
      {isExpanded &&
        (loading ? (
          <div style={{ marginLeft: 26, padding: '4px 0', color: 'var(--text-muted)' }}>
            Завантаження...
          </div>
        ) : (
          <>
            {children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                expandedIds={expandedIds}
                onToggle={onToggle}
              />
            ))}
          </>
        ))}
    </div>
  )
}

export function CategoryTree({ selectedId, onSelect }: CategoryTreeProps) {
  const [roots, setRoots] = useState<ProductNode[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  const loadRoots = useCallback(() => {
    setLoading(true)
    api.productNodes.roots().then(setRoots).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadRoots()
  }, [loadRoots])

  const handleAddCategory = async () => {
    const name = prompt('Назва категорії:')
    if (!name?.trim()) return
    try {
      await api.productNodes.create({ name: name.trim(), parent_id: null })
      loadRoots()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Помилка')
    }
  }

  const toggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (loading) return <div style={{ padding: 16, color: 'var(--text-muted)' }}>Завантаження...</div>

  return (
    <div style={{ padding: '8px 0' }}>
      <div
        style={{
          padding: '8px 16px',
          marginBottom: 8,
          borderBottom: '1px solid var(--border)',
          fontSize: 11,
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>Категорії</span>
        <button
          type="button"
          onClick={handleAddCategory}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          +
        </button>
      </div>
      <div
        style={{
          padding: '6px 10px',
          cursor: 'pointer',
          borderRadius: 6,
          background: selectedId === null ? 'var(--bg-hover)' : 'transparent',
        }}
        onClick={() => onSelect(null)}
      >
        Усі продукти
      </div>
      {roots.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          onToggle={toggle}
        />
      ))}
    </div>
  )
}
