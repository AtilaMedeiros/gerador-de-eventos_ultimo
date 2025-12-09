import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Calendar,
  Ticket,
  ArrowRight,
  ExternalLink,
  Activity,
  Trophy,
  AlertCircle,
  CalendarDays,
  Plus,
} from 'lucide-react'
import { format, differenceInDays, differenceInHours, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useEvent } from '@/contexts/EventContext'
import { useParticipant } from '@/contexts/ParticipantContext'

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function ParticipantHome() {
  const navigate = useNavigate()
  const { events } = useEvent()
  const { inscriptions, athletes } = useParticipant()

  // 1. Filter Active Events
  const activeEvents = useMemo(() => {
    return events.filter((e) => e.status === 'published')
  }, [events])

  // 2. Metrics
  const openEventsCount = activeEvents.length
  const confirmedInscriptionsCount = inscriptions.length
  const totalAthletes = athletes.length

  // 3. Helper for Inscription Status
  const getInscriptionStatus = (eventId: string) => {
    const hasInscriptions = inscriptions.some((i) => i.eventId === eventId)
    return hasInscriptions ? 'Inscrito' : 'Disponível'
  }

  const handleOpenPublicPage = (event: any) => {
    const slug = generateSlug(event.name)
    window.open(`/evento/${slug}/${event.id}`, '_blank')
  }

  // 4. Find the most urgent deadline (optional logic for countdowns)
  const nextDeadline = useMemo(() => {
    const dates = activeEvents
      .map(e => new Date(e.registrationIndividualEnd))
      .filter(date => !isPast(date))
      .sort((a, b) => a.getTime() - b.getTime())
    return dates[0]
  }, [activeEvents])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Visão Geral
          </h2>
          <p className="text-muted-foreground mt-1">
            Resumo da sua participação e gestão de atletas.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
            onClick={() => navigate('/area-do-participante/atletas/novo')}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Atleta
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Metric 1: Open Events */}
        <Card className="border-none shadow-md bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-blue-100">
              Eventos Disponíveis
            </CardTitle>
            <Calendar className="h-5 w-5 text-blue-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {openEventsCount}
            </div>
            <p className="text-xs text-blue-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Campeonatos abertos
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Inscriptions */}
        <Card className="border-none shadow-md bg-gradient-to-br from-violet-600 to-violet-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-violet-100">
              Minhas Inscrições
            </CardTitle>
            <Ticket className="h-5 w-5 text-violet-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {confirmedInscriptionsCount}
            </div>
            <p className="text-xs text-violet-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Vagas confirmadas
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Athletes */}
        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-emerald-100">
              Atletas Cadastrados
            </CardTitle>
            <Users className="h-5 w-5 text-emerald-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {totalAthletes}
            </div>
            <p className="text-xs text-emerald-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Base de talentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Countdowns Row (Optional - If there is a deadline) */}
      {nextDeadline && (
        <div className="grid gap-6 md:grid-cols-1">
          <CountdownCard
            title="Próximo Encerramento de Inscrições"
            date={nextDeadline}
            icon={CalendarDays}
            colorClass="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800"
            iconClass="text-amber-600 dark:text-amber-400"
          />
        </div>
      )}


      {/* Main Content: Events Table */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-muted/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Campeonatos e Torneios
              </CardTitle>
              <CardDescription>
                Lista de eventos ativos para inscrição.
              </CardDescription>
            </div>
            {activeEvents.length > 3 && (
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeEvents.length === 0 ? (
            <EmptyState text="Nenhum evento com inscrições abertas no momento." />
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Evento</TableHead>
                  <TableHead className="hidden md:table-cell">Período</TableHead>
                  <TableHead className="hidden md:table-cell">Local</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeEvents.map((event) => {
                  const status = getInscriptionStatus(event.id)
                  return (
                    <TableRow key={event.id} className="hover:bg-muted/5 transition-colors group">
                      <TableCell className="pl-6 font-medium text-foreground">
                        <span className="block">{event.name}</span>
                        <span className="md:hidden text-xs text-muted-foreground">
                          {format(event.startDate, 'dd/MM', { locale: ptBR })} • {event.location}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {format(event.startDate, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {event.location}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={status === 'Inscrito' ? 'secondary' : 'outline'}
                          className={cn(
                            "transition-colors",
                            status === 'Inscrito'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          )}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 md:w-auto md:h-9 md:px-3 gap-1 text-muted-foreground"
                            onClick={() => handleOpenPublicPage(event)}
                            title="Ver Informações"
                          >
                            <ExternalLink className="h-4 w-4" /> <span className="hidden md:inline">Info</span>
                          </Button>
                          <Button
                            size="sm"
                            className={cn(
                              "h-8 md:h-9 gap-1 shadow-sm transition-all",
                              status === 'Inscrito' ? "bg-white border hover:bg-muted text-foreground" : "bg-primary text-white hover:bg-primary/90"
                            )}
                            variant={status === 'Inscrito' ? 'outline' : 'default'}
                            onClick={() => navigate(`/area-do-participante/atletas?eventId=${event.id}`)}
                          >
                            {status === 'Inscrito' ? 'Gerenciar' : 'Inscrever-se'}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- Sub-components ---

function CountdownCard({
  title,
  date,
  icon: Icon,
  colorClass,
  iconClass,
}: {
  title: string
  date?: Date
  icon: any
  colorClass: string
  iconClass: string
}) {
  if (!date) return null

  const isFinished = isPast(date)
  const daysLeft = differenceInDays(date, new Date())
  const hoursLeft = differenceInHours(date, new Date()) % 24

  return (
    <Card className={cn('border shadow-sm overflow-hidden', colorClass)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'h-10 w-10 rounded-lg flex items-center justify-center bg-white dark:bg-background shadow-sm',
              iconClass,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              {isFinished ? (
                <span className="text-2xl font-bold text-muted-foreground">
                  Encerrado
                </span>
              ) : (
                <>
                  <span className="text-3xl font-bold tracking-tight">
                    {daysLeft}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    dias
                  </span>
                  {daysLeft < 3 && (
                    <>
                      <span className="ml-2 text-lg font-bold">{hoursLeft}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        h
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {!isFinished && daysLeft < 5 && (
        <div className="h-1 w-full bg-primary/20">
          <div className="h-full bg-primary w-[80%] animate-pulse" />
        </div>
      )}
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-muted/30 mb-3">
        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground max-w-sm">{text}</p>
    </div>
  )
}
