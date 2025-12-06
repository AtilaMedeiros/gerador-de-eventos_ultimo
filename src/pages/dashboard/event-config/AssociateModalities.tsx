import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, ArrowLeft, X, Save, Layers, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Activity, Users, Trophy } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Filters, type Filter as FilterType, type FilterFieldConfig } from '@/components/ui/filters'

const filterFields: FilterFieldConfig[] = [
  {
    key: 'name',
    label: 'Nome',
    icon: <Trophy className="size-3.5" />,
    type: 'text',
    placeholder: 'Buscar por nome...',
  },
  {
    key: 'type',
    label: 'Tipo',
    icon: <Activity className="size-3.5" />,
    type: 'text',
    placeholder: 'Coletivo, Individual...',
  },
  {
    key: 'gender',
    label: 'Gênero',
    icon: <Users className="size-3.5" />,
    type: 'text',
    placeholder: 'Masculino, Feminino...',
  }
]

export default function AssociateModalities({
  eventId: propEventId,
  isWizard = false,
  onNext,
  onBack,
}: {
  eventId?: string
  isWizard?: boolean
  onNext?: () => void
  onBack?: () => void
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { eventId: paramEventId } = useParams()

  const eventId = propEventId || paramEventId || searchParams.get('eventId')

  const [selected, setSelected] = useState<string[]>([])
  const { getEventById, getEventModalities, setEventModalities } = useEvent()
  const { modalities } = useModality()

  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterType[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const event = eventId ? getEventById(eventId) : undefined

  useEffect(() => {
    if (!eventId) {
      toast.warning('Nenhum evento selecionado.', {
        description: 'Retornando para a lista de eventos.',
      })
      navigate('/area-do-produtor/evento')
    } else {
      const existing = getEventModalities(eventId)
      if (existing.length > 0) {
        setSelected(existing)
      }
    }
  }, [eventId, getEventModalities, navigate])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const filteredModalities = useMemo(() => {
    return modalities.filter((mod) => {
      // Global Search
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        mod.name.toLowerCase().includes(searchLower) ||
        mod.type.toLowerCase().includes(searchLower) ||
        mod.gender.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      // Specific Filters
      if (filters.length === 0) return true

      return filters.every(filter => {
        const value = filter.value?.toString().toLowerCase() || ''
        if (value === '') return true

        switch (filter.field) {
          case 'name': return mod.name.toLowerCase().includes(value)
          case 'type': return mod.type.toLowerCase().includes(value)
          case 'gender': return mod.gender.toLowerCase().includes(value)
          default: return true
        }
      })
    })
  }, [modalities, searchTerm, filters])

  const sortedModalities = useMemo(() => {
    if (!sortConfig) return filteredModalities
    return [...filteredModalities].sort((a, b) => {
      const { key, direction } = sortConfig
      let aValue: any = a[key as keyof typeof a]
      let bValue: any = b[key as keyof typeof b]
      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredModalities, sortConfig])

  // Pagination Logic
  const totalPages = Math.ceil(sortedModalities.length / itemsPerPage)
  const currentModalities = sortedModalities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleAll = (select: boolean) => {
    if (select) {
      // Add all visible IDs that aren't already selected
      const visibleIds = filteredModalities.map(m => m.id)
      setSelected(prev => Array.from(new Set([...prev, ...visibleIds])))
    } else {
      // Remove all visible IDs from selection
      const visibleIds = filteredModalities.map(m => m.id)
      setSelected(prev => prev.filter(id => !visibleIds.includes(id)))
    }
  }

  const areAllVisibleSelected = filteredModalities.length > 0 && filteredModalities.every(m => selected.includes(m.id))

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
    }
    return sortConfig.direction === 'asc' ?
      <ArrowUp className="ml-2 h-4 w-4 text-primary" /> :
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
  }

  const handleSave = () => {
    if (eventId) {
      setEventModalities(eventId, selected)
      toast.success('Modalidades associadas com sucesso!', {
        description: `Foram vinculadas ${selected.length} modalidades ao evento ${event?.name || 'Selecionado'}.`,
      })

      if (isWizard && onNext) {
        onNext()
      } else if (!paramEventId) {
        navigate('/area-do-produtor/evento')
      }
    }
  }

  return (
    <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          {!isWizard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/area-do-produtor/evento')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Associar Modalidades
            </h2>
            <p className="text-muted-foreground text-sm">
              Selecione as modalidades que farão parte do evento.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isWizard && (
            <Button
              variant="outline"
              onClick={() => navigate('/area-do-produtor/evento')}
            >
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
          )}

          {isWizard && onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          )}

          <Button onClick={handleSave} disabled={!eventId}>
            {isWizard ? (
              <>Próximo <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Salvar Associações</>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6 pb-6">

        {/* Left Column: List */}
        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 flex-1 min-w-[200px] w-full relative">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3" />
              <Input
                placeholder="Pesquisar por nome, tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filters
                fields={filterFields}
                filters={filters}
                onChange={setFilters}
                addButton={
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 w-10 p-0 rounded-md bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-blue-200 dark:border-blue-800 hover:bg-primary/5 hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-blue-400"
                      aria-hidden="true"
                    >
                      <path d="M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348" />
                      <path d="M16 6h6" />
                      <path d="M19 3v6" />
                    </svg>
                  </button>
                }
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden overflow-x-auto border-collapse">
                <Table style={{ tableLayout: 'auto', minWidth: '100%' }}>
                  <TableHeader className="bg-primary/5">
                    <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
                      <TableHead className="w-[50px] relative font-semibold text-primary/80 h-12">
                        <Checkbox
                          checked={areAllVisibleSelected}
                          onCheckedChange={(checked) => toggleAll(!!checked)}
                          className="translate-y-[2px]"
                        />
                      </TableHead>
                      <TableHead className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('name')}>
                        <div className="flex items-center">
                          Nome {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('type')}>
                        <div className="flex items-center justify-center">
                          Tipo {getSortIcon('type')}
                        </div>
                      </TableHead>
                      <TableHead className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('gender')}>
                        <div className="flex items-center justify-center">
                          Gênero {getSortIcon('gender')}
                        </div>
                      </TableHead>
                      <TableHead className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('minAge')}>
                        <div className="flex items-center justify-center">
                          Idade (Min-Max) {getSortIcon('minAge')}
                        </div>
                      </TableHead>
                      <TableHead className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('minAthletes')}>
                        <div className="flex items-center justify-center">
                          Atletas (Min-Max) {getSortIcon('minAthletes')}
                        </div>
                      </TableHead>
                      <TableHead className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('maxTeams')}>
                        <div className="flex items-center justify-center">
                          Equipes Máx {getSortIcon('maxTeams')}
                        </div>
                      </TableHead>
                      <TableHead className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('maxEventsPerAthlete')}>
                        <div className="flex items-center justify-center">
                          Máx. Provas {getSortIcon('maxEventsPerAthlete')}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentModalities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground text-lg">
                          Nenhuma modalidade encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentModalities.map((mod) => {
                        const isSelected = selected.includes(mod.id);
                        return (
                          <TableRow
                            key={mod.id}
                            className={cn(
                              "cursor-pointer transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group",
                              isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-primary/5"
                            )}
                            onClick={() => toggle(mod.id)}
                          >
                            <TableCell className="h-12 py-0">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggle(mod.id)}
                                className="translate-y-[2px]"
                              />
                            </TableCell>
                            <TableCell className="font-medium h-12 py-0">
                              <div className="flex flex-col justify-center h-full">
                                <span className={cn("text-sm transition-colors leading-tight", isSelected && "text-primary font-bold")}>{mod.name}</span>
                                {mod.eventCategory && <span className="text-[10px] text-muted-foreground font-light leading-tight">{mod.eventCategory}</span>}
                              </div>
                            </TableCell>
                            <TableCell className="capitalize text-muted-foreground h-12 py-0 text-center text-sm">{mod.type}</TableCell>
                            <TableCell className="capitalize text-muted-foreground h-12 py-0 text-center text-sm">{mod.gender}</TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground h-12 py-0">{mod.minAge} - {mod.maxAge} anos</TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground h-12 py-0">{mod.minAthletes} - {mod.maxAthletes}</TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground h-12 py-0">
                              {mod.maxTeams > 0 ? mod.maxTeams : 'Ilimitado'}
                            </TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground h-12 py-0">
                              {mod.maxEventsPerAthlete}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Pagination Footer in Table */}
            <div className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/10 shrink-0">
              <div>
                Página {currentPage} de {totalPages || 1}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="w-80 shrink-0 hidden lg:flex flex-col gap-4">
          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-6 h-full flex flex-col">
            <div>
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Layers className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Resumo</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Você selecionou <strong className="text-foreground">{selected.length}</strong> modalidades.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin rounded-lg bg-muted/20 border p-3">
              {selected.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground text-center px-4">
                  Nenhuma modalidade selecionada.
                </div>
              ) : (
                <ul className="space-y-2">
                  {selected.map((id) => {
                    const mod = modalities.find((m) => m.id === id)
                    if (!mod) return null
                    return (
                      <li key={id} className="text-sm flex items-start gap-2 p-2 rounded-md bg-background border shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                        <span className="leading-tight">{mod.name}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
