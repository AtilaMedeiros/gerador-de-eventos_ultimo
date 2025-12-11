'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, User, Users, MapPin, Ticket, ArrowRight, Share2, AlertCircle } from 'lucide-react'
import { mockEvents } from '@/mocks/events'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EventPublicPage() {
    const params = useParams()
    const id = params?.id as string
    const [event, setEvent] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        // 1. Try local storage (latest version)
        const storedEvents = typeof window !== 'undefined' ? localStorage.getItem('ge_events_v3') : null

        if (storedEvents) {
            try {
                const parsed = JSON.parse(storedEvents)
                const found = parsed.find((e: any) => e.id === id)
                if (found) {
                    setEvent({
                        ...found,
                        // Ensure dates are Date objects
                        startDate: new Date(found.startDate),
                        endDate: new Date(found.endDate),
                        registrationIndividualStart: new Date(found.registrationIndividualStart || new Date()),
                        registrationIndividualEnd: new Date(found.registrationIndividualEnd || new Date()),
                        registrationCollectiveStart: new Date(found.registrationCollectiveStart || new Date()),
                        registrationCollectiveEnd: new Date(found.registrationCollectiveEnd || new Date()),
                    })
                    setLoading(false)
                    return
                }
            } catch (e) {
                console.error("Error parsing local storage", e)
            }
        }

        // 2. Fallback to mocks
        const mockFound = mockEvents.find(e => e.id === id)
        if (mockFound) {
            setEvent(mockFound)
        }

        setLoading(false)
    }, [id])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Carregando...</div>
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h1 className="text-2xl font-bold">Evento não encontrado</h1>
                <p className="text-slate-400">Verifique o endereço e tente novamente.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
            {/* Header (Simplified) */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 flex items-center">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="text-xl font-bold tracking-tight text-blue-700">
                        CONVIDA
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                        <a href="#" className="hover:text-blue-600 transition-colors">Início</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Eventos</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Entrar</a>
                    </nav>
                </div>
            </header>

            <main className="flex-1 pt-20">
                {/* HERO SECTION */}
                <section className="relative flex items-center justify-center overflow-hidden bg-slate-950 py-16 lg:py-28 min-h-[480px]">
                    {/* Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-10" />
                        <img
                            src={event.coverImage || 'https://img.usecurling.com/p/1920/1080?q=stadium%20night%20atmosphere&color=blue'}
                            alt="Event Background"
                            className="w-full h-full object-cover opacity-60 blur-md"
                        />
                    </div>

                    <div className="container mx-auto px-4 relative z-20 grid lg:grid-cols-2 gap-8 items-center">
                        {/* Left Content */}
                        <div className="space-y-6 text-white max-w-2xl">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight drop-shadow-lg">
                                {event.name}
                            </h1>

                            <div className="flex items-center gap-2 text-blue-200 font-medium text-lg">
                                <MapPin className="w-5 h-5" />
                                {event.location || 'Local a definir'}
                            </div>

                            <ul className="space-y-4 pt-2">
                                {/* Date */}
                                <li className="flex items-center gap-4 text-blue-50 text-base font-light group">
                                    <div className="p-2.5 bg-white/5 rounded-lg backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300">
                                        <Calendar className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="capitalize text-lg">
                                        {format(event.startDate, "dd 'de' MMMM", { locale: ptBR })} a {format(event.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </span>
                                </li>

                                {/* Individual Registration */}
                                <li className="flex items-center gap-4 text-blue-50 text-base font-light group">
                                    <div className="p-2.5 bg-white/5 rounded-lg backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300">
                                        <User className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-wider text-blue-300 font-bold opacity-80">Inscrição Individual</span>
                                        <span>
                                            Até {format(event.registrationIndividualEnd || new Date(), "dd/MM/yyyy", { locale: ptBR })}
                                        </span>
                                    </div>
                                </li>

                                {/* Collective Registration */}
                                <li className="flex items-center gap-4 text-blue-50 text-base font-light group">
                                    <div className="p-2.5 bg-white/5 rounded-lg backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300">
                                        <Users className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-wider text-blue-300 font-bold opacity-80">Inscrição Coletiva</span>
                                        <span>
                                            Até {format(event.registrationCollectiveEnd || new Date(), "dd/MM/yyyy", { locale: ptBR })}
                                        </span>
                                    </div>
                                </li>
                            </ul>

                            <div className="pt-6">
                                <button className="inline-flex items-center justify-center gap-2 h-14 bg-[#65a30d] hover:bg-[#65a30d]/90 text-white font-bold text-lg px-10 rounded-xl shadow-[0_10px_30px_rgba(101,163,13,0.4)] hover:shadow-[0_15px_40px_rgba(101,163,13,0.6)] transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto">
                                    <Ticket className="w-6 h-6" />
                                    INSCREVA-SE AGORA
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Image Card */}
                        <div className="hidden lg:block justify-self-end w-full max-w-xl">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video group">
                                <img
                                    src={event.coverImage || 'https://img.usecurling.com/p/1920/1080?q=event%20promo&color=blue'}
                                    alt={event.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                    <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-slate-900 font-bold rounded-full shadow-lg gap-2 backdrop-blur-sm">
                                        <Share2 className="w-4 h-4 text-blue-600" />
                                        COMPARTILHAR
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ABOUT SECTION */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6 relative inline-block">
                                    Sobre o Evento
                                    <span className="absolute -bottom-2 left-0 w-1/3 h-1.5 bg-blue-600 rounded-full"></span>
                                </h2>
                                <div className="prose prose-lg prose-slate max-w-none text-slate-600">
                                    {event.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: event.description }} />
                                    ) : (
                                        <p>Nenhuma descrição informada pelo organizador.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Info */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <MapPin className="text-blue-600" /> Localização Detalhada
                                </h3>
                                <p className="text-slate-600">
                                    {event.location}
                                </p>
                                <div className="mt-4 h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                                    Mapa indisponível
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                    <div className="container mx-auto px-4 text-center">
                        <p>&copy; {new Date().getFullYear()} {event.name}. Todos os direitos reservados.</p>
                        <p className="text-sm mt-2">Powered by Convida</p>
                    </div>
                </footer>
            </main>
        </div>
    )
}
