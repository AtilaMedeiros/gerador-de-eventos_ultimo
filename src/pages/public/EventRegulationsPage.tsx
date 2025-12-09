import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { PublicFooter } from './components/PublicFooter'
import {
    Scale,
    Calendar,
    Download,
    FileText,
    User,
    X,
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

    // Sort Data: Newest first
    const sortedRegulations = [...eventRegulations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
            case 'Edital': return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10" // Specific for Regulations
            default: return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/10"
        }
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

    // Modal Component
    const CommunicationDetailsModal = ({ item, onClose }: { item: any; onClose: () => void }) => {
        if (!item) return null

        const badgeColorClass = getCategoryColorClass(item.category)

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={onClose}>
                <div
                    className="w-full max-w-[550px] bg-white h-[550px] flex flex-col rounded-xl text-card-foreground shadow-2xl border-2 border-orange-100 overflow-hidden text-left relative animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
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

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex flex-col">
            {selectedItem && <CommunicationDetailsModal item={selectedItem} onClose={closeModal} />}

            <PublicHeader title={eventName as string} />

            {/* Hero Section */}
            <div className="relative bg-slate-950 text-white pt-24 pb-20 overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-10" />
                    <img
                        src={eventData?.coverImage || "https://img.usecurling.com/p/1920/1080?q=books&color=blue"}
                        alt="Header Background"
                        className="w-full h-full object-cover opacity-60 blur-md"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        Regulamentos
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        Consulte as regras oficiais, códigos de conduta e editais que regem o evento.
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 py-12 relative z-20 space-y-20 pb-32">

                {/* REGULAMENTOS */}
                <section id="regulamentos">
                    <SectionHeader
                        icon={Scale}
                        title="Regulamentos e Editais"
                        description="Visualize e baixe os documentos normativos do evento."
                    />

                    {sortedRegulations.length === 0 ? (
                        <EmptyState
                            icon={Scale}
                            title="Nenhum regulamento listado"
                            message="Os regulamentos e editais serão disponibilizados nesta seção."
                        />
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                            {sortedRegulations.map((reg) => (
                                <div
                                    key={reg.id}
                                    onClick={() => setSelectedItem(reg)}
                                    className="aspect-square h-full flex flex-col rounded-xl bg-card p-6 text-card-foreground shadow-sm border hover:border-primary/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn(
                                            "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors ring-1",
                                            getCategoryColorClass(reg.category)
                                        )}>
                                            {reg.category}
                                        </div>
                                    </div>

                                    <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {reg.title}
                                    </h3>

                                    <p className="text-muted-foreground text-[13px] line-clamp-2 mb-4 flex-grow">
                                        {reg.description}
                                    </p>

                                    <div className="pt-4 border-t border-border mt-auto h-16 flex items-end">
                                        <div className="w-full flex justify-between items-end">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span>{format(reg.date, "dd 'de' MMM yyyy", { locale: ptBR })}</span>
                                                </div>
                                                {reg.author && (
                                                    <div className="flex items-center gap-2 text-[12.25px] text-muted-foreground">
                                                        <User className="w-4 h-4 text-primary" />
                                                        <span className="truncate max-w-[150px]">{reg.author}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <a href="#" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md mb-[-2px] ml-2 shrink-0 max-w-[160px]">
                                                <Download className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{reg.fileName}</span>
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
