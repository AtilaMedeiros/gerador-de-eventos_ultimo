import { useNavigate, useParams } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, Filter } from 'lucide-react'
import { useState } from 'react'
import { useEvent } from '@/contexts/EventContext'

// Mock Data for Athletes in Event
const MOCK_ATHLETES_IN_EVENT = [
    {
        id: '1',
        name: 'João Silva',
        school: 'Escola Municipal do Saber',
        modality: 'Futsal',
        category: 'Sub-12',
        status: 'Inscrito',
    },
    {
        id: '2',
        name: 'Maria Oliveira',
        school: 'Colégio Avançar',
        modality: 'Vôlei',
        category: 'Sub-14',
        status: 'Inscrito',
    },
    {
        id: '3',
        name: 'Pedro Santos',
        school: 'Escola Municipal do Saber',
        modality: 'Futsal',
        category: 'Sub-12',
        status: 'Pendente',
    },
    {
        id: '4',
        name: 'Ana Costa',
        school: 'Instituto Educacional Futuro',
        modality: 'Handebol',
        category: 'Sub-16',
        status: 'Inscrito',
    },
    {
        id: '5',
        name: 'Lucas Pereira',
        school: 'Colégio Avançar',
        modality: 'Basquete',
        category: 'Sub-14',
        status: 'Cancelado',
    },
]

export default function EventAthletes() {
    const { eventId } = useParams()
    const { getEventById } = useEvent()
    const event = eventId ? getEventById(eventId) : null
    const [search, setSearch] = useState('')

    const filteredAthletes = MOCK_ATHLETES_IN_EVENT.filter(
        (a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.school.toLowerCase().includes(search.toLowerCase()) ||
            a.modality.toLowerCase().includes(search.toLowerCase()),
    )

    if (!event) return <div>Evento não encontrado</div>

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Atletas Inscritos
                    </h2>
                    <p className="text-muted-foreground">
                        Visualize todos os atletas participantes do evento, independente da escola.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center gap-2 flex-1 max-w-md">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome, escola ou modalidade..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-none shadow-none focus-visible:ring-0"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros Avançados
                </Button>
            </div>

            <div className="rounded-md border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome do Atleta</TableHead>
                            <TableHead>Escola</TableHead>
                            <TableHead>Modalidade</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAthletes.map((athlete) => (
                            <TableRow key={athlete.id} className="hover:bg-muted/5">
                                <TableCell className="font-medium">{athlete.name}</TableCell>
                                <TableCell>{athlete.school}</TableCell>
                                <TableCell>{athlete.modality}</TableCell>
                                <TableCell>{athlete.category}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            athlete.status === 'Inscrito'
                                                ? 'default'
                                                : athlete.status === 'Pendente'
                                                    ? 'secondary'
                                                    : 'destructive'
                                        }
                                        className="bg-opacity-90"
                                    >
                                        {athlete.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">Ver detalhes</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredAthletes.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    Nenhum atleta encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
