'use client'

import { useState, useEffect } from 'react'
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
    Trash2,
    School as SchoolIcon,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { mockSchools } from '@/mocks/schools'
import { mockEvents } from '@/mocks/events'
import { School } from '@/types/participant'
import { toast } from 'sonner'

const filterFields: FilterFieldConfig[] = [
    {
        key: 'name',
        label: 'Nome da Escola',
        icon: <SchoolIcon className="size-3.5" />,
        type: 'text',
        placeholder: 'Buscar por nome...',
    },
    {
        key: 'municipality',
        label: 'Município',
        icon: <MapPin className="size-3.5" />,
        type: 'text',
        placeholder: 'Fortaleza, Eusébio...',
    },
    {
        key: 'type',
        label: 'Tipo',
        icon: <SchoolIcon className="size-3.5" />,
        type: 'select',
        options: [
            { label: 'Pública', value: 'Publica', icon: <SchoolIcon className="size-3.5" /> },
            { label: 'Privada', value: 'Privada', icon: <SchoolIcon className="size-3.5" /> }
        ]
    }
]

export default function SchoolsPage() {
    const router = useRouter()

    // In a real app, this would come from a Context or API
    const [schools, setSchools] = useState<School[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // eslint-disable-next-line
        setSchools(mockSchools)
        setIsLoading(false)
    }, [])

    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState<Filter[]>([])

    // Apply Filters
    const filteredSchools = schools.filter((school) => {
        // Global Search
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
            school.name.toLowerCase().includes(searchLower) ||
            school.municipality.toLowerCase().includes(searchLower) ||
            school.email.toLowerCase().includes(searchLower) ||
            school.inep.includes(searchLower)

        if (!matchesSearch) return false

        // Specific Filters
        if (filters.length === 0) return true

        return filters.every(filter => {
            const value = filter.value?.toString().toLowerCase() || ''
            if (value === '') return true

            switch (filter.field) {
                case 'name':
                    return school.name.toLowerCase().includes(value)
                case 'municipality':
                    return school.municipality.toLowerCase().includes(value)
                case 'type':
                    return school.type.toLowerCase() === value
                default:
                    return true
            }
        })
    })

    // Pagination (Simple implementation)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(filteredSchools.length / itemsPerPage)
    const currentSchools = filteredSchools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const getEventName = (id?: string) => mockEvents.find(e => e.id === id)?.name || '-'

    const handleDelete = (id: string) => {
        setSchools(prev => prev.filter(s => s.id !== id))
        toast.success('Escola removida com sucesso.')
    }

    if (isLoading) return null

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
                        Gerencie as instituições de ensino cadastradas.
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
                        onClick={() => router.push('/area-do-produtor/escolas/nova')}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nova Escola
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[200px] relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        placeholder="Pesquisar por nome, inep, cidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-white/40 dark:bg-black/40 backdrop-blur-xl border-blue-200 dark:border-blue-800 focus:border-primary/30 focus:ring-primary/20 rounded-md transition-all shadow-sm group-hover:shadow-md text-left w-full"
                    />
                </div>

                <div className="flex bg-white text-black items-center gap-4 rounded-md">
                    <Filters
                        fields={filterFields}
                        filters={filters}
                        onChange={setFilters}
                        addButton={
                            <Button
                                size="icon"
                                className="h-10 w-10 p-0 rounded-md bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-blue-200 dark:border-blue-800 text-primary hover:bg-primary/5 hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
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

            {/* Table */}
            <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-white/30 dark:bg-black/30 backdrop-blur-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-primary/5">
                        <TableRow className="hover:bg-transparent border-b border-blue-100 dark:border-blue-900/30">
                            <TableHead className="font-semibold text-primary/80 h-12">Escola / INEP</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12 text-center">Tipo</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Diretor(a)</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Telefone</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Email</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Responsável</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12">Evento</TableHead>
                            <TableHead className="font-semibold text-primary/80 h-12 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentSchools.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-lg">
                                    Nenhuma escola encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentSchools.map((school) => (
                                <TableRow
                                    key={school.id}
                                    className="hover:bg-primary/5 transition-all duration-200 border-b border-blue-100 dark:border-blue-900/30 group"
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-sm group-hover:text-primary transition-colors">{school.name}</span>
                                            <span className="text-xs text-muted-foreground">INEP: {school.inep}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${school.type === 'Publica'
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            }`}>
                                            {school.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{school.directorName}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                            <span>{school.landline}</span>
                                            <span>{school.mobile}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-muted-foreground">{school.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{school.responsibleName || '-'}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">{getEventName(school.eventId)}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary rounded-full transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                                                onClick={() => handleDelete(school.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
