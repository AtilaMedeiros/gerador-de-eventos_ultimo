import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import { toast } from 'sonner'
import {
    ArrowLeft,
    School,
    Save,
    CheckCircle2,
    Calendar,
    MapPin,
    Search,
    Trophy,
    Activity,
    CalendarHeart
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useEvent } from '@/contexts/EventContext'
import { SchoolService } from '@/backend/services/school.service'
import { EventStatusBadge } from '@/components/EventStatusBadge'

const filterFields: FilterFieldConfig[] = [
    {
        key: 'name',
        label: 'Nome do Evento',
        icon: <Trophy className="size-3.5" />,
        type: 'text',
        placeholder: 'Buscar por nome...',
    },
    {
        key: 'location',
        label: 'Localização',
        icon: <MapPin className="size-3.5" />,
        type: 'text',
        placeholder: 'Cidade, Ginásio...',
    },
    {
        key: 'status',
        label: 'Status',
        icon: <Activity className="size-3.5" />,
        type: 'text',
        placeholder: 'published, draft...',
    }
]

export default function LinkSchoolEvents() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { events } = useEvent()

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<Filter[]>([])

    const [school, setSchool] = useState<any>(null)
    const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 1. Fetch School Data
    useEffect(() => {
        const allSchools = JSON.parse(localStorage.getItem('ge_schools_list') || '[]')
        const found = allSchools.find((s: any) => s.id === id)

        if (found) {
            setSchool(found)
            const initialIds = found.eventIds || (found.eventId ? [found.eventId] : [])
            setSelectedEventIds(initialIds)
        } else {
            toast.error('Escola não encontrada')
            navigate('/area-do-produtor/escolas')
        }
    }, [id, navigate])

    const handleToggleEvent = (eventId: string, isLinked: boolean) => {
        if (isLinked) {
            setSelectedEventIds(prev => [...prev, eventId])
        } else {
            setSelectedEventIds(prev => prev.filter(id => id !== eventId))
        }
    }

    const handleSave = async () => {
        if (!school) return
        setIsSubmitting(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            SchoolService.linkEvents(school.id, selectedEventIds)
            toast.success('Eventos vinculados com sucesso!')
            navigate('/area-do-produtor/escolas')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao vincular eventos.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Filter Events
    const filteredEvents = events.filter(event => {
        // Global Search
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
            event.name.toLowerCase().includes(searchLower) ||
            event.location.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false

        // Specific Filters
        if (filters.length === 0) return true

        return filters.every(filter => {
            const value = filter.value?.toString().toLowerCase() || ''
            if (value === '') return true

            switch (filter.field) {
                case 'name':
                    return event.name.toLowerCase().includes(value)
                case 'location':
                    return event.location.toLowerCase().includes(value)
                case 'status':
                    return event.status.toLowerCase().includes(value)
                default:
                    return true
            }
        })
    })

    if (!school) return null

    return (
        <div className="space-y-8 animate-fade-in relative min-h-screen pb-20">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-white/50 hover:bg-white"
                        onClick={() => navigate('/area-do-produtor/escolas')}
                    >
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-2">
                            <School className="h-6 w-6 text-primary" />
                            Vincular Eventos
                        </h2>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">{school.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-foreground border border-secondary/20">
                                {school.inep || 'Sem INEP'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-foreground">
                            {selectedEventIds.length} Evento(s) selecionado(s)
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Gerencie o acesso desta escola
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="h-11 px-6 rounded-[6px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Salvando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save className="h-4 w-4" /> Salvar Vínculos
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Search and Advanced Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        placeholder="Pesquisar por nome, local..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left w-full"
                    />
                </div>

                <div className="flex bg-white items-center gap-4">
                    <div className="flex-1">
                        <Filters
                            fields={filterFields}
                            filters={filters}
                            onChange={(newFilters) => setFilters(newFilters)}
                            addButton={
                                <Button
                                    size="sm"
                                    className="h-10 w-10 p-0 rounded-md bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-blue-200 dark:border-blue-800 hover:bg-primary/5 hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-400" aria-hidden="true">
                                        <path d="M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348"></path>
                                        <path d="M16 6h6"></path>
                                        <path d="M19 3v6"></path>
                                    </svg>
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => {
                    const isLinked = selectedEventIds.includes(event.id)

                    return (
                        <Card
                            key={event.id}
                            className={`
                        relative overflow-hidden border transition-all duration-300 group cursor-default
                        ${isLinked
                                    ? 'border-primary/50 bg-primary/5 shadow-md shadow-primary/10'
                                    : 'border-border/50 bg-white/40 hover:border-primary/30 hover:bg-white/60'}
                    `}
                        >
                            {isLinked && (
                                <div className="absolute top-3 right-3 z-10">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground shadow-sm animate-in zoom-in-50">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </span>
                                </div>
                            )}

                            <div className={`h-2 absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/60 transition-opacity duration-300 ${isLinked ? 'opacity-100' : 'opacity-0'}`} />

                            <CardHeader className="pb-3 pt-6">
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className={`text-lg font-bold line-clamp-2 leading-tight ${isLinked ? 'text-primary' : 'text-foreground'}`}>
                                        {event.name}
                                    </CardTitle>
                                </div>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    {/* Location removed as requested */}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    {/* Event Date */}
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50">
                                        <div className="p-1.5 bg-primary/10 rounded-md">
                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">Data do Evento</span>
                                            <span className="font-medium text-foreground text-xs">
                                                {format(event.startDate, "dd MMM", { locale: ptBR })} - {format(event.endDate, "dd MMM", { locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Inscription Dates Grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1 text-sm text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50">
                                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 flex items-center gap-1.5">
                                                <CalendarHeart className="h-3 w-3 text-purple-500" />
                                                <span className="truncate">Coletiva</span>
                                            </span>
                                            <span className="font-medium text-foreground text-xs truncate">
                                                {event.registrationCollectiveStart ? (
                                                    <>
                                                        {format(new Date(event.registrationCollectiveStart), "dd MMM", { locale: ptBR })} - {format(new Date(event.registrationCollectiveEnd || event.endDate), "dd MMM", { locale: ptBR })}
                                                    </>
                                                ) : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1 text-sm text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50">
                                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 flex items-center gap-1.5">
                                                <CalendarHeart className="h-3 w-3 text-blue-500" />
                                                <span className="truncate">Individual</span>
                                            </span>
                                            <span className="font-medium text-foreground text-xs truncate">
                                                {event.registrationIndividualStart ? (
                                                    <>
                                                        {format(new Date(event.registrationIndividualStart), "dd MMM", { locale: ptBR })} - {format(new Date(event.registrationIndividualEnd || event.endDate), "dd MMM", { locale: ptBR })}
                                                    </>
                                                ) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-[10px]">
                                                <span className="font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
                                                <span className={`font-bold uppercase ${event.adminStatus === 'PUBLICADO' ? 'text-emerald-600 dark:text-emerald-400' :
                                                        event.adminStatus === 'CANCELADO' ? 'text-red-600 dark:text-red-400' :
                                                            'text-muted-foreground'
                                                    }`}>
                                                    {event.adminStatus === 'PUBLICADO' ? 'Publicado' :
                                                        event.adminStatus === 'RASCUNHO' ? 'Rascunho' :
                                                            event.adminStatus === 'CANCELADO' ? 'Cancelado' :
                                                                event.adminStatus === 'SUSPENSO' ? 'Suspenso' :
                                                                    event.adminStatus === 'REABERTO' ? 'Reaberto' : event.adminStatus}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px]">
                                                <span className="font-semibold text-muted-foreground uppercase tracking-wider">Data:</span>
                                                <span className={`font-bold uppercase ${event.computedTimeStatus === 'ATIVO' ? 'text-blue-600 dark:text-blue-400' :
                                                        event.computedTimeStatus === 'AGENDADO' ? 'text-amber-600 dark:text-amber-400' :
                                                            'text-muted-foreground'
                                                    }`}>
                                                    {event.computedTimeStatus === 'ATIVO' ? 'Em andamento' :
                                                        event.computedTimeStatus === 'AGENDADO' ? 'Agendado' :
                                                            event.computedTimeStatus === 'ENCERRADO' ? 'Encerrado' : '-'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${isLinked ? 'text-primary' : 'text-muted-foreground'}`}>
                                                {isLinked ? 'Vinculado' : 'Desvinculado'}
                                            </span>
                                            <Switch
                                                checked={isLinked}
                                                onCheckedChange={(checked) => handleToggleEvent(event.id, checked)}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {filteredEvents.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground">
                        <div className="bg-muted/30 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-10 w-10 opacity-20" />
                        </div>
                        <h3 className="text-lg font-medium">Nenhum evento encontrado</h3>
                        <p>Tente buscar por outro termo.</p>
                    </div>
                )}
            </div>
        </div >
    )
}
