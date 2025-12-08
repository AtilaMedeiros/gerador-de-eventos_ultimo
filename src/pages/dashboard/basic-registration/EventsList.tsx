import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Search,
  Download,
  Plus,
  Edit,
  ExternalLink,
  Filter as FilterIcon,
  MapPin,
  LayoutDashboard,
  Trash2,
  CalendarDays,
  Clock,
  ChevronDown,
  Trophy,
  Users,
  UserPlus,
  User,
  Activity,
  Building,
  CalendarHeart,
  Megaphone,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Filters, createFilter, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/AuthContext'
import { useEvent, Event } from '@/contexts/EventContext'
import { cn } from '@/lib/utils'

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

const formatDateRange = (start: Date, end: Date) => {
  if (!start || !end) return 'Data indefinida'
  const startFormatted = format(start, "dd 'de' MMM", { locale: ptBR })
  const endFormatted = format(end, "dd 'de' MMM, yyyy", { locale: ptBR })

  if (start.getFullYear() === end.getFullYear()) {
    if (
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    ) {
      return format(start, "dd 'de' MMMM, yyyy", { locale: ptBR })
    }
    return `${startFormatted} - ${format(end, "dd 'de' MMM, yyyy", { locale: ptBR })}`
  }
  return `${format(start, 'dd MMM yyyy', { locale: ptBR })} - ${format(end, 'dd MMM yyyy', { locale: ptBR })}`
}

const getRegistrationRange = (event: Event) => {
  const starts = [
    event.registrationCollectiveStart,
    event.registrationIndividualStart,
  ]
    .filter((d): d is Date => !!d)
    .map((d) => d.getTime())

  const ends = [
    event.registrationCollectiveEnd,
    event.registrationIndividualEnd,
  ]
    .filter((d): d is Date => !!d)
    .map((d) => d.getTime())

  if (starts.length === 0 || ends.length === 0) return 'Não configurado'

  const minStart = new Date(Math.min(...starts))
  const maxEnd = new Date(Math.max(...ends))

  return formatDateRange(minStart, maxEnd)
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
    label: 'Evento Ativo',
    activeLabel: '',
    icon: <CalendarHeart className="size-5" />,
    type: 'boolean',
  },
]

export default function EventsList() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const { events, deleteEvent } = useEvent()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filter[]>([
    createFilter('isActive', 'equals', 'true')
  ])

  const handleCreateEvent = () => {
    if (hasPermission('criar_evento')) {
      navigate('/area-do-produtor/evento/novo')
    } else {
      toast.error('Acesso Negado', {
        description: 'Você não tem permissão para criar novos eventos.',
      })
    }
  }

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
    navigate(`/area-do-produtor/evento/${id}`)
  }

  const handlePanel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigate(`/area-do-produtor/evento/${id}/dashboard`)
  }

  const filteredEvents = events.filter((event) => {
    // 1. Filter by Filters Component state
    const matchesFilters = filters.every(filter => {
      if (!filter.value) return true
      const value = filter.value.toLowerCase()

      switch (filter.field) {
        case 'location':
          return event.location?.toLowerCase().includes(value) ?? false
        case 'producerName':
          return event.producerName?.toLowerCase().includes(value) ?? false
        case 'isActive': {
          // Specific logic for Active/Inactive
          if (filter.value === 'false') return true // "Inactive" or "All"? Usually boolean filter is true/false. 
          // If boolean filter is 'true', we want only active events.
          // If boolean filter is 'false', we usually want inactive. 
          // BUT the previous logic was "Active Only" toggle.
          // SchoolsList logic for boolean:
          // const boolValue = value === 'true' || value === true
          // return school.isEventActive === boolValue

          // Based on previous logic:
          const isClosed = event.status === 'closed' || event.status === 'deleted' || event.status === 'ended'
          if (value === 'true') return !isClosed
          if (value === 'false') return isClosed
          return true
        }
        default:
          return true
      }
    })

    if (!matchesFilters) return false

    if (search) {
      const searchLower = search.toLowerCase()
      const statusTerm = event.status === 'published' ? 'publicado' : 'rascunho'
      const eventDateRange = formatDateRange(event.startDate, event.endDate).toLowerCase()
      const collectiveRange = formatDateRange(event.registrationCollectiveStart, event.registrationCollectiveEnd).toLowerCase()
      const individualRange = formatDateRange(event.registrationIndividualStart, event.registrationIndividualEnd).toLowerCase()

      return (
        event.name.toLowerCase().includes(searchLower) ||
        (event.location && event.location.toLowerCase().includes(searchLower)) ||
        (event.producerName && event.producerName.toLowerCase().includes(searchLower)) ||
        statusTerm.includes(searchLower) ||
        eventDateRange.includes(searchLower) ||
        collectiveRange.includes(searchLower) ||
        individualRange.includes(searchLower)
      )
    }
    return true
  })

  return (
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
          >
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={handleCreateEvent}
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
            className="pl-10 h-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left w-full"
          />
        </div>

        <div className="flex bg-white items-center gap-4">
          <div className="flex-1">
            <Filters
              fields={filterFields}
              filters={filters}
              onChange={setFilters}
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
              onClick={() => setSearch('')}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-card shadow-lg shadow-stone-200/50 dark:shadow-black/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group border border-border/60 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
              onClick={() =>
                navigate(`/area-do-produtor/evento/${event.id}/dashboard`)
              }
            >
              {/* Decorative Background Blur */}
              <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-primary/10 pointer-events-none" />

              <div className="flex-shrink-0 flex flex-col items-center justify-center bg-primary/10 text-primary w-36 h-36 rounded-xl p-4 z-10">
                <span className="block text-sm font-medium tracking-wide uppercase">
                  {event.startDate ? format(event.startDate, 'MMM', { locale: ptBR }) : 'DATA'}
                </span>
                <span className="block text-6xl font-bold -my-1">
                  {event.startDate ? format(event.startDate, 'dd') : '--'}
                </span>
                <span className="block text-sm font-medium tracking-wide">
                  {event.startDate ? format(event.startDate, 'yyyy') : '----'}
                </span>
              </div>

              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 w-full z-10">
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
                        event.status === 'published'
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      )}>
                        <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                        <span>{event.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {event.producerName || 'Organização'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">EVENTO</p>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">
                      {formatDateRange(event.startDate, event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">INSCRIÇÕES COLETIVO</p>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground">
                      {formatDateRange(event.registrationCollectiveStart, event.registrationCollectiveEnd)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-2">INSCRIÇÕES INDIVIDUAIS</p>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-semibold text-foreground truncate">
                      {formatDateRange(event.registrationIndividualStart, event.registrationIndividualEnd)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 z-10 w-full md:w-auto mt-4 md:mt-0 md:pl-6 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Communication"
                      className="group/btn flex items-center justify-center w-10 h-10 rounded-lg transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/area-do-produtor/evento/${event.id}/comunicacao`)
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
                        navigate(`/area-do-produtor/evento/${event.id}/produtor`)
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
                        navigate(`/area-do-produtor/evento/${event.id}/modalidades`)
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

    </div >
  )
}
