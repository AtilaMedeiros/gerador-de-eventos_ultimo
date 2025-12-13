import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useEvent } from './EventContext'
import { toast } from 'sonner'
import { MOCK_SCHOOL } from '@/backend/banco/escolas'
import { MOCK_ATHLETES_SEED } from '@/backend/banco/atletas'
import { MOCK_TECHNICIANS_SEED } from '@/backend/banco/tecnicos'
import { MOCK_INSCRIPTIONS_SEED } from '@/backend/banco/inscricoes'

export interface School {
  id: string
  name: string
  inep: string
  cnpj: string
  municipality: string
  address: string
  neighborhood: string
  cep: string
  type: 'Publica' | 'Privada'
  sphere: 'Municipal' | 'Estadual' | 'Federal'
  directorName: string
  landline: string
  mobile: string
  email: string
}

export interface Athlete {
  id: string
  schoolId: string
  name: string
  sex: 'Feminino' | 'Masculino'
  dob: Date
  rg?: string
  cpf: string
  nis?: string
  motherName: string
  motherCpf: string
}

export interface Technician {
  id: string
  schoolId: string
  name: string
  sex: 'Feminino' | 'Masculino'
  dob: Date
  cpf: string
  cref?: string
  email: string
  phone: string
}

export interface Inscription {
  id: string
  schoolId: string
  athleteId: string
  eventId: string
  modalityId: string
  categoryId?: string // For tracking specific category if needed
  status: 'Pendente' | 'Confirmada'
}

