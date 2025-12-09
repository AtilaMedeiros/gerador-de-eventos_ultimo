import { useRef, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { PublicFooter } from './components/PublicFooter'

import { Badge } from '@/components/ui/badge'
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3 text-foreground">
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
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {eventNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors",
                      notice.category === 'Urgente'
                        ? "bg-red-100 text-red-800 border-red-200"
                        : notice.category === 'Plantão'
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                    )}>
                      {notice.category}
                    </div>
                  </div>

                  <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {notice.title}
                  </h3>

                  <p className="text-muted-foreground text-[13px] line-clamp-2 mb-4 flex-grow">
                    {notice.description}
                  </p>

                  <div className="pt-4 border-t border-border mt-auto h-16 flex items-end">
                    <div className="w-full flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(notice.date, "dd 'de' MMM yyyy", { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{notice.time}</span>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md mb-[-2px] ml-2 shrink-0">
                        <Megaphone className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Ler aviso</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BOLETINS OFICIAIS */}
        <section id="boletins" ref={boletinsRef} className="scroll-mt-32">
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
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {eventBulletins.map((bulletin) => (
                <div
                  key={bulletin.id}
                  className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors",
                      "bg-emerald-100 text-emerald-800 border-emerald-200"
                    )}>
                      {bulletin.category}
                    </div>
                  </div>

                  <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {bulletin.title}
                  </h3>

                  <p className="text-muted-foreground text-[13px] line-clamp-2 mb-4 flex-grow">
                    {bulletin.description}
                  </p>

                  <div className="pt-4 border-t border-border mt-auto h-16 flex items-end">
                    <div className="w-full flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(bulletin.date, "dd 'de' MMM yyyy", { locale: ptBR })}</span>
                        </div>
                        {bulletin.author && (
                          <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                            <User className="w-4 h-4 text-primary" />
                            <span className="truncate max-w-[150px]">{bulletin.author}</span>
                          </div>
                        )}
                      </div>
                      <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md mb-[-2px] ml-2 shrink-0 max-w-[160px]">
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{bulletin.fileName}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* GALERIA DE RESULTADOS */}
        <section id="resultados" ref={resultadosRef} className="scroll-mt-32">
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
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {eventResults.map((result) => (
                <div
                  key={result.id}
                  className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors",
                      "bg-blue-100 text-blue-800 border-blue-200"
                    )}>
                      {result.category}
                    </div>
                  </div>

                  <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {result.title}
                  </h3>

                  <p className="text-muted-foreground text-[13px] line-clamp-2 mb-4 flex-grow">
                    {result.description || "Confira os resultados completos no documento anexo."}
                  </p>

                  <div className="pt-4 border-t border-border mt-auto h-16 flex items-end">
                    <div className="w-full flex justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(result.date, "dd 'de' MMM yyyy", { locale: ptBR })}</span>
                        </div>
                        {result.author && (
                          <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                            <User className="w-4 h-4 text-primary" />
                            <span className="truncate max-w-[150px]">{result.author}</span>
                          </div>
                        )}
                      </div>
                      <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md mb-[-2px] ml-2 shrink-0 max-w-[160px]">
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{result.fileName}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <PublicFooter eventName={eventName as string} />
    </div>
  )
}
