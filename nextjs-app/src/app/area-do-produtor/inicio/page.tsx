'use client'

import { useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Users,
    School,
    Calendar,
    Activity,
    ArrowRight,
    Clock,
    Trophy,
    CalendarDays,
    Plus,
    AlertCircle,
} from 'lucide-react'
import {
    formatDistanceToNow,
    differenceInDays,
    differenceInHours,
    isPast,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

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
import { useAuth } from '@/contexts/AuthContext'
import { useEvent, Event } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { cn } from '@/lib/utils'
import { mockActivities } from '@/mocks/activities'

export default function ProducerDashboard() {
    const router = useRouter()
    const { hasPermission } = useAuth()
    const { events, getEventModalities } = useEvent()
    const { modalities } = useModality()

    // 1. Determine Active Event (First published or first available)
    const activeEvent = useMemo(() => {
        return events.find((e) => e.status === 'published') || events[0]
    }, [events])

    // 2. Mock & Derived Data
    const totalAthletes = activeEvent?.registrations || 0
    const totalSchools = Math.round(totalAthletes / 12) + 5 // Mock realistic school count based on athletes
    const publicSchools = Math.round(totalSchools * 0.65)
    const privateSchools = totalSchools - publicSchools

    // Mock Activity Feed
    const activities = mockActivities

    // 3. Get Associated Modalities & Mock Counts
    const eventModalityStats = useMemo(() => {
        if (!activeEvent) return { collective: [], individual: [] }

        // Ensure getEventModalities is available before calling
        const ids = getEventModalities ? getEventModalities(activeEvent.id) : []

        // Fallback to show some modalities if none are linked yet for the demo
        const relevantModalities =
            ids.length > 0
                ? modalities.filter((m) => ids.includes(m.id))
                : modalities.slice(0, 6)

        const collective = relevantModalities
            .filter((m) => m.type === 'coletiva')
            .map((m) => ({
                ...m,
                registeredCount: Math.floor(Math.random() * 20) + 4, // Mock Teams
            }))

        const individual = relevantModalities
            .filter((m) => m.type === 'individual')
            .map((m) => ({
                ...m,
                registeredCount: Math.floor(Math.random() * 150) + 20, // Mock Athletes
            }))

        return { collective, individual }
    }, [activeEvent, modalities, getEventModalities])

    const handleCreateEvent = () => {
        if (hasPermission('criar_evento')) {
            router.push('/area-do-produtor/eventos/novo')
        } else {
            toast.error('Acesso Negado', {
                description: 'Você não tem permissão para criar novos eventos.',
            })
        }
    }

    if (!activeEvent) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="p-6 bg-muted/20 rounded-full">
                    <CalendarDays className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Nenhum evento encontrado</h2>
                <Button onClick={handleCreateEvent}>
                    <Plus className="mr-2 h-4 w-4" /> Criar Primeiro Evento
                </Button>
            </div>
        )
    }

    const eventStartDate = activeEvent.startDate ? new Date(activeEvent.startDate) : undefined
    const eventEndDate = activeEvent.endDate ? new Date(activeEvent.endDate) : undefined
    const regIndEnd = activeEvent.registrationIndividualEnd ? new Date(activeEvent.registrationIndividualEnd) : undefined
    const regColEnd = activeEvent.registrationCollectiveEnd ? new Date(activeEvent.registrationCollectiveEnd) : undefined

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Visão Geral
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Resumo executivo do evento:{' '}
                        <span className="font-semibold text-primary">
                            {activeEvent.name}
                        </span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="shadow-sm"
                        onClick={() => router.push('/area-do-produtor/relatorios')}
                    >
                        <Activity className="mr-2 h-4 w-4" /> Relatórios Detalhados
                    </Button>
                    <Button
                        className="bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
                        onClick={handleCreateEvent}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Evento
                    </Button>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                            <ArrowRight className="h-3 w-3 mr-1" /> Inscritos confirmados
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
                            <ArrowRight className="h-3 w-3 mr-1" /> Instituições registradas
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-cyan-600 to-cyan-700 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-cyan-100">
                            Escolas Públicas
                        </CardTitle>
                        <School className="h-5 w-5 text-cyan-200" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold">
                            {publicSchools.toLocaleString()}
                        </div>
                        <p className="text-xs text-cyan-200 mt-1 flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" /> Rede Pública
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-violet-600 to-violet-700 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-violet-100">
                            Escolas Particulares
                        </CardTitle>
                        <School className="h-5 w-5 text-violet-200" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold">
                            {privateSchools.toLocaleString()}
                        </div>
                        <p className="text-xs text-violet-200 mt-1 flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" /> Rede Privada
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Countdowns Row */}
            <div className="grid gap-6 md:grid-cols-3">
                <CountdownCard
                    title="Término do Evento"
                    date={eventEndDate}
                    icon={Calendar}
                    colorClass="!bg-slate-500/5 dark:!bg-slate-900 border-slate-200 dark:border-slate-800"
                    iconClass="text-slate-600 dark:text-slate-400"
                />
                <CountdownCard
                    title="Inscrição Individual"
                    date={regIndEnd}
                    icon={Users}
                    colorClass="!bg-purple-500/5 dark:!bg-purple-900/10 border-purple-100 dark:border-purple-800/50"
                    iconClass="text-purple-600 dark:text-purple-400"
                />
                <CountdownCard
                    title="Inscrição Coletiva"
                    date={regColEnd}
                    icon={School}
                    colorClass="!bg-amber-500/5 dark:!bg-amber-900/10 border-amber-100 dark:border-amber-800/50"
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
                                    Estatísticas por Modalidade
                                </CardTitle>
                                <CardDescription>
                                    Acompanhamento de inscrições por categoria.
                                </CardDescription>
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
                                                        : activity.type === 'alert'
                                                            ? 'bg-red-500 ring-red-200'
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
                        <div className="p-3 border-t bg-muted/10 text-center">
                            <Button variant="ghost" size="sm" className="text-xs w-full">
                                Ver Todo o Histórico
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
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
        <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    )
}
