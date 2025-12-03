import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Users,
  UserCheck,
  ExternalLink,
  Ticket,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEvent } from '@/contexts/EventContext'
import { useParticipant } from '@/contexts/ParticipantContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function ParticipantHome() {
  const navigate = useNavigate()
  const { events } = useEvent()
  const { inscriptions, athletes } = useParticipant()

  const activeEvents = events.filter((e) => e.status === 'published')

  const openEventsCount = activeEvents.length
  const confirmedInscriptionsCount = inscriptions.length
  const totalAthletes = athletes.length

  const getInscriptionStatus = (eventId: string) => {
    const hasInscriptions = inscriptions.some((i) => i.eventId === eventId)
    return hasInscriptions ? 'Inscrito' : 'Disponível'
  }

  const handleOpenPublicPage = (event: any) => {
    const slug = generateSlug(event.name)
    window.open(`/evento/${slug}/${event.id}`, '_blank')
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-secondary to-primary rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Painel do Participante</h2>
          <p className="text-white/80 max-w-xl text-lg">
            Gerencie seus atletas, faça novas inscrições e acompanhe o status
            dos eventos em tempo real.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Eventos Abertos
            </CardTitle>
            <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {openEventsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Oportunidades de participação
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Minhas Inscrições
            </CardTitle>
            <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Ticket className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {confirmedInscriptionsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Vagas confirmadas
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-card hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Atletas Cadastrados
            </CardTitle>
            <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalAthletes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Base de talentos da escola
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">
            Eventos Disponíveis
          </h3>
        </div>
        <Card className="border shadow-card overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="pl-6">Evento</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeEvents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Nenhum evento com inscrições abertas no momento.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeEvents.map((event) => {
                    const status = getInscriptionStatus(event.id)
                    return (
                      <TableRow key={event.id} className="hover:bg-muted/10">
                        <TableCell className="pl-6 font-medium text-foreground">
                          {event.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(event.startDate, 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {event.location}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === 'Inscrito' ? 'secondary' : 'outline'
                            }
                            className={
                              status === 'Inscrito'
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-muted-foreground"
                              onClick={() => handleOpenPublicPage(event)}
                            >
                              <ExternalLink className="h-3 w-3" /> Info
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1 shadow-sm"
                              onClick={() =>
                                navigate(
                                  `/area-do-participante/atletas?eventId=${event.id}`,
                                )
                              }
                            >
                              {status === 'Inscrito'
                                ? 'Gerenciar'
                                : 'Inscrever-se'}
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
