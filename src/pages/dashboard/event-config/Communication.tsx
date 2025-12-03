import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Megaphone, FileText, Trophy, Scale, Search } from 'lucide-react'
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

  if (!selectedEventId) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
        <div className="space-y-2 text-center pt-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Comunicação do Evento
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Selecione um evento para gerenciar seus avisos, boletins, resultados
            e regulamentos.
          </p>
        </div>

        <Card className="max-w-md mx-auto shadow-md">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Selecione o Evento
              </label>
              <Select onValueChange={handleEventSelect}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name} (
                      {format(event.startDate, 'dd/MM/yyyy', { locale: ptBR })})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground flex gap-3 items-start">
              <Search className="h-5 w-5 shrink-0 mt-0.5" />
              <p>
                As opções de gerenciamento de comunicação serão habilitadas após
                a seleção do evento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Comunicação do Evento
          </h2>
          <p className="text-muted-foreground">
            Gerenciando:{' '}
            <span className="font-semibold text-foreground bg-primary/10 px-2 py-0.5 rounded">
              {selectedEvent?.name}
            </span>
          </p>
        </div>
        {!paramEventId && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedEventId('')
                setSearchParams({})
              }}
            >
              Trocar Evento
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="avisos" className="flex gap-2">
            <Megaphone className="h-4 w-4" /> Avisos
          </TabsTrigger>
          <TabsTrigger value="boletins" className="flex gap-2">
            <FileText className="h-4 w-4" /> Boletins
          </TabsTrigger>
          <TabsTrigger value="resultados" className="flex gap-2">
            <Trophy className="h-4 w-4" /> Resultados
          </TabsTrigger>
          <TabsTrigger value="regulamentos" className="flex gap-2">
            <Scale className="h-4 w-4" /> Regulamentos
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent
            value="avisos"
            className="m-0 focus-visible:outline-none"
          >
            <NoticesTab eventId={selectedEventId} />
          </TabsContent>

          <TabsContent
            value="boletins"
            className="m-0 focus-visible:outline-none"
          >
            <BulletinsTab eventId={selectedEventId} />
          </TabsContent>

          <TabsContent
            value="resultados"
            className="m-0 focus-visible:outline-none"
          >
            <ResultsTab eventId={selectedEventId} />
          </TabsContent>

          <TabsContent
            value="regulamentos"
            className="m-0 focus-visible:outline-none animate-fade-in"
          >
            <RegulationsTab eventId={selectedEventId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
