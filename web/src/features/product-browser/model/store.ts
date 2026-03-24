import { create } from 'zustand'

export const useProductBrowserStore = create<{
  expandedIds: number[]
  isCreateRootOpen: boolean
  rootCategoryName: string
  isContextMenuOpenFor: number | null
  toggleExpanded: (id: number) => void
  openCreateRoot: () => void
  closeCreateRoot: () => void
  setRootCategoryName: (value: string) => void
  openContextMenu: (id: number) => void
  closeContextMenu: () => void
}>((set) => ({
  expandedIds: [],
  isCreateRootOpen: false,
  rootCategoryName: '',
  isContextMenuOpenFor: null,
  toggleExpanded: (id) =>
    set((state) => ({
      expandedIds: state.expandedIds.includes(id)
        ? state.expandedIds.filter((item) => item !== id)
        : [...state.expandedIds, id],
    })),
  openCreateRoot: () =>
    set({
      isCreateRootOpen: true,
      rootCategoryName: '',
    }),
  closeCreateRoot: () =>
    set({
      isCreateRootOpen: false,
      rootCategoryName: '',
    }),
  setRootCategoryName: (value) => set({ rootCategoryName: value }),
  openContextMenu: (id) => set({ isContextMenuOpenFor: id }),
  closeContextMenu: () => set({ isContextMenuOpenFor: null }),
}))

