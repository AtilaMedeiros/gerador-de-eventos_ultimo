import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Megaphone, FileText, Trophy, Scale, Search, Calendar, MapPin, ArrowRight } from 'lucide-react'
import { NoticesTab } from './communication-tabs/NoticesTab'
import { BulletinsTab } from './communication-tabs/BulletinsTab'
import { ResultsTab } from './communication-tabs/ResultsTab'
import { RegulationsTab } from './communication-tabs/RegulationsTab'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
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
  const [activeTab, setActiveTab] = useState('avisos')

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

  const selectedEvent = events.find((e) => e.id === selectedEventId)

  // No longer blocking return if no event selected

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="flex items-center justify-between overflow-x-auto pb-1">
          <TabsList className="h-12 bg-muted/20 p-1 gap-1 w-full md:w-auto supports-[backdrop-filter]:bg-background/60 backdrop-blur">
            <TabsTrigger value="avisos" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Mural de</span> Avisos
            </TabsTrigger>
            <TabsTrigger value="boletins" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
              <FileText className="h-4 w-4" /> Boletins
            </TabsTrigger>
            <TabsTrigger value="resultados" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
              <Trophy className="h-4 w-4" /> Resultados
            </TabsTrigger>
            <TabsTrigger value="regulamentos" className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-10 px-4 gap-2">
              <Scale className="h-4 w-4" /> Regulamentos
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px] border rounded-2xl bg-card/30 p-1">
          {!selectedEventId ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-6 animate-in fade-in zoom-in-95 duration-500">
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
            <div className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TabsContent value="avisos" className="m-0 focus-visible:outline-none">
                <NoticesTab eventId={selectedEventId} />
              </TabsContent>

              <TabsContent value="boletins" className="m-0 focus-visible:outline-none">
                <BulletinsTab eventId={selectedEventId} />
              </TabsContent>

              <TabsContent value="resultados" className="m-0 focus-visible:outline-none">
                <ResultsTab eventId={selectedEventId} />
              </TabsContent>

              <TabsContent value="regulamentos" className="m-0 focus-visible:outline-none">
                <RegulationsTab eventId={selectedEventId} />
              </TabsContent>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
