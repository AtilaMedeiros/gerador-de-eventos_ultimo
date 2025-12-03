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
import { Search, ExternalLink, Eye } from 'lucide-react'
import { useState } from 'react'
import { useEvent } from '@/contexts/EventContext'
import { toast } from 'sonner'

// Mock Data for Schools in Event
const MOCK_SCHOOLS_IN_EVENT = [
  {
    id: '1',
    name: 'Escola Municipal do Saber',
    municipality: 'Fortaleza',
    athletes: 45,
    status: 'Ativo',
  },
  {
    id: '2',
    name: 'Colégio Avançar',
    municipality: 'Caucaia',
    athletes: 32,
    status: 'Ativo',
  },
  {
    id: '3',
    name: 'Instituto Educacional Futuro',
    municipality: 'Fortaleza',
    athletes: 12,
    status: 'Pendente',
  },
]

export default function EventSchools() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { getEventById } = useEvent()
  const event = eventId ? getEventById(eventId) : null
  const [search, setSearch] = useState('')

  const handleViewSchool = (schoolName: string) => {
    // Simulate viewing as school
    toast.info(`Acessando painel da escola: ${schoolName}`, {
      description: 'Simulação de acesso administrativo à área do participante.',
    })
    navigate('/area-do-participante/inicio')
  }

  const filteredSchools = MOCK_SCHOOLS_IN_EVENT.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.municipality.toLowerCase().includes(search.toLowerCase()),
  )

  if (!event) return <div>Evento não encontrado</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Escolas Inscritas
          </h2>
          <p className="text-muted-foreground">
            Gerencie as instituições participantes do evento{' '}
            <strong>{event.name}</strong>.
          </p>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center gap-2 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar escola ou município..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Escola</TableHead>
              <TableHead>Município</TableHead>
              <TableHead>Atletas Inscritos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchools.map((school) => (
              <TableRow key={school.id} className="hover:bg-muted/5">
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell>{school.municipality}</TableCell>
                <TableCell>{school.athletes}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      school.status === 'Ativo' ? 'default' : 'secondary'
                    }
                    className="bg-opacity-90"
                  >
                    {school.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => handleViewSchool(school.name)}
                  >
                    <Eye className="h-4 w-4" />
                    Acessar Painel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredSchools.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma escola encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
