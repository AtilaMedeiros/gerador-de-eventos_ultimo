import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'

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
}

const ParticipantContext = createContext<ParticipantContextType | undefined>(
  undefined,
)

const MOCK_SCHOOL: School = {
  id: 'school-1',
  name: 'Escola Municipal Exemplo',
  inep: '12345678',
  cnpj: '00.000.000/0000-00',
  municipality: 'Fortaleza',
  address: 'Rua das Flores, 123',
  neighborhood: 'Centro',
  cep: '60000-000',
  type: 'Publica',
  sphere: 'Municipal',
  directorName: 'Maria Diretora',
  landline: '(85) 3222-2222',
  mobile: '(85) 99999-9999',
  email: 'escola@exemplo.com',
}

const MOCK_ATHLETES_SEED: Athlete[] = [
  {
    id: '1',
    name: 'Lucas Pereira',
    sex: 'Masculino',
    dob: new Date('2008-05-15T12:00:00'),
    cpf: '123.456.789-00',
    schoolId: 'school-1',
    motherName: 'Maria Pereira',
    motherCpf: '987.654.321-00',
    rg: '12345678'
  },
  {
    id: '2',
    name: 'Beatriz Costa',
    sex: 'Feminino',
    dob: new Date('2010-08-20T12:00:00'),
    cpf: '987.654.321-00',
    schoolId: 'school-1',
    motherName: 'Ana Costa',
    motherCpf: '111.222.333-44',
    rg: '87654321'
  },
  {
    id: '3',
    name: 'Gabriel Almeida',
    sex: 'Masculino',
    dob: new Date('2005-01-10T12:00:00'),
    cpf: '111.222.333-44',
    schoolId: 'school-1',
    motherName: 'Carla Almeida',
    motherCpf: '555.666.777-88',
    rg: '11223344'
  },
  {
    id: '4',
    name: 'Mariana Silva',
    sex: 'Feminino',
    dob: new Date('2008-11-05T12:00:00'),
    cpf: '555.666.777-88',
    schoolId: 'school-1',
    motherName: 'Joana Silva',
    motherCpf: '999.888.777-66',
    rg: '12345678'
  },
  {
    id: '5',
    name: 'João Pedro',
    sex: 'Masculino',
    dob: new Date('2012-03-25T12:00:00'),
    cpf: '999.888.777-66',
    schoolId: 'school-1',
    motherName: 'Pedro Santos',
    motherCpf: '222.333.444-55',
    rg: '55667788'
  }
]

const MOCK_TECHNICIANS_SEED: Technician[] = [
  {
    id: 'tech-1',
    schoolId: 'school-1',
    name: 'Carlos Oliveira',
    sex: 'Masculino',
    dob: new Date('1985-05-10T12:00:00'),
    cpf: '111.111.111-11',
    cref: '123456-G/CE',
    email: 'carlos.oliveira@escola.com',
    phone: '(85) 98888-8888',
  },
  {
    id: 'tech-2',
    schoolId: 'school-1',
    name: 'Fernanda Santos',
    sex: 'Feminino',
    dob: new Date('1990-08-15T12:00:00'),
    cpf: '222.222.222-22',
    cref: '654321-G/CE',
    email: 'fernanda.santos@escola.com',
    phone: '(85) 97777-7777',
  }
]

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
        setSchool(MOCK_SCHOOL)
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
          setAthletes(MOCK_ATHLETES_SEED)
        }
      } else {
        setAthletes(MOCK_ATHLETES_SEED)
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
          setTechnicians(MOCK_TECHNICIANS_SEED)
        }
      } else {
        setTechnicians(MOCK_TECHNICIANS_SEED)
      }

      const storedInscriptions = localStorage.getItem('ge_inscriptions')
      if (storedInscriptions) {
        setInscriptions(JSON.parse(storedInscriptions))
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
