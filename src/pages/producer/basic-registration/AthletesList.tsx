import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
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
import { Filters, createFilter, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import {
    Search,
    Download,
    Plus,
    Edit,
    Trash2,
    User,
    Trophy,
    Activity,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    CalendarHeart
} from 'lucide-react'
import { StatusLegendTooltip } from '@/components/StatusLegendTooltip'
import { EventStatusBadge } from '@/components/EventStatusBadge'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useParticipant, Athlete } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { EventService } from '@/backend/services/event.service'
import { format } from 'date-fns'

const filterFields: FilterFieldConfig[] = [
    {
        key: 'name',
        label: 'Nome do Atleta',
        icon: <User className="size-3.5" />,
        type: 'text',
        placeholder: 'Buscar por nome...',
    },
    {
        key: 'cpf',
        label: 'CPF',
        icon: <Activity className="size-3.5" />,
        type: 'text',
        placeholder: 'Número do CPF...',
    },
    {
        key: 'event',
        label: 'Evento',
        icon: <Trophy className="size-3.5" />,
        type: 'text',
        placeholder: 'Nome do evento...',
    },
    {
        key: 'isEventActive',
        label: 'Evento Editável',
        activeLabel: '',
        icon: <CalendarHeart className="size-5" />,
        type: 'boolean',
    },
]

