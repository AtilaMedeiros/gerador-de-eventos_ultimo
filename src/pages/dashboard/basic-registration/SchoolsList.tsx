import { useState } from 'react'
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
    Activity
} from 'lucide-react'
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
        label: 'Status Evento',
        icon: <Activity className="size-3.5" />,
        type: 'select',
        options: [
            { label: 'Ativo', value: 'true' },
            { label: 'Encerrado', value: 'false' },
        ]
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
                    // Handle boolean string values 'true'/'false'
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
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 w-full relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        placeholder="Pesquisar por nome, atleta, evento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-12 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left"
                    />
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <Filters
                            fields={filterFields}
                            filters={filters}
                            onChange={setFilters}
                        />
                    </div>
                    {filters.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilters([])}
                            className="text-muted-foreground hover:text-destructive text-xs"
                        >
                            Limpar Filtros
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary/5">
                        <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
                            <TableHead className="font-semibold text-primary/80 h-12">Nome</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Cidade/UF</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Responsável</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Evento</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Atletas</TableHead>
                            <TableHead className="text-right font-semibold text-primary/80 h-12">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSchools.length > 0 ? (
                            filteredSchools.map((school) => (
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
                                        <div className="flex items-center h-full text-muted-foreground">
                                            {school.city}/{school.state}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex items-center h-full text-muted-foreground">
                                            {school.responsible}
                                        </div>
                                    </TableCell>
                                    <TableCell className="h-12 py-0">
                                        <div className="flex flex-col justify-center h-full">
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
                                        <div className="flex items-center h-full font-mono text-muted-foreground">
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
        </div>
    )
}
