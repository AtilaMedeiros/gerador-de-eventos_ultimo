'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { PublicHeader } from '@/components/public/PublicHeader'
import { PublicFooter } from '@/components/public/PublicFooter'
import {
    Scale,
    Calendar,
    Download,
    User,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { mockEvents } from '@/mocks/events'
import { MOCK_REGULATIONS } from '@/mocks/communication'
import { CommunicationModal } from '@/components/public/CommunicationModal'

export default function EventRegulationsPage() {
    const params = useParams()
    const id = params?.id
    const slug = params?.slug

    // Fetch Logic (Simplified for Client Component)
    const eventFound = mockEvents.find(e => e.id === id)
    const eventName = eventFound?.name || slug || 'Evento'

    const eventRegulations = MOCK_REGULATIONS.filter((r) => r.eventId === id)
    const sortedRegulations = [...eventRegulations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const [selectedItem, setSelectedItem] = useState<any>(null)
    const closeModal = () => setSelectedItem(null)

    const getCategoryColorClass = (category: string) => {
        switch (category) {
            case 'Urgente': return "bg-red-50 text-red-700 border-red-200 ring-red-500/10"
            case 'Geral': return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10"
            case 'Específico': return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10"
            case 'Edital': return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10"
            case 'Código de Justiça': return "bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10"
            case 'Norma Complementar': return "bg-teal-50 text-teal-700 border-teal-200 ring-teal-500/10"
            default: return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/10"
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const EmptyState = ({ icon: Icon, title, message }: { icon: any, title: string, message: string }) => (
        <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-xl text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4 ring-1 ring-slate-200">
                <Icon className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 max-w-sm mx-auto">{message}</p>
        </div>
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SectionHeader = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
                    {title}
                </h2>
                <p className="text-slate-500 mt-2 text-lg ml-1">
                    {description}
                </p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 flex flex-col">
            {selectedItem && <CommunicationModal item={selectedItem} onClose={closeModal} getCategoryColorClass={getCategoryColorClass} />}

            <PublicHeader title={eventName as string} />

            {/* Hero Section */}
            <div className="relative bg-slate-950 text-white pt-24 pb-20 overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-10" />
                    <img
                        src={eventFound?.coverImage || "https://img.usecurling.com/p/1920/1080?q=books&color=blue"}
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
                                    className="aspect-square h-full flex flex-col rounded-xl bg-white p-6 text-slate-900 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group relative overflow-hidden cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn(
                                            "inline-flex items-center rounded-[5px] px-2.5 py-0.5 text-xs font-semibold border transition-colors ring-1",
                                            getCategoryColorClass(reg.category)
                                        )}>
                                            {reg.category}
                                        </div>
                                    </div>

                                    <h3 className="font-semibold tracking-tight text-[16px] mb-3 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {reg.title}
                                    </h3>

                                    <p className="text-slate-500 text-[13px] line-clamp-2 mb-4 flex-grow">
                                        {reg.description}
                                    </p>

                                    <div className="pt-4 border-t border-slate-100 mt-auto h-16 flex items-end">
                                        <div className="w-full flex justify-between items-end">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-[12.25px] text-slate-500">
                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                    <span>{format(new Date(reg.date), "dd 'de' MMM yyyy", { locale: ptBR })}</span>
                                                </div>
                                                {reg.author && (
                                                    <div className="flex items-center gap-2 text-[12.25px] text-slate-500">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                        <span className="truncate max-w-[150px]">{reg.author}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md mb-[-2px] ml-2 shrink-0 max-w-[160px]">
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