export default function AthletesList() {
    const navigate = useNavigate()
    const { athletes, deleteAthlete } = useParticipant()
    const { events } = useEvent()
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<Filter[]>([
        createFilter('isEventActive', 'equals', 'true')
    ])

    // Derived state merging athletes with real events (Simulated Association for Display)
    // Derived state merging athletes with real events
    const enrichedAthletes = useMemo(() => {
        return athletes.map((athlete) => {
            const assignedEvent = events.find(e => e.id === athlete.eventId)
            return {
                ...athlete,
                event: assignedEvent ? assignedEvent.name : 'N/A',
                adminStatus: assignedEvent ? assignedEvent.adminStatus : 'DESATIVADO',
                // computedTimeStatus is optional on Event? It's usually present in our mocks.
                computedTimeStatus: assignedEvent ? (assignedEvent as any).computedTimeStatus : 'ENCERRADO'
            }
        })
    }, [athletes, events])

    // Apply Filters
    const filteredAthletes = useMemo(() => {
        return enrichedAthletes.filter(athlete => {
            // Global Search
            const searchLower = searchTerm.toLowerCase()
            const matchesSearch =
                athlete.name.toLowerCase().includes(searchLower) ||
                athlete.cpf.includes(searchLower) ||
                athlete.event.toLowerCase().includes(searchLower)

            if (!matchesSearch) return false

            // Specific Filters
            if (filters.length === 0) return true

            return filters.every(filter => {
                const value = filter.value?.toString().toLowerCase() || ''
                if (value === '') return true

                switch (filter.field) {
                    case 'name':
                        return athlete.name.toLowerCase().includes(value)
                    case 'cpf':
                        return athlete.cpf.includes(value)
                    case 'event':
                        return athlete.event.toLowerCase().includes(value)
                    case 'isEventActive':
                        if (value === 'false') return true
                        return EventService.isEditable(athlete.adminStatus || '', (athlete as any).computedTimeStatus || '')
                    default:
                        return true
                }
            })
        })
    }, [enrichedAthletes, searchTerm, filters])

    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

    // Apply Sorting
    const sortedAthletes = useMemo(() => {
        const sorted = [...filteredAthletes].sort((a, b) => {
            if (!sortConfig) return 0

            const { key, direction } = sortConfig

            const aValue: any = (a as any)[key]
            const bValue: any = (b as any)[key]

            if (aValue < bValue) {
                return direction === 'asc' ? -1 : 1
            }
            if (aValue > bValue) {
                return direction === 'asc' ? 1 : -1
            }
            return 0
        })
        return sorted
    }, [filteredAthletes, sortConfig])

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
    const totalPages = Math.ceil(sortedAthletes.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentAthletes = sortedAthletes.slice(startIndex, endIndex)

    // Reset page when filters change
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1)
    }

    // Column Resizing Logic
    const [colWidths, setColWidths] = useState<{ [key: string]: number }>(() => {
        const saved = localStorage.getItem('ge_athletes_col_widths_v2')
        return saved ? JSON.parse(saved) : {
            name: 200,
            sex: 90,
            dob: 100,
            cpf: 130,
            event: 280,
            actions: 90
        }
    })

    useEffect(() => {
        localStorage.setItem('ge_athletes_col_widths_v2', JSON.stringify(colWidths))
    }, [colWidths])

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

    const handleAction = (action: string) => {
        toast.info(`Ação ${action} simulada com sucesso.`)
    }

    const handleDelete = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este atleta?")) {
            deleteAthlete(id)
        }
    }

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Background Gradients */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Atletas
                    </h2>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Gerencie os atletas cadastrados no sistema.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction('Exportar')}
                        className="backdrop-blur-sm bg-background/50 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                    >
                        <Download className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button
                        onClick={() => navigate('/area-do-produtor/atletas/novo')}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Atleta
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
                        placeholder="Pesquisar por nome ou CPF..."
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
                            <TableHead style={{ width: colWidths.sex }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('sex')}>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <span className="truncate">Naipe</span> {getSortIcon('sex')}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, 'sex')}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                                />
                            </TableHead>
                            <TableHead style={{ width: colWidths.dob }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('dob')}>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <span className="truncate">Data Nasc.</span> {getSortIcon('dob')}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, 'dob')}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                                />
                            </TableHead>
                            <TableHead style={{ width: colWidths.cpf }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('cpf')}>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <span className="truncate">CPF</span> {getSortIcon('cpf')}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, 'cpf')}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                                />
                            </TableHead>
                            <TableHead style={{ width: colWidths.event }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('event')}>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <span className="truncate">Evento</span> {getSortIcon('event')}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, 'event')}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                                />
                            </TableHead>
                            <TableHead style={{ width: colWidths.actions }} className="relative text-right font-semibold text-primary/80 h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentAthletes.length > 0 ? (
                            currentAthletes.map((athlete: any) => (
                                <TableRow
                                    key={athlete.id}
                                    className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                                >
                                    <TableCell className="font-medium h-12 py-0">
                                        <div className="flex items-center h-full">
                                            <User className="mr-2 h-4 w-4 text-primary/50" />
                                            <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                                                {athlete.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            {athlete.sex}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            {format(new Date(athlete.dob), 'dd/MM/yyyy')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs">
                                            {athlete.cpf}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex flex-col justify-center h-full gap-0.5">
                                            <span className="text-sm leading-tight truncate w-full" title={athlete.event}>
                                                {athlete.event}
                                            </span>
                                            <StatusLegendTooltip>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    {(() => {
                                                        const status = (athlete.adminStatus || 'RASCUNHO').toUpperCase()
                                                        let dotColor = 'bg-orange-500'
                                                        let label = 'Rascunho'

                                                        if (status === 'PUBLICADO') {
                                                            dotColor = 'bg-blue-500'
                                                            label = 'Publicado'
                                                        } else if (status === 'REABERTO') {
                                                            dotColor = 'bg-green-500'
                                                            label = 'Reaberto'
                                                        } else if (status === 'DESATIVADO' || status === 'CANCELADO') {
                                                            dotColor = 'bg-red-500'
                                                            label = 'Desativado'
                                                        } else if (status === 'SUSPENSO') {
                                                            dotColor = 'bg-gray-500'
                                                            label = 'Suspenso'
                                                        }

                                                        return (
                                                            <>
                                                                <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                                                                <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                                                                    {label}
                                                                </span>
                                                            </>
                                                        )
                                                    })()}
                                                </div>
                                            </StatusLegendTooltip>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right h-12 py-0">
                                        <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                                                onClick={() => navigate(`/area-do-produtor/atletas/${athlete.id}/modalidades`)}
                                                title="Vincular Modalidade"
                                            >
                                                <Trophy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                                                onClick={() => navigate(`/area-do-produtor/atletas/${athlete.id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                onClick={() => handleDelete(athlete.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Nenhum atleta encontrado.
                                </TableCell>
                            </TableRow>
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
