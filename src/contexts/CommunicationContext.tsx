import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { MOCK_NOTICES } from '@/banco/avisos'
import { MOCK_BULLETINS } from '@/banco/boletins'
import { MOCK_RESULTS } from '@/banco/resultados'
import { MOCK_REGULATIONS } from '@/banco/regulamentos'

// Types for Communication Data
export interface Notice {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  date: Date
  time: string
  author: string
  createdAt: Date
}

export interface Bulletin {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  date: Date
  time: string
  author: string
  fileName: string
  createdAt: Date
}

export interface Result {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  author: string
  fileName: string
  createdAt: Date
  date: Date
  time: string
}

export interface Regulation {
  id: string
  eventId: string
  title: string
  category: string
  description: string
  date: Date
  time: string
  author: string
  fileName: string
  createdAt: Date
}

interface CommunicationContextType {
  notices: Notice[]
  bulletins: Bulletin[]
  results: Result[]
  regulations: Regulation[]
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void
  updateNotice: (id: string, notice: Partial<Omit<Notice, 'id' | 'createdAt'>>) => void
  deleteNotice: (id: string) => void
  addBulletin: (bulletin: Omit<Bulletin, 'id' | 'createdAt'>) => void
  updateBulletin: (id: string, bulletin: Partial<Omit<Bulletin, 'id' | 'createdAt'>>) => void
  deleteBulletin: (id: string) => void
  addResult: (result: Omit<Result, 'id' | 'createdAt'>) => void
  updateResult: (id: string, result: Partial<Result>) => void
  deleteResult: (id: string) => void
  addRegulation: (regulation: Omit<Regulation, 'id' | 'createdAt'>) => void
  updateRegulation: (id: string, regulation: Partial<Omit<Regulation, 'id' | 'createdAt'>>) => void
  deleteRegulation: (id: string) => void
}

const CommunicationContext = createContext<
  CommunicationContextType | undefined
>(undefined)

// MOCK_NOTICES moved to src/banco/avisos.ts

// MOCK_BULLETINS moved to src/banco/boletins.ts

// MOCK_REGULATIONS moved to src/banco/regulamentos.ts

// MOCK_RESULTS moved to src/banco/resultados.ts

