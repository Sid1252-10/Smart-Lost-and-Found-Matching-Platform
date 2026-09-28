import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { RegistryItem, MatchResult } from '../types'
import {
  fetchAllReports,
  saveReport,
  updateReportStatus,
  submitClaim as dbSubmitClaim,
} from '../lib/dbService'
import { findBestMatchesForReport } from '../lib/matchingEngine'

type RegistryContextValue = {
  items: RegistryItem[]
  loading: boolean
  addItem: (item: Partial<RegistryItem>) => Promise<{
    item: RegistryItem
    matches: MatchResult[]
  }>
  claimItem: (id: string, claimedBy: string, proof?: string) => Promise<void>
  recoverItem: (id: string) => Promise<void>
  findMatches: (item: RegistryItem) => MatchResult[]
  refreshItems: () => Promise<void>
}

const RegistryContext = createContext<RegistryContextValue | null>(null)

export function RegistryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RegistryItem[]>([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      const data = await fetchAllReports()
      setItems(data as RegistryItem[])
    } catch (err) {
      console.error('Failed to load reports from database service:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function addItem(rawItem: Partial<RegistryItem>) {
    const isLost =
      String(rawItem.kind || rawItem.type || 'lost').toLowerCase() === 'lost'

    const newItem: RegistryItem = {
      id: rawItem.id || crypto.randomUUID(),
      kind: isLost ? 'lost' : 'found',
      type: isLost ? 'LOST' : 'FOUND',
      status: isLost ? 'REPORTED LOST' : 'FOUND',
      title: rawItem.title || 'Untitled Treasure',
      locationId: rawItem.locationId || 'marineford',
      location: rawItem.location || 'Marineford',
      groveNumber: rawItem.groveNumber || 41,
      category: rawItem.category || 'Swords & Gear',
      colour: rawItem.colour || 'Standard',
      uniqueMarks: rawItem.uniqueMarks || 'None',
      description: rawItem.description || '',
      incidentDate:
        rawItem.incidentDate ||
        rawItem.dateLost ||
        rawItem.dateFound ||
        new Date().toISOString().split('T')[0],
      dateLost: isLost
        ? rawItem.dateLost || rawItem.incidentDate || new Date().toISOString().split('T')[0]
        : undefined,
      dateFound: !isLost
        ? rawItem.dateFound || rawItem.incidentDate || new Date().toISOString().split('T')[0]
        : undefined,
      imageUrl: rawItem.imageUrl || '',
      contactInfo: rawItem.contactInfo || '',
      reward: rawItem.reward || '',
      createdAt: new Date().toISOString(),
    }

    // 1. Calculate smart matches immediately (strictly same-category!)
    const currentList = items
    const matches = findBestMatchesForReport(newItem, currentList, 30, 5)

    if (matches.length > 0) {
      newItem.status = 'POTENTIAL_MATCH'
    }

    // 2. Persist to DB / storage
    await saveReport(newItem)

    // 3. Update state
    setItems((prev) => [newItem, ...prev])

    return { item: newItem, matches }
  }

  async function claimItem(id: string, claimedBy: string, proof: string = '') {
    await dbSubmitClaim({
      reportId: id,
      claimantName: claimedBy,
      proofDescription: proof,
    })

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'CLAIMED', claimedBy }
          : item
      )
    )
  }

  async function recoverItem(id: string) {
    await updateReportStatus(id, 'RECOVERED')
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'RECOVERED' } : item
      )
    )
  }

  function findMatches(targetItem: RegistryItem): MatchResult[] {
    return findBestMatchesForReport(targetItem, items, 30, 10)
  }

  const value = useMemo(
    () => ({
      items,
      loading,
      addItem,
      claimItem,
      recoverItem,
      findMatches,
      refreshItems: loadData,
    }),
    [items, loading]
  )

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  )
}

export function useRegistry() {
  const ctx = useContext(RegistryContext)
  if (!ctx) throw new Error('useRegistry must be used within RegistryProvider')
  return ctx
}
