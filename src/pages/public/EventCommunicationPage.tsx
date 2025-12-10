import { useRef, useEffect, useState } from 'react'
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
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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

  // Sort Data: Newest first
  const sortedNotices = [...eventNotices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const sortedBulletins = [...eventBulletins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const sortedResults = [...eventResults].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const [selectedItem, setSelectedItem] = useState<any>(null)

  const closeModal = () => setSelectedItem(null)

  // Helper for category colors
  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'Urgente': return "bg-red-50 text-red-700 border-red-200 ring-red-500/10"
      case 'Plantão': return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10"
      case 'Informativo': return "bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/10"
      case 'Geral': return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10"
      case 'Programação': return "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/10"
      case 'Boletim Diário': return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10"
      case 'Específico': return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10"
      case 'Resultados Oficiais': return "bg-violet-50 text-violet-700 border-violet-200 ring-violet-500/10"
      case 'Resultado Geral': return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10"
      case 'Ranking': return "bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/10"
      case 'Classificação': return "bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/10"
      default: return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/10"
    }
  }

  // Modal Component
  const CommunicationDetailsModal = ({ item, onClose }: { item: any; onClose: () => void }) => {
    if (!item) return null

    const badgeColorClass = getCategoryColorClass(item.category)

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
        <div
          className="w-full max-w-[550px] bg-white h-[550px] flex flex-col rounded-xl text-card-foreground shadow-2xl border-2 border-orange-100 overflow-hidden text-left relative animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()} // Prevent close on click inside
        >
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
            <div className="pr-8">
              <div className={cn("inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border mb-3 ring-1", badgeColorClass)}>
                {item.category}
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto text-base text-muted-foreground leading-relaxed whitespace-pre-wrap p-6">
            {item.description}
          </div>

          <div className="flex flex-col gap-3 px-6 pb-6 pt-4 border-t border-border mt-auto bg-gray-50/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="text-base">
                {format(new Date(item.date), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
            {item.author && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="text-base">{item.author}</span>
              </div>
            )}
            {item.fileName && (
              <div className="mt-2 w-full">
                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-md w-full justify-center">
                  <Download className="w-4 h-4" />
                  Baixar {item.fileName}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

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
      {selectedItem && <CommunicationDetailsModal item={selectedItem} onClose={closeModal} />}

      <PublicHeader title={eventName as string} />

      {/* Hero Section */}
      <div className="relative bg-slate-950 text-white pt-24 pb-20 overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-10" />
          <img
            src={eventData?.coverImage || "https://img.usecurling.com/p/1920/1080?q=stadium%20night%20atmosphere&color=blue"}
            alt="Header Background"
            className="w-full h-full object-cover opacity-60 blur-md"
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white animate-in slide-in-from-bottom-4 duration-700 delay-200">
            Central de Informações
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
            Acompanhe em tempo real todas as novidades, resultados e documentos oficiais.
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 relative z-20 space-y-20 pb-32">

        {/* MURAL DE AVISOS */}
        <section id="avisos" ref={avisosRef} className="scroll-mt-32">
          <SectionHeader
            icon={Megaphone}
            title="Mural de Avisos"
            description="Acompanhe as últimas notas e informativos urgentes do evento."
          />

          {sortedNotices.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="Nenhum aviso publicado"
              message="Todos os avisos e comunicados importantes aparecerão aqui."
            />
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {sortedNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedItem(notice)}
                  className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors ring-1",
                      getCategoryColorClass(notice.category)
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

          {sortedBulletins.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhum boletim disponível"
              message="Os boletins oficiais serão listados aqui para download."
            />
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {sortedBulletins.map((bulletin) => (
                <div
                  key={bulletin.id}
                  onClick={() => setSelectedItem(bulletin)}
                  className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors ring-1",
                      getCategoryColorClass(bulletin.category)
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
                      <div className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md mb-[-2px] ml-2 shrink-0 max-w-[160px]">
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{bulletin.fileName}</span>
                      </div>
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

          {sortedResults.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="Resultados em breve"
              message="A tabela de resultados será atualizada conforme os jogos acontecem."
            />
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {sortedResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => setSelectedItem(result)}
                  className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors ring-1",
                      getCategoryColorClass(result.category)
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
                      <div className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md mb-[-2px] ml-2 shrink-0 max-w-[160px]">
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{result.fileName}</span>
                      </div>
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
