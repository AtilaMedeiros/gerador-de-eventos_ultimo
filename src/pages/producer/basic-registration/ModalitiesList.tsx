import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import {
  Search,
  Download,
  Plus,
  Edit,
  Copy,
  Trash2,
  Trophy,
  Users,
  Activity,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useModality } from '@/contexts/ModalityContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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
    type: 'text', // Can be select in future
    placeholder: 'Coletivo, Individual...',
  },
  {
    key: 'gender',
    label: 'Naipe',
    icon: <Users className="size-3.5" />,
    type: 'text', // Can be select in future
    placeholder: 'Masculino, Feminino...',
  }
]

export default function ModalitiesList() {
  const navigate = useNavigate()
  const { modalities, deleteModality, addModality } = useModality()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])

  const handleDuplicate = (modality: any) => {
    const { id: _, ...rest } = modality
    addModality({ ...rest, name: `${rest.name} (Cópia)` })
  }

  // Apply Filters
  const filteredModalities = modalities.filter((mod) => {
    // Global Search
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      mod.name.toLowerCase().includes(searchLower) ||
      mod.type.toLowerCase().includes(searchLower) ||
      mod.gender.toLowerCase().includes(searchLower) ||
      (mod.eventCategory &&
        mod.eventCategory.toLowerCase().includes(searchLower)) ||
      mod.minAge.toString().includes(searchLower) ||
      mod.maxAge.toString().includes(searchLower) ||
      mod.minAthletes.toString().includes(searchLower) ||
      mod.maxAthletes.toString().includes(searchLower) ||
      mod.maxTeams.toString().includes(searchLower) ||
      mod.maxEventsPerAthlete.toString().includes(searchLower)

    if (!matchesSearch) return false

    // Specific Filters
    if (filters.length === 0) return true

    return filters.every(filter => {
      const value = filter.value?.toString().toLowerCase() || ''
      if (value === '') return true

      switch (filter.field) {
        case 'name':
          return mod.name.toLowerCase().includes(value)
        case 'type':
          return mod.type.toLowerCase().includes(value)
        case 'gender':
          return mod.gender.toLowerCase().includes(value)
        default:
          return true
      }
    })
  })

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  // Apply Sorting
  const sortedModalities = [...filteredModalities].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig

    let aValue: any = a[key as keyof typeof a]
    let bValue: any = b[key as keyof typeof b]

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1
    }
    return 0
  })

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | string>(50)

  // Pagination Logic
  const pageSize = Number(itemsPerPage) > 0 ? Number(itemsPerPage) : 50
  const totalPages = Math.ceil(sortedModalities.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentModalities = sortedModalities.slice(startIndex, endIndex)

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  // Column Resizing Logic
  const [colWidths, setColWidths] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('ge_modalities_col_widths_v3')
    return saved ? JSON.parse(saved) : {
      name: 200,
      type: 120,
      gender: 100,
      minAge: 100,
      minAthletes: 100,
      maxTeams: 100,
      maxEventsPerAthlete: 100,
      actions: 80
    }
  })

  useEffect(() => {
    localStorage.setItem('ge_modalities_col_widths_v3', JSON.stringify(colWidths))
  }, [colWidths])

  const resizingRef = useRef<{ key: string, startX: number, startWidth: number } | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return
    const { key, startX, startWidth } = resizingRef.current
    const diff = e.clientX - startX
    const newWidth = Math.max(50, startWidth + diff) // Min width 50

    setColWidths(prev => ({
      ...prev,
      [key]: newWidth
    }))
  }, [])

  const handleMouseUp = useCallback(() => {
    resizingRef.current = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'default'
  }, [handleMouseMove])

  const handleMouseDown = useCallback((e: React.MouseEvent, key: string) => {
    e.preventDefault()
    e.stopPropagation()
    resizingRef.current = {
      key,
      startX: e.clientX,
      startWidth: colWidths[key] || 100
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
  }, [colWidths, handleMouseMove, handleMouseUp])


  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Background Gradients */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Modalidades
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gerencie o catálogo de esportes do sistema.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button
            onClick={() => navigate('/area-do-produtor/modalidades/nova')}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
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
            placeholder="Pesquisar por nome, tipo..."
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

      <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden overflow-x-auto">
        <Table style={{ tableLayout: 'fixed', minWidth: '100%' }}>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
              <TableHead style={{ width: colWidths.name }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('name')}>
                <div className="flex items-center overflow-hidden">
                  <span className="truncate">Nome</span> {getSortIcon('name')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'name')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.type }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('type')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">Tipo</span> {getSortIcon('type')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'type')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.gender }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('gender')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">Naipe</span> {getSortIcon('gender')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'gender')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.minAge }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors whitespace-nowrap text-center" onClick={() => requestSort('minAge')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">Idade</span> {getSortIcon('minAge')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'minAge')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.minAthletes }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors whitespace-nowrap text-center" onClick={() => requestSort('minAthletes')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">Atletas</span> {getSortIcon('minAthletes')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'minAthletes')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.maxTeams }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors whitespace-nowrap text-center" onClick={() => requestSort('maxTeams')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">Equipes Máx</span> {getSortIcon('maxTeams')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'maxTeams')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.maxEventsPerAthlete }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors whitespace-nowrap text-center" onClick={() => requestSort('maxEventsPerAthlete')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">Máx. Provas</span> {getSortIcon('maxEventsPerAthlete')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'maxEventsPerAthlete')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.actions }} className="relative text-right font-semibold text-primary/80 h-12">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentModalities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground text-lg"
                >
                  Nenhuma modalidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              currentModalities.map((mod) => (
                <TableRow
                  key={mod.id}
                  className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                >
                  <TableCell className="font-medium h-12 py-0">
                    <div className="flex flex-col justify-center h-full">
                      <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                        {mod.name}
                      </span>
                      {mod.eventCategory && (
                        <span className="text-[10px] text-muted-foreground font-light leading-tight">
                          {mod.eventCategory}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground h-12 py-0 text-center">
                    {mod.type}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground h-12 py-0 text-center">
                    {mod.gender}
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0 text-center">
                    {mod.minAge} - {mod.maxAge} anos
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0 text-center">
                    {mod.minAthletes} - {mod.maxAthletes}
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0 text-center">
                    {mod.maxTeams > 0 ? mod.maxTeams : 'Ilimitado'}
                  </TableCell>
                  <TableCell className="text-muted-foreground pl-8 h-12 py-0 text-center">
                    {mod.maxEventsPerAthlete}
                  </TableCell>
                  <TableCell className="text-right h-12 py-0">
                    <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                        title="Editar"
                        onClick={() =>
                          navigate(
                            `/area-do-produtor/modalidades/${mod.id}`,
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-secondary/20 hover:text-secondary-foreground rounded-full transition-colors"
                        title="Copiar"
                        onClick={() => handleDuplicate(mod)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Excluir"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-primary/10 shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Tem certeza absoluta?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso excluirá
                              permanentemente a modalidade
                              <strong> {mod.name}</strong> e removerá os dados
                              de nossos servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteModality(mod.id)}
                              className="bg-destructive hover:bg-destructive/90 rounded-xl shadow-lg shadow-destructive/20"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Monstrando</span>
          <Input
            type="number"
            min={1}
            max={500}
            value={itemsPerPage}
            onChange={(e) => {
              const val = e.target.value
              if (val === '') {
                setItemsPerPage('')
                return
              }
              let num = parseInt(val)
              if (isNaN(num)) return
              if (num > 500) num = 500
              setItemsPerPage(num)
              setCurrentPage(1)
            }}
            className="h-8 w-10 text-center p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span>registros por página</span>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Página {currentPage} de {totalPages || 1}
          </span>
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
  )
}
