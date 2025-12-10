'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Tipos
export interface Event {
    id: string
    name: string
    slug: string
    description: string
    startDate: string
    endDate: string
    location: string
    logo?: string
    // Adicionar outros campos conforme necessário
}

interface EventContextType {
    events: Event[]
    selectedEvent: Event | null
    isLoading: boolean
    createEvent: (event: Omit<Event, 'id'>) => Promise<void>
    updateEvent: (id: string, event: Partial<Event>) => Promise<void>
    deleteEvent: (id: string) => Promise<void>
    selectEvent: (id: string) => void
    refreshEvents: () => Promise<void>
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Carregar eventos do localStorage
    const loadEvents = async () => {
        setIsLoading(true)
        try {
            const storedEvents = localStorage.getItem('ge_events')
            if (storedEvents) {
                setEvents(JSON.parse(storedEvents))
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Salvar eventos no localStorage
    const saveEvents = (updatedEvents: Event[]) => {
        try {
            localStorage.setItem('ge_events', JSON.stringify(updatedEvents))
            setEvents(updatedEvents)
        } catch (error) {
            console.error('Erro ao salvar eventos:', error)
        }
    }

    useEffect(() => {
        loadEvents()
    }, [])

    const createEvent = async (eventData: Omit<Event, 'id'>) => {
        const newEvent: Event = {
            ...eventData,
            id: Date.now().toString(),
        }
        const updatedEvents = [...events, newEvent]
        saveEvents(updatedEvents)
    }

    const updateEvent = async (id: string, eventData: Partial<Event>) => {
        const updatedEvents = events.map(event =>
            event.id === id ? { ...event, ...eventData } : event
        )
        saveEvents(updatedEvents)

        if (selectedEvent?.id === id) {
            setSelectedEvent({ ...selectedEvent, ...eventData })
        }
    }

    const deleteEvent = async (id: string) => {
        const updatedEvents = events.filter(event => event.id !== id)
        saveEvents(updatedEvents)

        if (selectedEvent?.id === id) {
            setSelectedEvent(null)
        }
    }

    const selectEvent = (id: string) => {
        const event = events.find(e => e.id === id)
        setSelectedEvent(event || null)
    }

    const refreshEvents = async () => {
        await loadEvents()
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
                refreshEvents,
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
