import { useState, useEffect } from 'react'
import { Megaphone, Calendar, Search } from 'lucide-react'
import { CommunicationContent } from './CommunicationContent'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSearchParams, useParams } from 'react-router-dom'
import { useEvent } from '@/contexts/EventContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
            Central de Comunicação
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Gerencie avisos, boletins, resultados e regulamentos dos seus eventos em um só lugar.
          </p>
        </div>

        {/* Global Event Selector */}
        <div className="w-full md:w-[320px] space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">
            Evento Ativo
          </label>
          <Select
            value={selectedEventId}
            onValueChange={handleEventSelect}
          >
            <SelectTrigger className="h-11 bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 focus:ring-primary/20 shadow-sm transition-all">
              <div className="flex items-center gap-2 truncate">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <SelectValue placeholder="Selecione um evento para gerenciar..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id} className="cursor-pointer">
                  <div className="flex flex-col gap-0.5 py-1">
                    <span className="font-medium">{event.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(event.startDate, "d 'de' MMM, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {events.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Nenhum evento cadastrado.
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full">
        {!selectedEventId ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500 border rounded-2xl bg-card/30">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center animate-pulse-slow">
              <Search className="h-10 w-10 text-primary/40" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold">Selecione um evento para começar</h3>
              <p className="text-muted-foreground">
                Escolha um evento no menu superior para acessar e gerenciar todas as ferramentas de comunicação disponíveis.
              </p>
            </div>
          </div>
        ) : (
          <CommunicationContent eventId={selectedEventId} />
        )}
      </div>
    </div>
  )
}
