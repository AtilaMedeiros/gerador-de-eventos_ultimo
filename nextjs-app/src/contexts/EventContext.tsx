'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

import { Event } from '@/types/event'
import { mockEvents } from '@/mocks/events'

export type { Event }

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


export function EventProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([])
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [eventModalities, setEventModalitiesState] = useState<Record<string, string[]>>({})

    // Carregar eventos do localStorage
    const loadEvents = async () => {
        setIsLoading(true)
        try {
            const storedEvents = localStorage.getItem('ge_events_v3')
            if (storedEvents) {
                const parsed = JSON.parse(storedEvents)
                // Ensure dates are Date objects if needed, but keeping as string is safer for JSON serialization
                setEvents(parsed)
            } else {
                setEvents(mockEvents) // Fallback for demo
            }

            const storedAssociations = localStorage.getItem('ge_event_modalities_v2')
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
            localStorage.setItem('ge_events_v3', JSON.stringify(events))
        }
    }, [events, isLoading])

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('ge_event_modalities_v2', JSON.stringify(eventModalities))
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
