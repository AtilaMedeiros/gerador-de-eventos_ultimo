'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useEvent } from './EventContext'
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
    categoryId?: string
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
]

const MOCK_INSCRIPTIONS_SEED: Inscription[] = [
    {
        id: 'insc-1',
        schoolId: 'school-1',
        athleteId: '1',
        eventId: '1',
        modalityId: '1',
        status: 'Confirmada',
    },
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

    // Load data
    useEffect(() => {
        if (user) {
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
                const parsed = JSON.parse(storedInscriptions)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setInscriptions(parsed)
                } else {
                    setInscriptions(MOCK_INSCRIPTIONS_SEED)
                }
            } else {
                setInscriptions(MOCK_INSCRIPTIONS_SEED)
            }
        } else {
            setSchool(null)
            setAthletes([])
            setTechnicians([])
            setInscriptions([])
        }
    }, [user])

    // Persist
    useEffect(() => {
        if (school) localStorage.setItem('ge_school_data', JSON.stringify(school))
    }, [school])

    useEffect(() => {
        localStorage.setItem('ge_athletes', JSON.stringify(athletes))
    }, [athletes])

    useEffect(() => {
        localStorage.setItem('ge_technicians', JSON.stringify(technicians))
    }, [technicians])

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
            status: 'Confirmada',
        }
        setInscriptions((prev) => [...prev, newInscription])
        toast.success('Inscrição realizada com sucesso!')
    }

    const deleteInscription = (id: string) => {
        setInscriptions((prev) => prev.filter((i) => i.id !== id))
        toast.success('Inscrição cancelada.')
    }

    const [selectedEventId, setSelectedEventId] = useState<string>('')

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

    return (
        <ParticipantContext.Provider
            value={{
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
            }}
        >
            {children}
        </ParticipantContext.Provider>
    )
}

export function useParticipant() {
    const context = useContext(ParticipantContext)
    if (context === undefined) {
        throw new Error('useParticipant must be used within a ParticipantProvider')
    }
    return context
}
