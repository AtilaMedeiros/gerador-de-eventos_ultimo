'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
import {
    Search,
    Download,
    Plus,
    Edit,
    Trash2,
    User,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { useParticipant, Athlete } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { format } from 'date-fns'

export default function AthletesList() {
    const router = useRouter()
    const { athletes, deleteAthlete, selectedEventId } = useParticipant()
    const { events } = useEvent()
    const [searchTerm, setSearchTerm] = useState('')

    // Filtrar atletas
    const filteredAthletes = useMemo(() => {
        return athletes.filter(athlete => {
            const searchLower = searchTerm.toLowerCase()
            return (
                athlete.name.toLowerCase().includes(searchLower) ||
                athlete.cpf.includes(searchLower)
            )
        })
    }, [athletes, searchTerm])

    // Ordenação
    const [sortConfig, setSortConfig] = useState<{ key: keyof Athlete, direction: 'asc' | 'desc' } | null>(null)

    const sortedAthletes = useMemo(() => {
        if (!sortConfig) return filteredAthletes

        const sorted = [...filteredAthletes].sort((a, b) => {
            const { key, direction } = sortConfig
            const aValue: any = a[key]
            const bValue: any = b[key]

            if (aValue < bValue) return direction === 'asc' ? -1 : 1
            if (aValue > bValue) return direction === 'asc' ? 1 : -1
            return 0
        })
        return sorted
    }, [filteredAthletes, sortConfig])

    const requestSort = (key: keyof Athlete) => {
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

    // Paginação
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(sortedAthletes.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentAthletes = sortedAthletes.slice(startIndex, endIndex)

    const handleDelete = (id: string) => {
        if (confirm("Tem certeza que deseja excluir este atleta?")) {
            deleteAthlete(id)
        }
    }

    const handleExport = () => {
        toast.info('Exportação em desenvolvimento')
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Meus Atletas
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {athletes.length} atleta{athletes.length !== 1 ? 's' : ''} cadastrado{athletes.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                    >
                        <Download className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button
                        onClick={() => router.push('/area-do-participante/atletas/novo')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Atleta
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquisar por nome ou CPF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className="cursor-pointer hover:bg-accent/50"
                                onClick={() => requestSort('name')}
                            >
                                <div className="flex items-center">
                                    Nome {getSortIcon('name')}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-accent/50 text-center"
                                onClick={() => requestSort('sex')}
                            >
                                <div className="flex items-center justify-center">
                                    Sexo {getSortIcon('sex')}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-accent/50 text-center"
                                onClick={() => requestSort('dob')}
                            >
                                <div className="flex items-center justify-center">
                                    Data Nasc. {getSortIcon('dob')}
                                </div>
                            </TableHead>
                            <TableHead className="text-center">CPF</TableHead>
                            <TableHead className="text-center">RG</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentAthletes.length > 0 ? (
                            currentAthletes.map((athlete) => (
                                <TableRow key={athlete.id} className="hover:bg-accent/30">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4 text-primary/50" />
                                            {athlete.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {athlete.sex}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        {format(new Date(athlete.dob), 'dd/MM/yyyy')}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground font-mono text-xs">
                                        {athlete.cpf}
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground font-mono text-xs">
                                        {athlete.rg || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => router.push(`/area-do-participante/atletas/${athlete.id}/inscricao?eventId=${selectedEventId || (events.length > 0 ? events[0].id : '')}`)}
                                                title="Inscrever em Modalidade"
                                            >
                                                <Trophy className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => router.push(`/area-do-participante/atletas/${athlete.id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                                    {searchTerm ? 'Nenhum atleta encontrado.' : 'Nenhum atleta cadastrado. Clique em "Novo Atleta" para começar.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                        Mostrando {startIndex + 1} a {Math.min(endIndex, sortedAthletes.length)} de {sortedAthletes.length} atletas
                    </div>
                    <div className="flex items-center gap-2">
                        <span>
                            Página {currentPage} de {totalPages}
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
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
