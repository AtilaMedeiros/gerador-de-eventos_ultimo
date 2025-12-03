import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

export interface Modality {
  id: string
  name: string
  type: 'coletiva' | 'individual'
  gender: 'feminino' | 'masculino' | 'misto'
  eventCategory?: string
  minAthletes: number
  maxAthletes: number
  maxEventsPerAthlete: number
  maxTeams: number
  minAge: number
  maxAge: number
}

const INITIAL_MODALITIES: Modality[] = [
  {
    id: '1',
    name: 'Futsal',
    type: 'coletiva',
    gender: 'masculino',
    minAthletes: 5,
    maxAthletes: 12,
    maxEventsPerAthlete: 1,
    maxTeams: 16,
    minAge: 14,
    maxAge: 17,
  },
  {
    id: '2',
    name: 'Natação 50m Livre',
    type: 'individual',
    gender: 'feminino',
    eventCategory: '50m Livre',
    minAthletes: 1,
    maxAthletes: 1,
    maxEventsPerAthlete: 3,
    maxTeams: 0,
    minAge: 10,
    maxAge: 12,
  },
  {
    id: '3',
    name: 'Vôlei Misto',
    type: 'coletiva',
    gender: 'misto',
    minAthletes: 6,
    maxAthletes: 14,
    maxEventsPerAthlete: 1,
    maxTeams: 8,
    minAge: 16,
    maxAge: 99,
  },
]

interface ModalityContextType {
  modalities: Modality[]
  addModality: (modality: Omit<Modality, 'id'>) => void
  updateModality: (id: string, modality: Partial<Modality>) => void
  deleteModality: (id: string) => void
  getModalityById: (id: string) => Modality | undefined
}

const ModalityContext = createContext<ModalityContextType | undefined>(
  undefined,
)

export function ModalityProvider({ children }: { children: React.ReactNode }) {
  const [modalities, setModalities] = useState<Modality[]>(INITIAL_MODALITIES)

  useEffect(() => {
    const stored = localStorage.getItem('ge_modalities')
    if (stored) {
      try {
        setModalities(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load modalities from storage', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ge_modalities', JSON.stringify(modalities))
  }, [modalities])

  const addModality = (modalityData: Omit<Modality, 'id'>) => {
    const newModality: Modality = {
      ...modalityData,
      id: crypto.randomUUID(),
    }
    setModalities((prev) => [newModality, ...prev])
    toast.success('Modalidade criada com sucesso!')
  }

  const updateModality = (id: string, modalityData: Partial<Modality>) => {
    setModalities((prev) =>
      prev.map((mod) => (mod.id === id ? { ...mod, ...modalityData } : mod)),
    )
    toast.success('Modalidade atualizada com sucesso!')
  }

  const deleteModality = (id: string) => {
    setModalities((prev) => prev.filter((mod) => mod.id !== id))
    toast.success('Modalidade excluída com sucesso!')
  }

  const getModalityById = (id: string) => {
    return modalities.find((mod) => mod.id === id)
  }

  return React.createElement(
    ModalityContext.Provider,
    {
      value: {
        modalities,
        addModality,
        updateModality,
        deleteModality,
        getModalityById,
      },
    },
    children,
  )
}

export function useModality() {
  const context = useContext(ModalityContext)
  if (context === undefined) {
    throw new Error('useModality must be used within a ModalityProvider')
  }
  return context
}