interface ParticipantContextType {
  school: School | null
  updateSchool: (data: Partial<School>) => void
  athletes: Athlete[]
  addAthlete: (data: Omit<Athlete, 'id' | 'schoolId'>) => void
  updateAthlete: (id: string, data: Partial<Athlete>) => void
  deleteAthlete: (id: string) => void
  technicians: Technician[]
  addTechnician: (data: Omit<Technician, 'id' | 'schoolId'>) => void
  updateTechnician: (id: string, data: Partial<Technician>) => void
  deleteTechnician: (id: string) => void
  inscriptions: Inscription[]
  addInscription: (
    data: Omit<Inscription, 'id' | 'schoolId' | 'status'>,
  ) => void
  deleteInscription: (id: string) => void
  selectedEventId: string
  selectEvent: (id: string) => void
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(
  undefined,
)

// MOCK_SCHOOL moved to src/banco/escolas.ts

// MOCK_ATHLETES_SEED moved to src/banco/atletas.ts

// MOCK_TECHNICIANS_SEED moved to src/banco/tecnicos.ts

// MOCK_INSCRIPTIONS_SEED moved to src/banco/inscricoes.ts

export function ParticipantProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const [school, setSchool] = useState<School | null>(null)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])

  // Load data based on logged user
  useEffect(() => {
    if (
      user &&
      (user.role === 'school_admin' ||
        user.role === 'technician' ||
        user.role === 'producer' ||
        user.role === 'admin')
    ) {
      // In a real app, fetch from API using user.schoolId
      // For mock, we use local storage or defaults
      const storedSchool = localStorage.getItem('ge_school_data')
      if (storedSchool) {
        setSchool(JSON.parse(storedSchool))
      } else {
        setSchool(MOCK_SCHOOL as unknown as School)
      }

      const storedAthletes = localStorage.getItem('ge_athletes')
      if (storedAthletes) {
        const parsed = JSON.parse(storedAthletes)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAthletes(
            parsed.map((a: any) => ({
              ...a,
              dob: new Date(a.dob),
            })),
          )
        } else {
          setAthletes(MOCK_ATHLETES_SEED as unknown as Athlete[])
        }
      } else {
        setAthletes(MOCK_ATHLETES_SEED as unknown as Athlete[])
      }

      const storedTechs = localStorage.getItem('ge_technicians')
      if (storedTechs) {
        const parsed = JSON.parse(storedTechs)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTechnicians(
            parsed.map((t: any) => ({
              ...t,
              dob: new Date(t.dob),
            })),
          )
        } else {
          setTechnicians(MOCK_TECHNICIANS_SEED as unknown as Technician[])
        }
      } else {
        setTechnicians(MOCK_TECHNICIANS_SEED as unknown as Technician[])
      }

      const storedInscriptions = localStorage.getItem('ge_inscriptions')
      if (storedInscriptions) {
        const parsed = JSON.parse(storedInscriptions)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInscriptions(parsed)
        } else {
          setInscriptions(MOCK_INSCRIPTIONS_SEED as unknown as Inscription[])
        }
      } else {
        setInscriptions(MOCK_INSCRIPTIONS_SEED as unknown as Inscription[])
      }
    } else {
      setSchool(null)
      setAthletes([])
      setTechnicians([])
      setInscriptions([])
    }
  }, [user])

  // Persist School
  useEffect(() => {
    if (school) localStorage.setItem('ge_school_data', JSON.stringify(school))
  }, [school])

  // Persist Athletes
  useEffect(() => {
    localStorage.setItem('ge_athletes', JSON.stringify(athletes))
  }, [athletes])

  // Persist Technicians
  useEffect(() => {
    localStorage.setItem('ge_technicians', JSON.stringify(technicians))
  }, [technicians])

  // Persist Inscriptions
  useEffect(() => {
    localStorage.setItem('ge_inscriptions', JSON.stringify(inscriptions))
  }, [inscriptions])

  const updateSchool = (data: Partial<School>) => {
    if (!school) return
    setSchool({ ...school, ...data })
    toast.success('Dados da escola atualizados!')
  }

  const addAthlete = (data: Omit<Athlete, 'id' | 'schoolId'>) => {
    if (!school) return
    const newAthlete: Athlete = {
      ...data,
      id: crypto.randomUUID(),
      schoolId: school.id,
    }
    setAthletes((prev) => [...prev, newAthlete])
    toast.success('Atleta cadastrado com sucesso!')
  }

  const updateAthlete = (id: string, data: Partial<Athlete>) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a)),
    )
    toast.success('Atleta atualizado!')
  }

  const deleteAthlete = (id: string) => {
    setAthletes((prev) => prev.filter((a) => a.id !== id))
    // Also remove inscriptions
    setInscriptions((prev) => prev.filter((i) => i.athleteId !== id))
    toast.success('Atleta removido.')
  }

  const addTechnician = (data: Omit<Technician, 'id' | 'schoolId'>) => {
    if (!school) return
    const newTech: Technician = {
      ...data,
      id: crypto.randomUUID(),
      schoolId: school.id,
    }
    setTechnicians((prev) => [...prev, newTech])
    toast.success('Técnico cadastrado com sucesso!')
  }

  const updateTechnician = (id: string, data: Partial<Technician>) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
    )
    toast.success('Técnico atualizado!')
  }

  const deleteTechnician = (id: string) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id))
    toast.success('Técnico removido.')
  }

  const addInscription = (
    data: Omit<Inscription, 'id' | 'schoolId' | 'status'>,
  ) => {
    if (!school) return
    const newInscription: Inscription = {
      ...data,
      id: crypto.randomUUID(),
      schoolId: school.id,
      status: 'Confirmada', // Auto-confirm for mock
    }
    setInscriptions((prev) => [...prev, newInscription])
    toast.success('Inscrição realizada com sucesso!')
  }

  const deleteInscription = (id: string) => {
    setInscriptions((prev) => prev.filter((i) => i.id !== id))
    toast.success('Inscrição cancelada.')
  }

  // Selected Event State
  const [selectedEventId, setSelectedEventId] = useState<string>('')

  // Initialize Selected Event
  const { events } = useEvent()
  useEffect(() => {
    const stored = localStorage.getItem('ge_selected_event_id')
    if (stored && events.some(e => e.id === stored)) {
      setSelectedEventId(stored)
    } else if (events.length > 0) {
      setSelectedEventId(events[0].id)
    }
  }, [events])

  const selectEvent = (id: string) => {
    setSelectedEventId(id)
    localStorage.setItem('ge_selected_event_id', id)
    toast.info('Evento selecionado alterado.')
  }

  return React.createElement(
    ParticipantContext.Provider,
    {
      value: {
        school,
        updateSchool,
        athletes,
        addAthlete,
        updateAthlete,
        deleteAthlete,
        technicians,
        addTechnician,
        updateTechnician,
        deleteTechnician,
        inscriptions,
        addInscription,
        deleteInscription,
        selectedEventId,
        selectEvent,
      },
    },
    children,
  )
}

export function useParticipant() {
  const context = useContext(ParticipantContext)
  if (context === undefined) {
    throw new Error('useParticipant must be used within a ParticipantProvider')
  }
  return context
}

