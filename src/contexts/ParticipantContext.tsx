import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useEvent } from './EventContext'
import { toast } from 'sonner'
import { MOCK_SCHOOL } from '@/backend/banco/escolas'
import { MOCK_ATHLETES_SEED } from '@/backend/banco/atletas'
import { MOCK_INSCRIPTIONS_SEED } from '@/backend/banco/inscricoes'
import { getStoredUsers, saveUser, deleteUser, type User } from '@/backend/banco/usuarios'

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
  eventIds?: string[]
}

export interface Athlete {
  id: string
  schoolId: string
  eventId: string
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
  addAthlete: (data: Omit<Athlete, 'id' | 'schoolId' | 'eventId'> & { eventId?: string }) => void
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
      ((user.role as string) === 'school_admin' ||
        (user.role as string) === 'technician' ||
        user.role === 'participant' ||
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
              eventId: a.eventId || '1', // Migration for legacy data
            })),
          )
        } else {
          setAthletes(MOCK_ATHLETES_SEED as unknown as Athlete[])
        }
      } else {
        // Only load Mocks if we really want them globally, but usually mocks should be tied to a mock school.
        // If we want a clean state for a new school, we shouldn't force mocks unless the school IS the mock school.
        // But for development, mocks appear.
        // Better: Filter mocks to match the current school IF we know it.
        // For now, let's keep loading them, but ensure UI filters them.
        setAthletes(MOCK_ATHLETES_SEED as unknown as Athlete[])
      }

      const allUsers = getStoredUsers()

      // We need to robustly filter. Let's assume for this specific requirement "participants in usuarios" means anyone with role='participant' 
      // AND we should probably filter by school if we are logged in as a school, but for simplicity let's load all 'participant' users that look like technicians.
      // Actually, let's just load all users with role 'participant' effectively.

      const mappedTechnicians: Technician[] = allUsers
        .filter(u => u.role === 'participant')
        .map(u => ({
          id: u.id,
          schoolId: u.schoolId || '',
          name: u.name,
          email: u.email,
          phone: u.phone || '',
          cpf: u.cpf || '',
          cref: u.cref,
          sex: u.sex || 'Masculino', // Default
          dob: u.dob ? new Date(u.dob) : new Date(), // Default
        }))

      setTechnicians(mappedTechnicians)

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
  // Persist Technicians - NOW HANDLED VIA saveUser directly in actions, but we sync state changes?
  // Actually, we shouldn't save the whole array to 'ge_technicians' anymore. 
  // We should rely on the actions updating 'ge_users'. 
  // But wait, the state 'technicians' is local. If we update it, we should update 'ge_users'.
  // However, updating 'ge_users' is better done atomically in the add/update/delete functions.
  // So we REMOVE this useEffect that blindly saves to 'ge_technicians'


  // Persist Inscriptions
  useEffect(() => {
    localStorage.setItem('ge_inscriptions', JSON.stringify(inscriptions))
  }, [inscriptions])

  const updateSchool = (data: Partial<School>) => {
    if (!school) return
    setSchool({ ...school, ...data })
    toast.success('Dados da escola atualizados!')
  }

  const addAthlete = (data: Omit<Athlete, 'id' | 'schoolId' | 'eventId'> & { eventId?: string, schoolId?: string }) => {
    // Producer mode checks
    const targetSchoolId = data.schoolId || (school ? school.id : null)
    if (!targetSchoolId) {
      toast.error('Escola não identificada.')
      return
    }

    const newAthlete: Athlete = {
      ...data,
      id: crypto.randomUUID(),
      schoolId: targetSchoolId,
      eventId: data.eventId || selectedEventId || '1'
    }

    // Optimistic Update & Immediate Save to avoid race conditions with navigation
    const updatedAthletes = [...athletes, newAthlete]
    setAthletes(updatedAthletes)
    localStorage.setItem('ge_athletes', JSON.stringify(updatedAthletes))

    toast.success('Atleta cadastrado com sucesso!')
  }

  const updateAthlete = (id: string, data: Partial<Athlete>) => {
    const updatedAthletes = athletes.map((a) => (a.id === id ? { ...a, ...data } : a))
    setAthletes(updatedAthletes)
    localStorage.setItem('ge_athletes', JSON.stringify(updatedAthletes))
    toast.success('Atleta atualizado!')
  }

  const deleteAthlete = (id: string) => {
    const updatedAthletes = athletes.filter((a) => a.id !== id)
    setAthletes(updatedAthletes)
    localStorage.setItem('ge_athletes', JSON.stringify(updatedAthletes))

    // Also remove inscriptions
    setInscriptions((prev) => prev.filter((i) => i.athleteId !== id))
    toast.success('Atleta removido.')
  }

  const addTechnician = (data: Omit<Technician, 'id' | 'schoolId'>) => {
    if (!school) return
    const newId = crypto.randomUUID()
    const newTech: Technician = {
      ...data,
      id: newId,
      schoolId: school.id,
    }

    // Save to User store
    const newUser: User = {
      id: newId,
      name: data.name,
      email: data.email,
      role: 'participant',
      schoolId: school.id,
      cpf: data.cpf,
      phone: data.phone,
      cref: data.cref,
      sex: data.sex,
      dob: data.dob.toISOString().split('T')[0], // Save as YYYY-MM-DD string
      status: 'active'
    }
    saveUser(newUser)

    setTechnicians((prev) => [...prev, newTech])
    toast.success('Técnico cadastrado com sucesso!')
  }

  const updateTechnician = (id: string, data: Partial<Technician>) => {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...data }

          // Helper to find existing user to preserve other fields
          const allUsers = getStoredUsers()
          const existingUser = allUsers.find(u => u.id === id)

          if (existingUser) {
            const updatedUser: User = {
              ...existingUser,
              name: updated.name,
              email: updated.email,
              cpf: updated.cpf,
              phone: updated.phone,
              cref: updated.cref,
              sex: updated.sex,
              dob: updated.dob ? updated.dob.toISOString().split('T')[0] : existingUser.dob,
            }
            saveUser(updatedUser)
          }

          return updated
        }
        return t
      }),
    )
    toast.success('Técnico atualizado!')
  }

  const deleteTechnician = (id: string) => {
    setTechnicians((prev) => prev.filter((t) => t.id !== id))
    deleteUser(id)
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