export function CommunicationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notices, setNotices] = useState<Notice[]>([])
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [regulations, setRegulations] = useState<Regulation[]>([])

  // Load from local storage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedNotices = localStorage.getItem('ge_comm_notices')
        let initialNotices: Notice[] = []

        if (storedNotices) {
          const parsed = JSON.parse(storedNotices)
          if (Array.isArray(parsed)) {
            initialNotices = parsed.map((n: any) => ({
              ...n,
              date: new Date(n.date),
              createdAt: new Date(n.createdAt),
            }))
          }
        }

        // Merge mocks if Event 2 is missing
        if (!initialNotices.some((n) => n.eventId === '2')) {
          initialNotices = [...initialNotices, ...MOCK_NOTICES as unknown as Notice[]]
        }

        setNotices(initialNotices)

        const storedBulletins = localStorage.getItem('ge_comm_bulletins')
        let initialBulletins: Bulletin[] = []

        if (storedBulletins) {
          const parsed = JSON.parse(storedBulletins)
          if (Array.isArray(parsed)) {
            initialBulletins = parsed.map((b: any) => ({
              ...b,
              date: new Date(b.date),
              createdAt: new Date(b.createdAt),
            }))
          }
        }

        // Merge mocks if Event 2 is missing
        if (!initialBulletins.some((b) => b.eventId === '2')) {
          initialBulletins = [...initialBulletins, ...MOCK_BULLETINS as unknown as Bulletin[]]
        }

        setBulletins(initialBulletins)

        const storedResults = localStorage.getItem('ge_comm_results')
        let initialResults: Result[] = []
        if (storedResults) {
          const parsed = JSON.parse(storedResults)
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialResults = parsed.map((r: any) => ({
              ...r,
              date: new Date(r.date),
              createdAt: new Date(r.createdAt),
            }))
          }
        }

        // Merge mocks if Event 2 is missing
        if (!initialResults.some((r) => r.eventId === '2')) {
          initialResults = [...initialResults, ...MOCK_RESULTS as unknown as Result[]]
        }
        setResults(initialResults)

        const storedRegulations = localStorage.getItem('ge_comm_regulations')
        let initialRegulations: Regulation[] = []

        if (storedRegulations) {
          const parsed = JSON.parse(storedRegulations)
          if (Array.isArray(parsed)) {
            initialRegulations = parsed.map((r: any) => ({
              ...r,
              date: new Date(r.date),
              createdAt: new Date(r.createdAt),
            }))
          }
        }

        // Merge mocks if Event 2 is missing
        if (!initialRegulations.some((r) => r.eventId === '2')) {
          initialRegulations = [...initialRegulations, ...MOCK_REGULATIONS as unknown as Regulation[]]
        }

        setRegulations(initialRegulations)

      } catch (e) {
        console.error('Failed to load communication data', e)
        // Fallback to mocks on error
        setNotices(MOCK_NOTICES as unknown as Notice[])
        setBulletins(MOCK_BULLETINS as unknown as Bulletin[])
        setRegulations(MOCK_REGULATIONS as unknown as Regulation[])
      }
    }
    loadData()
  }, [])

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('ge_comm_notices', JSON.stringify(notices))
  }, [notices])

  useEffect(() => {
    localStorage.setItem('ge_comm_bulletins', JSON.stringify(bulletins))
  }, [bulletins])

  useEffect(() => {
    localStorage.setItem('ge_comm_results', JSON.stringify(results))
  }, [results])

  useEffect(() => {
    localStorage.setItem('ge_comm_regulations', JSON.stringify(regulations))
  }, [regulations])

  // Notice Actions
  const addNotice = (noticeData: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setNotices((prev) => [newNotice, ...prev])
    toast.success('Aviso criado com sucesso!')
  }

  const updateNotice = (id: string, noticeData: Partial<Omit<Notice, 'id' | 'createdAt'>>) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id ? { ...notice, ...noticeData } : notice
      )
    )
    toast.success('Aviso atualizado com sucesso!')
  }

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
    toast.success('Aviso removido.')
  }

  // Bulletin Actions
  const addBulletin = (bulletinData: Omit<Bulletin, 'id' | 'createdAt'>) => {
    const newBulletin: Bulletin = {
      ...bulletinData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setBulletins((prev) => [newBulletin, ...prev])
    toast.success('Boletim publicado com sucesso!')
  }

  const updateBulletin = (id: string, bulletinData: Partial<Omit<Bulletin, 'id' | 'createdAt'>>) => {
    setBulletins((prev) =>
      prev.map((bulletin) =>
        bulletin.id === id ? { ...bulletin, ...bulletinData } : bulletin
      )
    )
    toast.success('Boletim atualizado com sucesso!')
  }

  const deleteBulletin = (id: string) => {
    setBulletins((prev) => prev.filter((b) => b.id !== id))
    toast.success('Boletim removido.')
  }

  // Result Actions
  const addResult = (resultData: Omit<Result, 'id' | 'createdAt'>) => {
    const newResult: Result = {
      ...resultData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setResults((prev) => [newResult, ...prev])
    toast.success('Resultado publicado com sucesso!')
  }

  const updateResult = (id: string, resultData: Partial<Omit<Result, 'id' | 'createdAt'>>) => {
    setResults((prev) =>
      prev.map((result) =>
        result.id === id ? { ...result, ...resultData } : result
      )
    )
    toast.success('Resultado atualizado com sucesso!')
  }

  const deleteResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id))
    toast.success('Categoria removida dos resultados.')
  }

  // Regulation Actions
  const addRegulation = (regulationData: Omit<Regulation, 'id' | 'createdAt'>) => {
    const newRegulation: Regulation = {
      ...regulationData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setRegulations((prev) => [newRegulation, ...prev])
    toast.success('Regulamento publicado com sucesso!')
  }

  const updateRegulation = (id: string, regulationData: Partial<Omit<Regulation, 'id' | 'createdAt'>>) => {
    setRegulations((prev) =>
      prev.map((regulation) =>
        regulation.id === id ? { ...regulation, ...regulationData } : regulation
      )
    )
    toast.success('Regulamento atualizado com sucesso!')
  }

  const deleteRegulation = (id: string) => {
    setRegulations((prev) => prev.filter((r) => r.id !== id))
    toast.success('Regulamento removido.')
  }

  return React.createElement(
    CommunicationContext.Provider,
    {
      value: {
        notices,
        bulletins,
        results,
        regulations,
        addNotice,
        updateNotice,
        deleteNotice,
        addBulletin,
        updateBulletin,
        deleteBulletin,
        addResult,
        updateResult,
        deleteResult,
        addRegulation,
        updateRegulation,
        deleteRegulation,
      },
    },
    children,
  )
}

export function useCommunication() {
  const context = useContext(CommunicationContext)
  if (context === undefined) {
    throw new Error(
      'useCommunication must be used within a CommunicationProvider',
    )
  }
  return context
}
