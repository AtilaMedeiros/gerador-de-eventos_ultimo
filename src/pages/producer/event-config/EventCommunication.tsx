import { useNavigate, useParams } from 'react-router-dom'
import { Megaphone, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommunicationContent } from './CommunicationContent'
import { useEvent } from '@/contexts/EventContext'

export default function EventCommunication() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { events } = useEvent()

    const event = events.find(e => e.id === id)

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10 px-4 md:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-8 pb-2 border-b border-border/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => navigate('/area-do-produtor/evento')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Megaphone className="h-6 w-6 text-primary" />
                            </div>
                            Central de Comunicação
                        </h2>
                    </div>
                    <p className="text-muted-foreground max-w-xl pl-10">
                        Gerenciando comunicação para: <span className="font-medium text-foreground">{event?.name || 'Evento não encontrado'}</span>
                    </p>
                </div>


            </div>

            {/* Content */}
            <div className="w-full">
                {id ? (
                    <CommunicationContent eventId={id} />
                ) : (
                    <div className="p-8 text-center text-muted-foreground">
                        ID do evento não fornecido.
                    </div>
                )}
            </div>
        </div>
    )
}
