'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Modality {
    id: string
    name: string
    category: string // Categoria de idade/peso etc? O original usa 'category' e 'eventCategory', confuso.
    gender: 'M' | 'F' | 'Misto' | string
    type?: string // 'Coletivo' | 'Individual'
    eventCategory?: string // Pode ser duplicado? Vamos manter.
    minAge?: number
    maxAge?: number
    minAthletes?: number
    maxAthletes?: number
    maxTeams?: number
    maxEventsPerAthlete?: number
}

interface ModalityContextType {
    modalities: Modality[]
    isLoading: boolean
    createModality: (modality: Omit<Modality, 'id'>) => Promise<void>
    updateModality: (id: string, modality: Partial<Modality>) => Promise<void>
    deleteModality: (id: string) => Promise<void>
    refreshModalities: () => Promise<void>
}

const ModalityContext = createContext<ModalityContextType | undefined>(undefined)

export function ModalityProvider({ children }: { children: ReactNode }) {
    const [modalities, setModalities] = useState<Modality[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadModalities = async () => {
        setIsLoading(true)
        try {
            const stored = localStorage.getItem('ge_modalities')
            if (stored) {
                setModalities(JSON.parse(stored))
            }
        } catch (error) {
            console.error('Erro ao carregar modalidades:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const saveModalities = (updated: Modality[]) => {
        try {
            localStorage.setItem('ge_modalities', JSON.stringify(updated))
            setModalities(updated)
        } catch (error) {
            console.error('Erro ao salvar modalidades:', error)
        }
    }

    useEffect(() => {
        loadModalities()
    }, [])

    const createModality = async (data: Omit<Modality, 'id'>) => {
        const newModality: Modality = { ...data, id: Date.now().toString() }
        saveModalities([...modalities, newModality])
    }

    const updateModality = async (id: string, data: Partial<Modality>) => {
        const updated = modalities.map(m => m.id === id ? { ...m, ...data } : m)
        saveModalities(updated)
    }

    const deleteModality = async (id: string) => {
        saveModalities(modalities.filter(m => m.id !== id))
    }

    const refreshModalities = async () => {
        await loadModalities()
    }

    return (
        <ModalityContext.Provider
            value={{
                modalities,
                isLoading,
                createModality,
                updateModality,
                deleteModality,
                refreshModalities,
            }}
        >
            {children}
        </ModalityContext.Provider>
    )
}

export function useModality() {
    const context = useContext(ModalityContext)
    if (context === undefined) {
        throw new Error('useModality must be used within a ModalityProvider')
    }
    return context
}
