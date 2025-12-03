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
  Filter,
  MapPin,
  LayoutDashboard,
  Trash2,
  CalendarDays,
  Clock,
  ChevronDown,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

export default function EventsList() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const { events, deleteEvent } = useEvent()
  const [search, setSearch] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState(true)

  const handleCreateEvent = () => {
    if (hasPermission('criar_evento')) {
      navigate('/area-do-produtor/cadastro-basico/evento/novo')
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
    navigate(`/area-do-produtor/cadastro-basico/evento/${id}`)
  }

  const handlePanel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigate(`/area-do-produtor/evento/${id}/dashboard`)
  }

  const filteredEvents = events.filter((event) => {
    if (showActiveOnly) {
      if (
        event.status === 'closed' ||
        event.status === 'deleted' ||
        event.status === 'ended'
      )
        return false
    }
    if (search && !event.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Meus Eventos
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerencie suas competições com excelência e estilo.
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

      {/* Filters Bar */}
      <div className="bg-card p-1.5 rounded-xl border shadow-sm flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Buscar evento por nome, local ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-none bg-transparent shadow-none focus-visible:ring-0 h-10"
          />
        </div>
        <div className="h-6 w-[1px] bg-border hidden sm:block" />
        <div className="flex items-center gap-2 w-full sm:w-auto px-2 pb-2 sm:pb-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={cn(
              'gap-2 text-xs font-medium rounded-lg transition-all',
              showActiveOnly
                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            {showActiveOnly ? 'Ativos' : 'Todos'}
            <Filter className="h-3 w-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs rounded-lg">
                Ordenar <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mais recentes</DropdownMenuItem>
              <DropdownMenuItem>Mais antigos</DropdownMenuItem>
              <DropdownMenuItem>Nome (A-Z)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            <Card
              key={event.id}
              className="group relative overflow-hidden border border-border/60 hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer bg-card"
              onClick={() =>
                navigate(`/area-do-produtor/evento/${event.id}/dashboard`)
              }
            >
              {/* Decorative Background Blur */}
              <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-primary/10 pointer-events-none" />

              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Main Content */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between gap-6 relative z-10">
                    {/* Header: Status & Title */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {event.status === 'published' ? (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20 px-2.5 py-0.5 rounded-full transition-colors">
                            <span className="relative flex h-2 w-2 mr-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Publicado
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 px-2.5 py-0.5 rounded-full"
                          >
                            Rascunho
                          </Badge>
                        )}
                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          {event.producerName || 'Organização'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                          {event.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <MapPin className="h-4 w-4 text-primary/70" />
                          {event.location}
                        </div>
                      </div>
                    </div>

                    {/* Info Grid: Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/30 border border-secondary/50 group-hover:bg-secondary/50 transition-colors">
                        <div className="p-2 bg-background rounded-lg shadow-sm text-primary shrink-0">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                            Data do Evento
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatDateRange(event.startDate, event.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary/30 border border-secondary/50 group-hover:bg-secondary/50 transition-colors">
                        <div className="p-2 bg-background rounded-lg shadow-sm text-amber-600 shrink-0">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                            Período de Inscrição
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {getRegistrationRange(event)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Sidebar */}
                  <div className="bg-muted/30 lg:w-24 border-t lg:border-t-0 lg:border-l flex lg:flex-col items-center justify-center gap-3 p-4 lg:py-8 z-20">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-background shadow-sm text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                          onClick={(e) => handlePanel(e, event.id)}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="font-semibold">
                        Painel do Evento
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-background shadow-sm text-foreground hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300"
                          onClick={(e) => handleEdit(e, event.id)}
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="font-semibold">
                        Editar Evento
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-background shadow-sm text-foreground hover:bg-emerald-600 hover:text-white hover:scale-110 transition-all duration-300"
                          onClick={(e) =>
                            handleOpenPublicLink(e, event.name, event.id)
                          }
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="font-semibold">
                        Link Público
                      </TooltipContent>
                    </Tooltip>

                    <div className="w-[1px] h-6 bg-border hidden lg:block my-1" />
                    <div className="w-6 h-[1px] bg-border block lg:hidden mx-1" />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl bg-background shadow-sm text-destructive hover:bg-destructive hover:text-white hover:scale-110 transition-all duration-300"
                          onClick={(e) => handleDelete(e, event.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="font-semibold text-destructive"
                      >
                        Excluir Evento
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
