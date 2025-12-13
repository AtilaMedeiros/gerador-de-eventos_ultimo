import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { INITIAL_EVENTS } from '@/backend/banco/eventos'
import { EventService } from '@/backend/services/event.service'

export interface Event {
  id: string
  name: string
  startDate: Date
  endDate: Date
  location: string
  registrations: number
  capacity: number
  adminStatus: 'RASCUNHO' | 'PUBLICADO' | 'DESATIVADO'
  computedTimeStatus?: 'AGENDADO' | 'ATIVO' | 'ENCERRADO'
  status?: string // Deprecated, kept for temporary compat during migration if needed, but preferable to remove. Keeping type loose for now.

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
          // Migration Logic
          adminStatus: (ev.adminStatus === 'CANCELADO' || ev.adminStatus === 'SUSPENSO')
            ? 'DESATIVADO'
            : (ev.adminStatus === 'REABERTO' ? 'PUBLICADO' : (ev.adminStatus || (ev.status === 'published' ? 'PUBLICADO' : ev.status === 'closed' ? 'DESATIVADO' : 'RASCUNHO'))),
          computedTimeStatus: EventService.getTimeStatus(new Date(ev.startDate), new Date(ev.endDate))
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
      // Initialize with mocks, but ensure we compute the status for them too
      const detailedMocks = (INITIAL_EVENTS as unknown as Event[]).map(ev => ({
        ...ev,
        startDate: new Date(ev.startDate),
        endDate: new Date(ev.endDate),
        adminStatus: ev.adminStatus || 'RASCUNHO',
        computedTimeStatus: EventService.getTimeStatus(new Date(ev.startDate), new Date(ev.endDate))
      }))
      setEvents(detailedMocks)
    }
    // Load Initial Modalities Map using Service
    const storedAssociations = EventService.getAllEventModalitiesMap()

    // Auto-link logic for demo purposes (Run once)
    // Auto-link logic for demo purposes (Updated for 8 events with random modalities)
    const hasInitialized = localStorage.getItem('ge_initialized_modalities_v2')

    // We check if we have events loaded (either from restored or initial)
    // The previous block sets 'events' state, but inside this useEffect, 'events' might refer to closure unless we depend on it.
    // However, for initialization we can use INITIAL_EVENTS for IDs reference if we assume a fresh start or just map indices.

    if (!hasInitialized) {
      // IDs of the 8 mock events: '1' to '8'
      const eventIds = ['1', '2', '3', '4', '5', '6', '7', '8']
      // Available Modality IDs: '1' to '10'
      const allModalityIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

      const newMap = { ...storedAssociations } // Start with what we have (usually empty on fresh start)

      eventIds.forEach(eid => {
        // Shuffle and pick 4 to 6
        const shuffled = [...allModalityIds].sort(() => 0.5 - Math.random())
        const count = Math.floor(Math.random() * 3) + 4 // 4, 5, or 6
        const selected = shuffled.slice(0, count)

        newMap[eid] = selected
        EventService.saveEventModalities(eid, selected)
      })

      setEventModalitiesState(newMap)
      localStorage.setItem('ge_initialized_modalities_v2', 'true')
    } else {
      setEventModalitiesState(storedAssociations)
    }
  }, []) // Remove duplicate useEffect for storedAssociations

  useEffect(() => {
    localStorage.setItem('ge_events', JSON.stringify(events))
  }, [events])

  // Removed auto-save useEffect for modalities to delegate to Service

  const addEvent = (eventData: Omit<Event, 'id'>, suppressToast = false) => {
    const newEvent: Event = EventService.prepareNewEvent(eventData)
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
      prev.map((event) => {
        if (event.id !== id) return event

        const updatedEvent = { ...event, ...eventData }

        // Auto-recalculate time status if dates changed
        if (eventData.startDate || eventData.endDate) {
          updatedEvent.computedTimeStatus = EventService.getTimeStatus(
            new Date(updatedEvent.startDate),
            new Date(updatedEvent.endDate)
          )
        }

        return updatedEvent
      }),
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
    // 1. Update Service (Persistence)
    EventService.saveEventModalities(eventId, modalityIds)

    // 2. Update Local State (Reactivity)
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
