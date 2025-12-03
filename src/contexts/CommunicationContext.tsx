import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

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
  categoryName: string
  champion: string
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
  deleteNotice: (id: string) => void
  addBulletin: (bulletin: Omit<Bulletin, 'id' | 'createdAt'>) => void
  deleteBulletin: (id: string) => void
  addResult: (result: Omit<Result, 'id'>) => void
  updateResult: (id: string, result: Partial<Result>) => void
  deleteResult: (id: string) => void
  addRegulation: (regulation: Omit<Regulation, 'id' | 'createdAt'>) => void
  deleteRegulation: (id: string) => void
}

const CommunicationContext = createContext<
  CommunicationContextType | undefined
>(undefined)

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
        if (storedNotices) {
          setNotices(
            JSON.parse(storedNotices).map((n: any) => ({
              ...n,
              date: new Date(n.date),
              createdAt: new Date(n.createdAt),
            })),
          )
        }

        const storedBulletins = localStorage.getItem('ge_comm_bulletins')
        if (storedBulletins) {
          setBulletins(
            JSON.parse(storedBulletins).map((b: any) => ({
              ...b,
              date: new Date(b.date),
              createdAt: new Date(b.createdAt),
            })),
          )
        }

        const storedResults = localStorage.getItem('ge_comm_results')
        if (storedResults) {
          setResults(JSON.parse(storedResults))
        }

        const storedRegulations = localStorage.getItem('ge_comm_regulations')
        if (storedRegulations) {
          setRegulations(
            JSON.parse(storedRegulations).map((r: any) => ({
              ...r,
              date: new Date(r.date),
              createdAt: new Date(r.createdAt),
            })),
          )
        }
      } catch (e) {
        console.error('Failed to load communication data', e)
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
  const addNotice = (data: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setNotices((prev) => [newNotice, ...prev])
    toast.success('Aviso publicado com sucesso!')
  }

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
    toast.success('Aviso removido.')
  }

  // Bulletin Actions
  const addBulletin = (data: Omit<Bulletin, 'id' | 'createdAt'>) => {
    const newBulletin: Bulletin = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setBulletins((prev) => [newBulletin, ...prev])
    toast.success('Boletim publicado com sucesso!')
  }

  const deleteBulletin = (id: string) => {
    setBulletins((prev) => prev.filter((b) => b.id !== id))
    toast.success('Boletim removido.')
  }

  // Result Actions
  const addResult = (data: Omit<Result, 'id'>) => {
    const newResult: Result = {
      ...data,
      id: crypto.randomUUID(),
    }
    setResults((prev) => [...prev, newResult])
    toast.success('Categoria adicionada aos resultados.')
  }

  const updateResult = (id: string, data: Partial<Result>) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))
    // Toast handled in component typically, or here if generic
  }

  const deleteResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id))
    toast.success('Categoria removida dos resultados.')
  }

  // Regulation Actions
  const addRegulation = (data: Omit<Regulation, 'id' | 'createdAt'>) => {
    const newRegulation: Regulation = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setRegulations((prev) => [newRegulation, ...prev])
    toast.success('Regulamento publicado com sucesso!')
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
        deleteNotice,
        addBulletin,
        deleteBulletin,
        addResult,
        updateResult,
        deleteResult,
        addRegulation,
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
