'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
    Search,
    Download,
    Plus,
    Edit,
    ExternalLink,
    MapPin,
    Trash2,
    CalendarDays,
    Trophy,
    Users,
    User,
    CalendarHeart,
    UserPlus
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Filters, createFilter, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import { useEvent, Event } from '@/contexts/EventContext'
import { cn } from '@/lib/utils'

const formatDateRange = (start: Date | string | undefined, end: Date | string | undefined) => {
    if (!start || !end) return 'Data indefinida'
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 'Data indefinida'

    const startFormatted = format(startDate, "dd 'de' MMM", { locale: ptBR })

    if (startDate.getFullYear() === endDate.getFullYear()) {
        if (
            startDate.getMonth() === endDate.getMonth() &&
            startDate.getDate() === endDate.getDate()
        ) {
            return format(startDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
        }
        return `${startFormatted} - ${format(endDate, "dd 'de' MMM, yyyy", { locale: ptBR })}`
    }
    return `${format(startDate, "dd MMM yyyy", { locale: ptBR })} - ${format(endDate, "dd MMM yyyy", { locale: ptBR })}`
}

const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

const filterFields: FilterFieldConfig[] = [
    {
        key: 'location',
        label: 'Local',
        icon: <MapPin className="size-3.5" />,
        type: 'text',
        placeholder: 'Local do evento...',
    },
    {
        key: 'producerName',
        label: 'Produtor',
        icon: <User className="size-3.5" />,
        type: 'text',
        placeholder: 'Nome do produtor...',
    },
    {
        key: 'isActive',
        label: 'Eventos Publicados',
        activeLabel: '',
        icon: <CalendarHeart className="size-5" />,
        type: 'boolean',
    },
]

export default function EventsList() {
    const router = useRouter()
    const { events, deleteEvent } = useEvent()
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<Filter[]>([
        createFilter('isActive', 'equals', 'true')
    ])
    // Toggle state: true = cards, false = list (future impl)
    const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

    const handleOpenPublicLink = (
        e: React.MouseEvent,
        name: string,
        id: string,
    ) => {
        e.stopPropagation()
        const slug = generateSlug(name)
        const url = `/evento/${slug}/${id}`
        window.open(url, '_blank')
    }

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            deleteEvent(id)
        }
    }

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        router.push(`/area-do-produtor/eventos/${id}`)
    }

    const handlePanel = (id: string) => {
        router.push(`/area-do-produtor/eventos/${id}/dashboard`)
    }

    const filteredEvents = events.filter((event) => {
        // 1. Filter by Filters Component state
        const matchesFilters = filters.every(filter => {
            if (!filter.value) return true
            const value = String(filter.value).toLowerCase()

            switch (filter.field) {
                case 'location':
                    return event.location?.toLowerCase().includes(value) ?? false
                case 'producerName':
                    return (event as any).producerName?.toLowerCase().includes(value) ?? false
                case 'isActive': {
                    // If 'false' (unchecked), show all events.
                    if (value === 'false') return true
                    // If 'true' (checked), show only published events.
                    return (event as any).status === 'published'
                }
                default:
                    return true
            }
        })

        if (!matchesFilters) return false

        // 2. Filter by search
        if (search) {
            const searchLower = search.toLowerCase()
            return (
                event.name.toLowerCase().includes(searchLower) ||
                (event.location && event.location.toLowerCase().includes(searchLower)) ||
                ((event as any).producerName && (event as any).producerName.toLowerCase().includes(searchLower))
            )
        }
        return true
    })

    return (
        <TooltipProvider>
            <div className="space-y-8 animate-fade-in pb-20">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Trophy className="h-8 w-8 text-primary" />
                            Meus Eventos
                        </h2>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Gerencie seus eventos com excelência e estilo.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm hidden sm:flex"
                            onClick={() => toast.info('Exportação em desenvolvimento')}
                        >
                            <Download className="mr-2 h-4 w-4" /> Exportar
                        </Button>
                        <Button
                            onClick={() => router.push('/area-do-produtor/eventos/novo')}
                            className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:-translate-y-0.5 flex-1 sm:flex-none"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Criar Evento
                        </Button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group w-full">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                            placeholder="Buscar evento por nome, local ou inscrição..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-10 bg-white border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-lg transition-all shadow-sm text-left w-full text-foreground"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Filters Component */}
                        <div className="flex-1">
                            <Filters
                                fields={filterFields}
                                filters={filters}
                                onChange={setFilters}
                                addButton={
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-lg bg-white border-gray-200 text-primary hover:bg-white hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                        </svg>
                                    </Button>
                                }
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg shadow-sm h-10">
                            <button
                                className={cn(
                                    "p-1.5 rounded transition-colors",
                                    viewMode === 'cards' ? "bg-primary/10 text-primary" : "hover:bg-gray-100 text-gray-400"
                                )}
                                title="Visualização em cards"
                                onClick={() => setViewMode('cards')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                                    <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                                    <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                                    <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                                </svg>
                            </button>
                            <div className="w-px h-5 bg-gray-200"></div>
                            <button
                                className={cn(
                                    "p-1.5 rounded transition-colors",
                                    viewMode === 'list' ? "bg-primary/10 text-primary" : "hover:bg-gray-100 text-gray-400"
                                )}
                                title="Visualização em lista"
                                onClick={() => setViewMode('list')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" x2="21" y1="6" y2="6"></line>
                                    <line x1="3" x2="21" y1="12" y2="12"></line>
                                    <line x1="3" x2="21" y1="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredEvents.length === 0 ? (
                        <div className="h-80 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-2xl bg-muted/5">
                            <div className="bg-muted/30 p-6 rounded-full mb-4">
                                <Search className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="font-bold text-xl text-foreground">
                                Nenhum evento encontrado
                            </h3>
                            <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
                                Tente ajustar seus termos de busca ou crie um novo evento para
                                começar.
                            </p>
                            <Button
                                variant="link"
                                className="mt-4 text-primary"
                                onClick={() => {
                                    setSearch('')
                                    setFilters([])
                                }}
                            >
                                Limpar filtros
                            </Button>
                        </div>
                    ) : (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-card shadow-lg shadow-stone-200/50 dark:shadow-black/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group border border-border/60 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                                onClick={() => handlePanel(event.id)}
                            >
                                {/* Decorative Background Blur */}
                                <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-primary/10 pointer-events-none" />

                                {/* Date Box */}
                                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-primary/10 text-primary w-36 h-36 rounded-xl p-4 z-10">
                                    <span className="block text-sm font-medium tracking-wide uppercase">
                                        {event.startDate ? format(new Date(event.startDate), 'MMM', { locale: ptBR }) : 'DATA'}
                                    </span>
                                    <span className="block text-6xl font-bold -my-1">
                                        {event.startDate ? format(new Date(event.startDate), 'dd') : '--'}
                                    </span>
                                    <span className="block text-sm font-medium tracking-wide">
                                        {event.startDate ? format(new Date(event.startDate), 'yyyy') : '----'}
                                    </span>
                                </div>

                                {/* Event Info Grid */}
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full z-10">
                                    {/* Title Section */}
                                    <div className="col-span-1 md:col-span-3">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex flex-col gap-1">
                                                <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {event.name}
                                                </h2>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-sm">{event.location || 'Local não definido'}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-start md:items-end gap-1.5 -mt-2">
                                                <div className={cn(
                                                    "flex items-center gap-2 px-3 py-1 rounded-sm text-xs font-semibold w-fit",
                                                    (event as any).status === 'published'
                                                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                                )}>
                                                    <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                                                    <span>{(event as any).status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                    {(event as any).producerName || 'Organização'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Evento */}
                                    <div className="border-t border-border pt-4">
                                        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">EVENTO</p>
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                            <p className="text-sm font-semibold text-foreground">
                                                {formatDateRange(event.startDate, event.endDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Inscrições Coletivo */}
                                    <div className="border-t border-border pt-4">
                                        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">INSCRIÇÕES COLETIVO</p>
                                        <div className="flex items-center gap-3">
                                            <Users className="h-5 w-5 text-muted-foreground" />
                                            <p className="text-sm font-semibold text-foreground">
                                                {formatDateRange((event as any).registrationCollectiveStart, (event as any).registrationCollectiveEnd)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Inscrições Individuais */}
                                    <div className="border-t border-border pt-4">
                                        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">INSCRIÇÕES INDIVIDUAIS</p>
                                        <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                            <p className="text-sm font-semibold text-foreground truncate">
                                                {formatDateRange((event as any).registrationIndividualStart, (event as any).registrationIndividualEnd)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Icons */}
                                <div className="grid grid-cols-2 gap-2 z-10 w-full md:w-auto mt-4 md:mt-0 md:pl-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                aria-label="Communication"
                                                className="group/btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/area-do-produtor/eventos/${event.id}/publicacoes`)
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"></path><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"></path><path d="M8 6v8"></path></svg>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Comunicação</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                aria-label="Produtor Assistente / Observador"
                                                className="group/btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/area-do-produtor/eventos/${event.id}/produtor`)
                                                }}
                                            >
                                                <UserPlus className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Produtor Assistente / Observador</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                aria-label="Modalities"
                                                className="group/btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    router.push(`/area-do-produtor/modalidades`)
                                                }}
                                            >
                                                <Trophy className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Modalidades</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                aria-label="Edit Event"
                                                className="group/btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-muted-foreground hover:bg-blue-500/10 hover:text-blue-600"
                                                onClick={(e) => handleEdit(e, event.id)}
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Editar</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                aria-label="Share Event"
                                                className="group/btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600"
                                                onClick={(e) => handleOpenPublicLink(e, event.name, event.id)}
                                            >
                                                <ExternalLink className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">Link Público</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                aria-label="Delete Event"
                                                className="group/btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-destructive hover:bg-destructive/10"
                                                onClick={(e) => handleDelete(e, event.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left" className="text-destructive">Excluir</TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </TooltipProvider>
    )
}
