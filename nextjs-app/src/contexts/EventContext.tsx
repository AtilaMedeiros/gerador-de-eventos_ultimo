'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

export interface Event {
    id: string
    name: string
    slug?: string // Optional in original but used in next app
    startDate: string | Date // Flexible to handle string from JSON
    endDate: string | Date
    location: string
    registrations?: number
    capacity?: number
    status?: 'published' | 'draft' | 'closed' | string

    // Form fields details
    description?: string
    producerName?: string
    producerDescription?: string

    // Visual Identity
    themeId?: string
    coverImage?: string
    logo?: string

    // Registration dates
    registrationCollectiveStart?: Date | string
    registrationCollectiveEnd?: Date | string
    registrationIndividualStart?: Date | string
    registrationIndividualEnd?: Date | string

    // Partner Logos
    realizerLogos?: string[]
    supporterLogos?: string[]

    // Times
    startTime?: string
    endTime?: string
}

interface EventContextType {
    events: Event[]
    selectedEvent: Event | null
    isLoading: boolean
    createEvent: (event: Omit<Event, 'id'>) => Promise<Event>
    updateEvent: (id: string, event: Partial<Event>) => Promise<void>
    deleteEvent: (id: string) => Promise<void>
    selectEvent: (id: string) => void
    getEventById: (id: string) => Event | undefined
    refreshEvents: () => Promise<void>
    getEventModalities: (eventId: string) => string[]
    setEventModalities: (eventId: string, modalityIds: string[]) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

const INITIAL_EVENTS: Event[] = [
    {
        id: '1',
        name: 'Tech Summit 2025',
        startDate: new Date('2025-10-15T09:00:00'),
        endDate: new Date('2025-10-17T18:00:00'),
        startTime: '09:00',
        endTime: '18:00',
        location: 'Centro de Convenções',
        registrations: 850,
        capacity: 1000,
        status: 'published',
        description: 'O maior evento de tecnologia da região.',
        producerName: 'Tech Events',
        themeId: 'default',
        registrationCollectiveStart: new Date('2025-09-01T00:00:00'),
        registrationCollectiveEnd: new Date('2025-10-10T23:59:00'),
        registrationIndividualStart: new Date('2025-09-15T00:00:00'),
        registrationIndividualEnd: new Date('2025-10-14T23:59:00'),
    },
]

export function EventProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [eventModalities, setEventModalitiesState] = useState<Record<string, string[]>>({})

    // Carregar eventos do localStorage
    const loadEvents = async () => {
        setIsLoading(true)
        try {
            const storedEvents = localStorage.getItem('ge_events')
            if (storedEvents) {
                const parsed = JSON.parse(storedEvents)
                // Ensure dates are Date objects if needed, but keeping as string is safer for JSON serialization
                setEvents(parsed)
            } else {
                setEvents(INITIAL_EVENTS) // Fallback for demo
            }

            const storedAssociations = localStorage.getItem('ge_event_modalities')
            if (storedAssociations) {
                setEventModalitiesState(JSON.parse(storedAssociations))
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Salvar eventos no localStorage
    useEffect(() => {
        if (!isLoading && events.length > 0) {
            localStorage.setItem('ge_events', JSON.stringify(events))
        }
    }, [events, isLoading])

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('ge_event_modalities', JSON.stringify(eventModalities))
        }
    }, [eventModalities, isLoading])


    useEffect(() => {
        loadEvents()
    }, [])

    const createEvent = async (eventData: Omit<Event, 'id'>) => {
        const newEvent: Event = {
            ...eventData,
            id: Date.now().toString(),
        }
        setEvents(prev => [newEvent, ...prev])
        toast.success('Evento criado com sucesso!')
        return newEvent
    }

    const updateEvent = async (id: string, eventData: Partial<Event>) => {
        setEvents(prev =>
            prev.map(event =>
                event.id === id ? { ...event, ...eventData } : event
            )
        )

        if (selectedEvent?.id === id) {
            setSelectedEvent(prev => prev ? { ...prev, ...eventData } : null)
        }
        toast.success('Evento atualizado com sucesso!')
    }

    const deleteEvent = async (id: string) => {
        setEvents(prev => prev.filter(event => event.id !== id))
        if (selectedEvent?.id === id) {
            setSelectedEvent(null)
        }
        toast.success('Evento excluído com sucesso!')
    }

    const selectEvent = (id: string) => {
        const event = events.find(e => e.id === id)
        setSelectedEvent(event || null)
    }

    const refreshEvents = async () => {
        await loadEvents()
    }

    const getEventById = (id: string) => {
        return events.find(e => e.id === id)
    }

    const getEventModalities = (eventId: string) => {
        return eventModalities[eventId] || []
    }

    const setEventModalities = (eventId: string, modalityIds: string[]) => {
        setEventModalitiesState(prev => ({
            ...prev,
            [eventId]: modalityIds
        }))
    }

    return (
        <EventContext.Provider
            value={{
                events,
                selectedEvent,
                isLoading,
                createEvent,
                updateEvent,
                deleteEvent,
                selectEvent,
                getEventById,
                refreshEvents,
                getEventModalities,
                setEventModalities,
            }}
        >
            {children}
        </EventContext.Provider>
    )
}

export function useEvent() {
    const context = useContext(EventContext)
    if (context === undefined) {
        throw new Error('useEvent must be used within an EventProvider')
    }
    return context
}
