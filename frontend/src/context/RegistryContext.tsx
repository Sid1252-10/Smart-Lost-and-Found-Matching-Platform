import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { SEED_ITEMS } from '../data/seed'
import type { RegistryItem } from '../types'

type RegistryContextValue = {
  items: RegistryItem[]
  addItem: (item: RegistryItem) => void
  claimItem: (id: string, claimedBy: string) => void
  recoverItem: (id: string) => void
}

const RegistryContext = createContext<RegistryContextValue | null>(null)

export function RegistryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RegistryItem[]>(SEED_ITEMS)

  const value = useMemo(
    () => ({
      items,
      addItem: (item: RegistryItem) => setItems((prev) => [item, ...prev]),
      claimItem: (id: string, claimedBy: string) =>
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'CLAIMED', claimedBy } : item,
          ),
        ),
      recoverItem: (id: string) =>
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 'RECOVERED' } : item)),
        ),
    }),
    [items],
  )

  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>
}

export function useRegistry() {
  const ctx = useContext(RegistryContext)
  if (!ctx) throw new Error('useRegistry must be used within RegistryProvider')
  return ctx
}
