import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

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

  // Times
  startTime?: string
  endTime?: string
}

// Initial Mock Data
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
  {
    id: '2',
    name: 'Maratona Escolar de Verão',
    startDate: new Date('2025-11-22T08:00:00'),
    endDate: new Date('2025-11-22T16:00:00'),
    startTime: '08:00',
    endTime: '16:00',
    location: 'Ginásio Municipal',
    registrations: 120,
    capacity: 500,
    status: 'draft',
    description: 'Competição escolar anual.',
    producerName: 'Secretaria de Esportes',
    themeId: 'summer-2025',
    registrationCollectiveStart: new Date('2025-11-01T00:00:00'),
    registrationCollectiveEnd: new Date('2025-11-20T23:59:00'),
  },
  {
    id: '3',
    name: 'Torneio de Robótica',
    startDate: new Date('2025-12-05T10:00:00'),
    endDate: new Date('2025-12-08T20:00:00'),
    startTime: '10:00',
    endTime: '20:00',
    location: 'Auditório Central',
    registrations: 300,
    capacity: 300,
    status: 'closed',
    description: 'Torneio de robótica para ensino médio.',
    producerName: 'RoboEdu',
  },
]

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
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS)
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
        setEvents(restored)
      } catch (e) {
        console.error('Failed to load events from storage', e)
      }
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
