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
import { Filters, createFilter, type Filter, type FilterFieldConfig } from '@/components/ui/filters'
import { Badge } from '@/components/ui/badge'
import {
    Search,
    Download,
    Plus,
    Edit,
    Trash2,
    School,
    User,
    MapPin,
    Hash,
    Trophy,
    Building,
    Activity,
    ListFilter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const MOCK_SCHOOLS = [
    {
        id: 1,
        name: 'Escola Municipal de Esportes',
        city: 'São Paulo',
        state: 'SP',
        responsible: 'João Silva',
        event: 'Tech Summit 2025',
        isEventActive: true,
        athletes: 45,
        inep: '11223344',
        athletesList: ['Pedro Santos', 'Maria Oliveira', 'Carlos Souza']
    },
    {
        id: 2,
        name: 'Colégio Estadual do Saber',
        city: 'Rio de Janeiro',
        state: 'RJ',
        responsible: 'Maria Santos',
        event: 'Jogos Estudantis 2025',
        isEventActive: false,
        athletes: 32,
        inep: '55667788',
        athletesList: ['Ana Lima', 'Beatriz Costa', 'Daniel Rocha']
    },
    {
        id: 3,
        name: 'Instituto Atlético',
        city: 'Belo Horizonte',
        state: 'MG',
        responsible: 'Pedro Costa',
        event: 'Tech Summit 2025',
        isEventActive: true,
        athletes: 60,
        inep: '99001122',
        athletesList: ['Lucas Pereira', 'Fernanda Alves', 'Gabriel Dias']
    },
]

const filterFields: FilterFieldConfig[] = [
    {
        key: 'name',
        label: 'Nome da Escola',
        icon: <School className="size-3.5" />,
        type: 'text',
        placeholder: 'Buscar por nome...',
    },
    {
        key: 'responsible',
        label: 'Responsável',
        icon: <User className="size-3.5" />,
        type: 'text',
        placeholder: 'Nome do responsável...',
    },
    {
        key: 'athlete',
        label: 'Atleta',
        icon: <User className="size-3.5" />,
        type: 'text',
        placeholder: 'Nome do atleta...',
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
        label: 'Evento Ativo',
        activeLabel: 'Evento',
        icon: <Activity className="size-3.5" />,
        type: 'boolean',
    },
    {
        key: 'city',
        label: 'Cidade',
        icon: <Building className="size-3.5" />,
        type: 'text',
        placeholder: 'Nome da cidade...',
    },
    {
        key: 'state',
        label: 'UF',
        icon: <MapPin className="size-3.5" />,
        type: 'text',
        placeholder: 'Sigla UF...',
    },
    {
        key: 'inep',
        label: 'INEP',
        icon: <Hash className="size-3.5" />,
        type: 'text',
        placeholder: 'Código INEP...',
    },
]

export default function SchoolsList() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<Filter[]>([
        createFilter('isEventActive', 'equals', 'true')
    ])

    // Apply Filters
    const filteredSchools = MOCK_SCHOOLS.filter(school => {
        // Global Search
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
            school.name.toLowerCase().includes(searchLower) ||
            school.responsible.toLowerCase().includes(searchLower) ||
            school.event.toLowerCase().includes(searchLower) ||
            school.city.toLowerCase().includes(searchLower) ||
            school.state.toLowerCase().includes(searchLower) ||
            school.inep?.includes(searchLower) ||
            school.athletesList?.some(athlete => athlete.toLowerCase().includes(searchLower))

        if (!matchesSearch) return false

        // Specific Filters
        if (filters.length === 0) return true

        return filters.every(filter => {
            const value = filter.value?.toString().toLowerCase() || ''
            if (value === '') return true // Ignore empty filters

            switch (filter.field) {
                case 'name':
                    return school.name.toLowerCase().includes(value)
                case 'responsible':
                    return school.responsible.toLowerCase().includes(value)
                case 'athlete':
                    return school.athletesList?.some(a => a.toLowerCase().includes(value))
                case 'event':
                    return school.event?.toLowerCase().includes(value)
                case 'isEventActive':
                    // If 'true' (checked), show only active events.
                    // If 'false' (unchecked), show all events (return true).
                    if (value === 'false') return true
                    const boolValue = value === 'true' || value === true
                    return school.isEventActive === boolValue
                case 'city':
                    return school.city.toLowerCase().includes(value)
                case 'state':
                    return school.state.toLowerCase().includes(value)
                case 'inep':
                    return school.inep?.includes(value)
                default:
                    return true
            }
        })
    })

    const [sortConfig, setSortConfig] = useState<{ key: keyof typeof MOCK_SCHOOLS[0] | 'location', direction: 'asc' | 'desc' } | null>(null)

    // Apply Sorting
    const sortedSchools = [...filteredSchools].sort((a, b) => {
        if (!sortConfig) return 0

        const { key, direction } = sortConfig

        let aValue: any = a[key as keyof typeof a]
        let bValue: any = b[key as keyof typeof b]

        // Handle specific sorting cases
        if (key === 'location') {
            aValue = `${a.city}/${a.state}`
            bValue = `${b.city}/${b.state}`
        }

        if (aValue < bValue) {
            return direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
            return direction === 'asc' ? 1 : -1
        }
        return 0
    })

    const requestSort = (key: keyof typeof MOCK_SCHOOLS[0] | 'location') => {
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
    const totalPages = Math.ceil(sortedSchools.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentSchools = sortedSchools.slice(startIndex, endIndex)

    // Reset page when filters change
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1)
    }

    // Column Resizing Logic
    const [colWidths, setColWidths] = useState<{ [key: string]: number }>(() => {
        const saved = localStorage.getItem('ge_schools_col_widths')
        return saved ? JSON.parse(saved) : {
            name: 300,
            location: 180,
            responsible: 200,
            event: 200,
            athletes: 100,
            actions: 100
        }
    })

    useEffect(() => {
        localStorage.setItem('ge_schools_col_widths', JSON.stringify(colWidths))
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

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Background Gradients */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Escolas
                    </h2>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Gerencie as escolas e instituições cadastradas.
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
                        onClick={() => navigate('/area-do-produtor/escolas/novo')}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nova Escola
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
                        placeholder="Pesquisar por escola, atleta, evento..."
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
                            <TableHead style={{ width: colWidths.location }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('location')}>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <span className="truncate">Cidade/UF</span> {getSortIcon('location')}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, 'location')}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                                />
                            </TableHead>
                            <TableHead style={{ width: colWidths.responsible }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('responsible')}>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <span className="truncate">Responsável</span> {getSortIcon('responsible')}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, 'responsible')}
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
                            <TableHead style={{ width: colWidths.athletes }} className="relative font-semibold text-primary/80 h-12 cursor-pointer hover:bg-primary/10 transition-colors text-center" onClick={() => requestSort('athletes')}>
                                <div className="flex items-center justify-center overflow-hidden">
                                    <span className="truncate">Atletas</span> {getSortIcon('athletes')}
                                </div>
                                <div
                                    onMouseDown={(e) => handleMouseDown(e, 'athletes')}
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 top-0 h-full w-1 hover:w-1.5 bg-border/0 hover:bg-primary/50 cursor-col-resize z-10"
                                />
                            </TableHead>
                            <TableHead style={{ width: colWidths.actions }} className="relative text-right font-semibold text-primary/80 h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentSchools.length > 0 ? (
                            currentSchools.map((school) => (
                                <TableRow
                                    key={school.id}
                                    className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                                >
                                    <TableCell className="font-medium h-12 py-0">
                                        <div className="flex items-center h-full">
                                            <School className="mr-2 h-4 w-4 text-primary/50" />
                                            <div className="flex flex-col">
                                                <span className="text-sm group-hover:text-primary transition-colors leading-tight">
                                                    {school.name}
                                                </span>
                                                {school.inep && (
                                                    <span className="text-[10px] text-muted-foreground">INEP: {school.inep}</span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            {school.city}/{school.state}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            {school.responsible}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className="text-muted-foreground leading-tight">
                                                {school.event}
                                            </span>
                                            {school.isEventActive ? (
                                                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium mt-0.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Ativo
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                                                    Encerrado
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex items-center justify-center h-full font-mono text-muted-foreground">
                                            {school.athletes}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right h-12 py-0">
                                        <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity h-full items-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                                                onClick={() => navigate(`/area-do-produtor/escolas/${school.id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                onClick={() => handleAction('Excluir')}
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
                                    Nenhuma escola encontrada com os filtros selecionados.
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
