import { useRef, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { PublicFooter } from './components/PublicFooter'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Megaphone,
  FileText,
  Trophy,
  Clock,
  Download,
  Calendar,
  User,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useCommunication } from '@/contexts/CommunicationContext'
import { useEvent } from '@/contexts/EventContext'

export default function EventCommunicationPage() {
  const { slug, id } = useParams()
  const [searchParams] = useSearchParams()
  const { getEventById } = useEvent()
  const { notices, bulletins, results } = useCommunication()

  const eventData = id ? getEventById(id) : undefined
  const eventName = eventData?.name || slug || 'Evento'

  // Filter Data by Event ID
  const eventNotices = notices.filter((n) => n.eventId === id)
  const eventBulletins = bulletins.filter((b) => b.eventId === id)
  const eventResults = results.filter((r) => r.eventId === id)

  // Scroll to section based on 'tab' param (mapped to section IDs)
  const avisosRef = useRef<HTMLDivElement>(null)
  const boletinsRef = useRef<HTMLDivElement>(null)
  const resultadosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'avisos' && avisosRef.current) avisosRef.current.scrollIntoView({ behavior: 'smooth' })
    if (tab === 'boletins' && boletinsRef.current) boletinsRef.current.scrollIntoView({ behavior: 'smooth' })
    if (tab === 'resultados' && resultadosRef.current) resultadosRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [searchParams])


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
            src="https://img.usecurling.com/p/1920/600?q=stadium%20crowd&color=blue"
            alt="Header Background"
            className="w-full h-full object-cover opacity-20 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/60 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 animate-in slide-in-from-bottom-4 duration-700 delay-100">
            <Megaphone className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Canal Oficial de Comunicação
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white animate-in slide-in-from-bottom-4 duration-700 delay-200">
            Central de Informações
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
            Acompanhe em tempo real todas as novidades, resultados e documentos oficiais do evento.
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 -mt-10 relative z-20 space-y-20 pb-32">

        {/* MURAL DE AVISOS */}
        <section id="avisos" ref={avisosRef} className="scroll-mt-32">
          <div className="bg-card rounded-2xl border shadow-xl p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-700">
            <SectionHeader
              icon={Megaphone}
              title="Mural de Avisos"
              description="Acompanhe as últimas notas e informativos urgentes do evento."
            />

            {eventNotices.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="Nenhum aviso publicado"
                message="Todos os avisos e comunicados importantes aparecerão aqui."
              />
            ) : (
              <div className="grid gap-6">
                {eventNotices.map((notice) => (
                  <Card
                    key={notice.id}
                    className="group overflow-hidden border-l-4 border-l-primary hover:border-l-primary hover:shadow-lg transition-all duration-300"
                  >
                    <CardHeader className="pb-3 bg-muted/5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                'uppercase tracking-wider font-bold shadow-sm',
                                notice.category === 'Urgente'
                                  ? 'bg-red-500 hover:bg-red-600 text-white'
                                  : notice.category === 'Plantão'
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                    : notice.category === 'Últimas Notícias'
                                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                      : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20'
                              )}
                            >
                              {notice.category}
                            </Badge>
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 bg-background px-2 py-0.5 rounded-full border">
                              <Clock className="h-3 w-3" />
                              {format(notice.date, "dd 'de' MMM 'de' yyyy", { locale: ptBR })} às{' '}
                              {notice.time}
                            </span>
                          </div>
                          <CardTitle className="text-xl md:text-2xl text-foreground font-bold group-hover:text-primary transition-colors">
                            {notice.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardDescription className="text-foreground/80 text-base leading-relaxed whitespace-pre-line">
                        {notice.description}
                      </CardDescription>
                      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground border-t pt-4 border-dashed">
                        <User className="h-4 w-4 text-primary/70" />
                        <span className="font-medium">Publicado por {notice.author}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BOLETINS OFICIAIS */}
        <section id="boletins" ref={boletinsRef} className="scroll-mt-32">
          <div className="bg-card rounded-2xl border shadow-xl p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-700 delay-100">
            <SectionHeader
              icon={FileText}
              title="Boletins Oficiais"
              description="Balanços diários, programações e documentos para download."
            />

            {eventBulletins.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Nenhum boletim disponível"
                message="Os boletins oficiais serão listados aqui para download."
              />
            ) : (
              <div className="grid gap-4">
                {eventBulletins.map((bulletin) => (
                  <Card
                    key={bulletin.id}
                    className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                            {bulletin.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(bulletin.date, 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {bulletin.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {bulletin.description}
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          <span className="font-mono">{bulletin.fileName}</span>
                        </div>
                      </div>
                      <div className="bg-muted/10 border-t md:border-t-0 md:border-l p-6 flex flex-col items-center justify-center md:w-64 shrink-0 gap-3 group-hover:bg-primary/5 transition-colors">
                        <Button className="w-full shadow-sm font-semibold h-12 text-base" size="lg">
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

        {/* GALERIA DE RESULTADOS */}
        <section id="resultados" ref={resultadosRef} className="scroll-mt-32">
          <div className="bg-card rounded-2xl border shadow-xl p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <SectionHeader
              icon={Trophy}
              title="Galeria de Resultados"
              description="Confira os resultados oficiais e classificações das competições."
            />

            {eventResults.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="Resultados em breve"
                message="A tabela de resultados será atualizada conforme os jogos acontecem."
              />
            ) : (
              <div className="grid gap-4">
                {eventResults.map((result) => (
                  <Card
                    key={result.id}
                    className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-yellow-500"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              'shadow-sm bg-yellow-50 text-yellow-700 border-yellow-200'
                            )}
                          >
                            {result.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(result.date, "dd/MM/yyyy")}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          <span className="font-mono">{result.fileName}</span>
                        </div>
                      </div>
                      <div className="bg-muted/10 border-t md:border-t-0 md:border-l p-6 flex flex-col items-center justify-center md:w-64 shrink-0 gap-3 group-hover:bg-yellow-500/5 transition-colors">
                        <Button className="w-full shadow-sm font-semibold hover:bg-yellow-600 hover:text-white h-12 text-base" variant="outline">
                          <Download className="mr-2 h-5 w-5" />
                          Baixar Resultado
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
