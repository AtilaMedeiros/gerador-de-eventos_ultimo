import { useState, useEffect, useRef } from 'react'
import { Megaphone, Calendar, Search } from 'lucide-react'
import { CommunicationContent } from './CommunicationContent'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSearchParams, useParams } from 'react-router-dom'
import { useEvent } from '@/contexts/EventContext'
import { EventService } from '@/backend/services/event.service'

export default function Communication() {
  const { events } = useEvent()
  const [searchParams, setSearchParams] = useSearchParams()
  const { eventId: paramEventId } = useParams()

  const urlEventId = paramEventId || searchParams.get('eventId')
  const [selectedEventId, setSelectedEventId] = useState<string>('')

  // Sync URL param with state on mount/update
  useEffect(() => {
    if (urlEventId) {
      setSelectedEventId(urlEventId)
    }
  }, [urlEventId])

  // Auto-select most recent active event on mount if no ID provided
  const hasAutoSelected = useRef(false)
  useEffect(() => {
    if (events.length > 0 && !urlEventId && !selectedEventId && !hasAutoSelected.current) {
      const activeEvents = events.filter(e => EventService.isEditable(e.adminStatus || '', e.computedTimeStatus || ''))
      // If active events exist, sort by date desc
      if (activeEvents.length > 0) {
        const sorted = [...activeEvents].sort((a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        )
        const mostRecent = sorted[0]
        setSelectedEventId(mostRecent.id)
        hasAutoSelected.current = true
      }
    }
  }, [events, urlEventId, selectedEventId])

  const handleEventSelect = (value: string) => {
    setSelectedEventId(value)
    // Update URL to reflect selection only if not in panel view
    if (!paramEventId) {
      setSearchParams({ eventId: value })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10 px-4 md:px-6">
      {/* Premium Header & Context Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 pb-2 border-b border-border/40">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Megaphone className="h-6 w-6 text-primary" />
            </div>
            Central de Publicações
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Gerencie todas as publicações dos seus eventos em um só lugar.
          </p>
        </div>


      </div>

      <div className="w-full">
        <CommunicationContent
          eventId={selectedEventId}
          events={events} // Pass events list
          onEventSelect={handleEventSelect} // Pass handler
        />
      </div>
    </div>
  )
}
