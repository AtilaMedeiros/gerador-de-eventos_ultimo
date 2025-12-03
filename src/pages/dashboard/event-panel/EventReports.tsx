import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEvent } from '@/contexts/EventContext'
import { BarChart, Users, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EventReports() {
  const { eventId } = useParams()
  const { getEventById } = useEvent()
  const event = eventId ? getEventById(eventId) : null

  if (!event) return <div>Evento não encontrado</div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Relatórios do Evento
          </h2>
          <p className="text-muted-foreground">
            Dados consolidados de <strong>{event.name}</strong>.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exportar PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Participação por Gênero
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground text-sm">
              Gráfico de Pizza (Simulado)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Inscrições por Dia
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground text-sm">
              Gráfico de Barras (Simulado)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
