import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { INITIAL_MODALITIES } from '@/backend/banco/modalidades'

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

// Initial Mock Data moved to src/banco/modalidades.ts

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
  const [modalities, setModalities] = useState<Modality[]>(INITIAL_MODALITIES as unknown as Modality[])

  useEffect(() => {
    const stored = localStorage.getItem('ge_modalities_v2') // Changed Key
    if (stored) {
      try {
        setModalities(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load modalities from storage', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ge_modalities_v2', JSON.stringify(modalities)) // Changed Key
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
