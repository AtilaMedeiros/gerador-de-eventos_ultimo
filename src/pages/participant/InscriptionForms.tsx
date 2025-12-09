import { useState, useRef, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filters, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Printer, Search, Trophy, Activity, Users, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

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

export default function InscriptionForms() {
  const { events } = useEvent()
  const { inscriptions, selectedEventId } = useParticipant()
  const { modalities } = useModality()

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])

  // Group inscriptions by modality for the SELECTED EVENT from context
  const getGroupedModalities = () => {
    if (!selectedEventId) return []

    const eventInscriptions = inscriptions.filter(i => i.eventId === selectedEventId)

    // Get unique modality IDs from inscriptions of this event
    const modalityIds = Array.from(
      new Set(eventInscriptions.map((i) => i.modalityId)),
    )

    let filtered = modalityIds
      .map((mid) => modalities.find((m) => m.id === mid))
      .filter((m) => !!m)

    // Global Search
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(mod => {
      if (!mod) return false
      return (
        mod.name.toLowerCase().includes(searchLower) ||
        mod.type.toLowerCase().includes(searchLower) ||
        mod.gender.toLowerCase().includes(searchLower) ||
        (mod.eventCategory && mod.eventCategory.toLowerCase().includes(searchLower))
      )
    })

    // Advanced Filters
    if (filters.length > 0) {
      filtered = filtered.filter(mod => {
        if (!mod) return false
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
    }

    return filtered
  }

  /* Pagination State */
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | string>(10)

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  // Apply Sorting
  const filteredList = getGroupedModalities()
  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortConfig || !a || !b) return 0

    const { key, direction } = sortConfig

    let aValue: any = a[key as keyof typeof a]
    let bValue: any = b[key as keyof typeof b]

    // Special handling for minAge (showing as range) - actually sorting by minAge is fine
    // Special handling for computed columns if needed.

    if (key === 'age') {
      aValue = a.minAge
      bValue = b.minAge
    }

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

  // Column Resizing Logic
  const [colWidths, setColWidths] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('ge_inscription_forms_col_widths_v3')
    return saved ? JSON.parse(saved) : {
      type: 150,
      name: 150,
      gender: 150,
      age: 150,
      print: 100
    }
  })

  useEffect(() => {
    localStorage.setItem('ge_inscription_forms_col_widths_v3', JSON.stringify(colWidths))
  }, [colWidths])

  // ... resizing refs and handlers ...
  const resizingRef = useRef<{ key: string, startX: number, startWidth: number } | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return
    const { key, startX, startWidth } = resizingRef.current
    const diff = e.clientX - startX
    const newWidth = Math.max(50, startWidth + diff)

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

  const handlePrint = (modalityId: string) => {
    // Check if it's a mock ID
    if (modalityId.startsWith('mock')) {
      // Open print view with mock/placeholder IDs
      // We use 'mock-event' if no event selected (though context usually has one)
      window.open(
        `/area-do-participante/imprimir/${selectedEventId || 'mock-event'}/${modalityId}`,
        '_blank',
      )
      return
    }

    const inscription = inscriptions.find(i => i.modalityId === modalityId)
    // Fallback search using selectedEventId if inscription not found directly (though list relies on it)
    if (inscription) {
      window.open(
        `/area-do-participante/imprimir/${inscription.eventId}/${modalityId}`,
        '_blank',
      )
    } else if (selectedEventId) {
      // If we have selected event and modality, but no specific inscription found (logic gap?), try opening anyway
      // This might happen if 'list' is built from modality definitions but inscription logic differs.
      // But in current "real" logic, list IS built from inscriptions.
      // So this branch is just safety.
      window.open(
        `/area-do-participante/imprimir/${selectedEventId}/${modalityId}`,
        '_blank',
      )
    } else {
      toast.error("Não foi possível localizar os dados para impressão.")
    }
  }

  // Mock data if list is empty
  const displayList = sortedList.length > 0 ? sortedList : [
    { id: 'mock1', name: 'Futsal Sub-15', type: 'coletiva', gender: 'masculino', minAge: 13, maxAge: 15 },
    { id: 'mock2', name: 'Vôlei de Praia', type: 'coletiva', gender: 'feminino', minAge: 14, maxAge: 16 },
    { id: 'mock3', name: 'Xadrez', type: 'individual', gender: 'misto', minAge: 8, maxAge: 18 },
    { id: 'mock4', name: 'Atletismo 100m', type: 'individual', gender: 'masculino', minAge: 15, maxAge: 17 },
    { id: 'mock5', name: 'Handebol', type: 'coletiva', gender: 'feminino', minAge: 12, maxAge: 14 },
  ] as any[] // Force type for mock compatibility


  const totalPages = Math.ceil(displayList.length / (typeof itemsPerPage === 'number' ? itemsPerPage : 1))
  const currentData = displayList.slice(
    (currentPage - 1) * (typeof itemsPerPage === 'number' ? itemsPerPage : 1),
    currentPage * (typeof itemsPerPage === 'number' ? itemsPerPage : 1)
  )

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* ... header ... */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ficha de Inscrição
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Gere e imprima as fichas de inscrição por modalidade.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* ... search and filters ... */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder="Pesquisar ficha..."
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
              <TableHead style={{ width: colWidths.type }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('type')}>
                <div className="flex items-center overflow-hidden">
                  <span className="truncate">Tipo</span> {getSortIcon('type')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'type')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.name }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => requestSort('name')}>
                <div className="flex items-center overflow-hidden">
                  <span className="truncate">Modalidade</span> {getSortIcon('name')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'name')}
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
              <TableHead style={{ width: colWidths.age }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('age')}>
                <div className="flex items-center justify-center overflow-hidden">
                  <span className="truncate">Faixa Etária</span> {getSortIcon('age')}
                </div>
                <div
                  onMouseDown={(e) => handleMouseDown(e, 'age')}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                />
              </TableHead>
              <TableHead style={{ width: colWidths.print }} className="relative text-center font-semibold text-primary/80 h-12">
                Imprimir
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground text-lg"
                >
                  Nenhuma inscrição encontrada.
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((mod) => (
                <TableRow
                  key={mod!.id}
                  className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                >
                  <TableCell className="h-12 py-0 overflow-hidden">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[5px] text-xs font-medium capitalize border ${mod!.type === 'coletiva'
                      ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                      : 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'
                      }`}>
                      {mod!.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium h-12 py-0 text-foreground/90 overflow-hidden">
                    <div className="flex items-center h-full truncate" title={mod!.name}>
                      {mod!.name}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground h-12 py-0 text-center overflow-hidden">
                    {mod!.gender}
                  </TableCell>
                  <TableCell className="text-muted-foreground h-12 py-0 text-center overflow-hidden">
                    <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                      {mod!.minAge} a {mod!.maxAge} anos
                    </span>
                  </TableCell>
                  <TableCell className="text-center h-12 py-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrint(mod!.id)}
                      className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full"
                      title="Imprimir Ficha"
                    >
                      <Printer className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Mostrando</span>
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
