import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { PublicFooter } from './components/PublicFooter'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Scale,
    Calendar,
    Download,
    FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useCommunication } from '@/contexts/CommunicationContext'
import { useEvent } from '@/contexts/EventContext'

export default function EventRegulationsPage() {
    const { slug, id } = useParams()
    const { getEventById } = useEvent()
    const { regulations } = useCommunication()

    const eventData = id ? getEventById(id) : undefined
    const eventName = eventData?.name || slug || 'Evento'

    // Filter Data by Event ID
    const eventRegulations = regulations.filter((r) => r.eventId === id)

    // Scroll ref (optional, but good for consistency)
    const regulationsRef = useRef<HTMLDivElement>(null)

    // Helper for empty states
    const EmptyState = ({
        icon: Icon,
        title,
        message,
    }: {
        icon: any
        title: string
        message: string
    }) => (
        <div className="flex flex-col items-center justify-center py-16 bg-muted/10 border-2 border-dashed border-muted rounded-xl text-center">
            <div className="bg-muted/30 p-4 rounded-full mb-4 ring-1 ring-border">
                <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">{message}</p>
        </div>
    )

    const SectionHeader = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-8">
            <div>
                <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    {title}
                </h2>
                <p className="text-muted-foreground mt-2 text-lg ml-1">
                    {description}
                </p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex flex-col">
            <PublicHeader title={eventName as string} />

            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white pt-32 pb-24 overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://img.usecurling.com/p/1920/600?q=books&color=blue"
                        alt="Header Background"
                        className="w-full h-full object-cover opacity-20 transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/60 to-background" />
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 animate-in slide-in-from-bottom-4 duration-700 delay-100">
                        <Scale className="h-4 w-4 text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider">
                            Documentação Oficial
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        Regulamentos
                    </h1>
                    <p className="text-slate-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        Consulte as regras oficiais, códigos de conduta e editais que regem o evento.
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 -mt-10 relative z-20 space-y-20 pb-32">

                {/* REGULAMENTOS */}
                <section id="regulamentos" ref={regulationsRef}>
                    <div className="bg-card rounded-2xl border shadow-xl p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-700">
                        <SectionHeader
                            icon={Scale}
                            title="Regulamentos e Editais"
                            description="Visualize e baixe os documentos normativos do evento."
                        />

                        {eventRegulations.length === 0 ? (
                            <EmptyState
                                icon={Scale}
                                title="Nenhum regulamento listado"
                                message="Os regulamentos e editais serão disponibilizados nesta seção."
                            />
                        ) : (
                            <div className="grid gap-4">
                                {eventRegulations.map((reg) => (
                                    <Card
                                        key={reg.id}
                                        className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            <div className="flex-1 p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'shadow-sm',
                                                            reg.category === 'Edital'
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                : 'bg-slate-50 text-slate-700 border-slate-200'
                                                        )}
                                                    >
                                                        {reg.category}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {format(reg.date, "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                    {reg.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                    {reg.description}
                                                </p>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5" />
                                                    <span className="font-mono">{reg.fileName}</span>
                                                </div>
                                            </div>
                                            <div className="bg-muted/10 border-t md:border-t-0 md:border-l p-6 flex flex-col items-center justify-center md:w-64 shrink-0 gap-3 group-hover:bg-primary/5 transition-colors">
                                                <Button className="w-full shadow-sm font-semibold h-12 text-base" variant="outline">
                                                    <Download className="mr-2 h-5 w-5" />
                                                    Baixar PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

            </main>

            <PublicFooter eventName={eventName as string} />
        </div>
    )
}
