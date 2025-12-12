import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { INITIAL_EVENTS } from '@/banco/eventos'

export interface Event {
  id: string
  name: string
  startDate: Date
  endDate: Date
  location: string
  registrations: number
  capacity: number
  status: string

  // Form fields details
  description?: string
  producerName?: string
  producerDescription?: string

  // Visual Identity
  themeId?: string
  coverImage?: string

  // Registration dates
  registrationCollectiveStart?: Date
  registrationCollectiveEnd?: Date
  registrationIndividualStart?: Date
  registrationIndividualEnd?: Date

  // Partner Logos
  realizerLogos?: string[]
  supporterLogos?: string[]

  // Times
  startTime?: string
  endTime?: string
}

// Initial Mock Data moved to src/banco/eventos.ts

interface EventContextType {
  events: Event[]
  addEvent: (event, suppressToast?: boolean) => Event
  updateEvent: (id: string, event: Partial<Event>, suppressToast?: boolean) => void
  deleteEvent: (id: string) => void
  getEventById: (id: string) => Event | undefined
  getEventModalities: (eventId: string) => string[]
  setEventModalities: (eventId: string, modalityIds: string[]) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS as unknown as Event[])
  const [eventModalities, setEventModalitiesState] = useState<
    Record<string, string[]>
  >({})

  useEffect(() => {
    const storedEvents = localStorage.getItem('ge_events')
    if (storedEvents) {
      try {
        const parsed = JSON.parse(storedEvents)
        const restored = parsed.map((ev: any) => ({
          ...ev,
          startDate: new Date(ev.startDate),
          endDate: new Date(ev.endDate),
          registrationCollectiveStart: ev.registrationCollectiveStart
            ? new Date(ev.registrationCollectiveStart)
            : undefined,
          registrationCollectiveEnd: ev.registrationCollectiveEnd
            ? new Date(ev.registrationCollectiveEnd)
            : undefined,
          registrationIndividualStart: ev.registrationIndividualStart
            ? new Date(ev.registrationIndividualStart)
            : undefined,
          registrationIndividualEnd: ev.registrationIndividualEnd
            ? new Date(ev.registrationIndividualEnd)
            : undefined,
        }))

        // Merge INITIAL_EVENTS to ensure new mocks (like IDs 4, 5, 6) appear even if localStorage exists
        const restoredIds = new Set(restored.map(e => e.id))
        const missingMocks = INITIAL_EVENTS.filter(mock => !restoredIds.has(mock.id)) as unknown as Event[]

        if (missingMocks.length > 0) {
          const merged = [...restored, ...missingMocks]
          setEvents(merged)
        } else {
          setEvents(restored)
        }
      } catch (error) {
        console.error('Falha ao carregar eventos:', error)
        setEvents(INITIAL_EVENTS as unknown as Event[])
      }
    } else {
      // If no storage, verify we have defaults (state init handles this, but explicit set ensures consistency)
      setEvents(INITIAL_EVENTS as unknown as Event[])
    }
    const storedAssociations = localStorage.getItem('ge_event_modalities')
    if (storedAssociations) {
      try {
        setEventModalitiesState(JSON.parse(storedAssociations))
      } catch (e) {
        console.error('Failed to load event modalities from storage', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ge_events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('ge_event_modalities', JSON.stringify(eventModalities))
  }, [eventModalities])

  const addEvent = (eventData: Omit<Event, 'id'>, suppressToast = false) => {
    const newEvent: Event = {
      ...eventData,
      id: crypto.randomUUID(),
    }
    setEvents((prev) => [newEvent, ...prev])
    if (!suppressToast) toast.success('Evento criado com sucesso!')
    return newEvent
  }

  const updateEvent = (
    id: string,
    eventData: Partial<Event>,
    suppressToast = false,
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...eventData } : event,
      ),
    )
    if (!suppressToast) toast.success('Evento atualizado com sucesso!')
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
    toast.success('Evento excluído com sucesso!')
  }

  const getEventById = (id: string) => {
    return events.find((event) => event.id === id)
  }

  const getEventModalities = (eventId: string) => {
    return eventModalities[eventId] || []
  }

  const setEventModalities = (eventId: string, modalityIds: string[]) => {
    setEventModalitiesState((prev) => ({
      ...prev,
      [eventId]: modalityIds,
    }))
  }

  return React.createElement(
    EventContext.Provider,
    {
      value: {
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        getEventModalities,
        setEventModalities,
      },
    },
    children,
  )
}

export function useEvent() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return context
}
