import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Users,
  School,
  Calendar,
  Activity,
  ArrowRight,
  Clock,
  Trophy,
  Timer,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import {
  formatDistanceToNow,
  differenceInDays,
  differenceInHours,
  isPast,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { cn } from '@/lib/utils'
import { MOCK_INSCRIPTIONS_SEED } from '@/backend/banco/inscricoes'
import { MOCK_SCHOOL } from '@/backend/banco/escolas'
import { EventStatusBadge } from '@/components/EventStatusBadge'

export default function EventPanelDashboard() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { getEventById, getEventModalities } = useEvent()
  const { modalities } = useModality()

  const activeEvent = eventId ? getEventById(eventId) : undefined

  // 2. Mock & Derived Data
  const totalAthletes = activeEvent?.registrations || 0

  // Real calculation based on schools participating in this event
  // We check inscriptions to see which schools are present
  const schoolIds = new Set(MOCK_INSCRIPTIONS_SEED.filter(i => i.eventId === activeEvent?.id).map(i => i.schoolId))
  const totalSchools = schoolIds.size > 0 ? schoolIds.size : (MOCK_SCHOOL ? 1 : 0) // Fallback to at least 1 if MOCK_SCHOOL exists and we want to show something, or strict 0.
  // Actually, let's be strict:
  // const totalSchools = schoolIds.size

  // Mock Activity Feed
  const activities = useMemo(
    () => [
      {
        id: 1,
        text: 'Escola Técnica Estadual finalizou a inscrição da equipe de Vôlei.',
        time: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
        type: 'registration',
      },
      {
        id: 2,
        text: 'Boletim nº 01 publicado na área de comunicação.',
        time: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        type: 'info',
      },
      {
        id: 3,
        text: 'Colégio Santa Maria inscreveu 10 atletas na Natação.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        type: 'registration',
      },
    ],
    [],
  )

  // 3. Get Associated Modalities & Mock Counts
  const eventModalityStats = useMemo(() => {
    if (!activeEvent) return { collective: [], individual: [] }

    const linkedIds = getEventModalities(activeEvent.id)
    const relevantModalities = modalities.filter((m) =>
      linkedIds.includes(m.id),
    )

    const getCount = (modId: string) => {
      return MOCK_INSCRIPTIONS_SEED.filter(i => i.modalityId === modId && i.eventId === activeEvent.id).length
    }

    const collective = relevantModalities
      .filter((m) => m.type === 'coletiva')
      .map((m) => ({
        ...m,
        registeredCount: getCount(m.id),
      }))

    const individual = relevantModalities
      .filter((m) => m.type === 'individual')
      .map((m) => ({
        ...m,
        registeredCount: getCount(m.id),
      }))

    return { collective, individual }
  }, [activeEvent, modalities, getEventModalities])

  if (!activeEvent) {
    return <div>Evento não encontrado.</div>
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Button
              variant="ghost"
              size="icon"
              className="-ml-3 h-8 w-8"
              onClick={() => navigate('/area-do-produtor/evento')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Painel do Evento
            </h2>
          </div>
          <p className="text-muted-foreground mt-1">
            Visão geral e métricas de:{' '}
            <span className="font-semibold text-primary">
              {activeEvent.name}
            </span>
            <div className="inline-block ml-3 align-middle">
              <EventStatusBadge
                adminStatus={activeEvent.adminStatus}
                timeStatus={activeEvent.computedTimeStatus}
              />
            </div>
          </p>
        </div>
        <Button
          variant="outline"
          className="shadow-sm"
          onClick={() =>
            navigate(`/area-do-produtor/evento/${eventId}/relatorios`)
          }
        >
          <Activity className="mr-2 h-4 w-4" /> Ver Relatórios Completos
        </Button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-blue-100">
              Total de Atletas
            </CardTitle>
            <Users className="h-5 w-5 text-blue-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {totalAthletes.toLocaleString()}
            </div>
            <p className="text-xs text-blue-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Inscritos neste evento
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-emerald-100">
              Escolas Participantes
            </CardTitle>
            <School className="h-5 w-5 text-emerald-200" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold">
              {totalSchools.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-200 mt-1 flex items-center">
              <ArrowRight className="h-3 w-3 mr-1" /> Instituições neste evento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Countdowns Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CountdownCard
          title="Fechamento Inscrição Individual"
          date={activeEvent.registrationIndividualEnd}
          icon={Users}
          colorClass="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800"
          iconClass="text-purple-600 dark:text-purple-400"
        />
        <CountdownCard
          title="Fechamento Inscrição Coletiva"
          date={activeEvent.registrationCollectiveEnd}
          icon={School}
          colorClass="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800"
          iconClass="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Modality Statistics (2/3 width) */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  Inscrições por Modalidade
                </CardTitle>
                <CardDescription>Acompanhamento quantitativo.</CardDescription>
              </div>
              <Trophy className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="collective" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="collective">
                  Coletivas (Equipes)
                </TabsTrigger>
                <TabsTrigger value="individual">
                  Individuais (Atletas)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="collective" className="mt-0">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {eventModalityStats.collective.length === 0 ? (
                      <EmptyState text="Nenhuma modalidade coletiva vinculada." />
                    ) : (
                      eventModalityStats.collective.map((mod) => (
                        <div
                          key={mod.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {mod.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {mod.name}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {mod.gender}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-2xl font-bold text-primary">
                              {mod.registeredCount}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Equipes
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="individual" className="mt-0">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {eventModalityStats.individual.length === 0 ? (
                      <EmptyState text="Nenhuma modalidade individual vinculada." />
                    ) : (
                      eventModalityStats.individual.map((mod) => (
                        <div
                          key={mod.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                              {mod.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {mod.name}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {mod.gender} • {mod.eventCategory || 'Geral'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-2xl font-bold text-secondary">
                              {mod.registeredCount}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Atletas
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Activity Feed (1/3 width) */}
        <Card className="border shadow-sm flex flex-col">
          <CardHeader className="pb-4 border-b bg-muted/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Atividade Recente
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[400px]">
              <div className="divide-y">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 hover:bg-muted/5 transition-colors flex gap-3"
                  >
                    <div className="mt-1">
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full ring-2 ring-offset-1',
                          activity.type === 'registration'
                            ? 'bg-green-500 ring-green-200'
                            : 'bg-blue-500 ring-blue-200',
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground leading-snug">
                        {activity.text}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(activity.time, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

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
        <div
          className={cn(
            'h-10 w-10 rounded-lg flex items-center justify-center bg-white dark:bg-background shadow-sm',
            iconClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
      <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
