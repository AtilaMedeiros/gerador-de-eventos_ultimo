'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { mockEvents } from '@/mocks/events'
import { PublicHeader } from './PublicHeader'
import { PublicHero } from './PublicHero'
import { PublicFooter } from './PublicFooter'
import { PublicPartners } from './PublicPartners'
import { PublicAbout } from './PublicAbout'
import { NewsCarousel } from './PublicNews'
import { Event } from '@/types/event'

export function EventPublicPage() {
    const params = useParams()
    const id = params?.id
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) {
            setLoading(false)
            return
        }

        // Simulate fetch logic (localStorage priority for new events)
        const storedEvents = typeof window !== 'undefined' ? localStorage.getItem('ge_events_v3') : null

        if (storedEvents) {
            try {
                const parsed = JSON.parse(storedEvents)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const found = parsed.find((e: any) => e.id === id)
                if (found) {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    setEvent({
                        ...found,
                        // Ensure dates are Date objects
                        startDate: new Date(found.startDate),
                        endDate: new Date(found.endDate),
                        registrationIndividualStart: found.registrationIndividualStart ? new Date(found.registrationIndividualStart) : undefined,
                        registrationIndividualEnd: found.registrationIndividualEnd ? new Date(found.registrationIndividualEnd) : undefined,
                        registrationCollectiveStart: found.registrationCollectiveStart ? new Date(found.registrationCollectiveStart) : undefined,
                        registrationCollectiveEnd: found.registrationCollectiveEnd ? new Date(found.registrationCollectiveEnd) : undefined,
                    } as Event)
                    setLoading(false)
                    return
                }
            } catch (error) {
                console.error('Error loading events from local storage', error)
            }
        }

        // Fallback to mocks
        const mockFound = mockEvents.find(e => e.id === id)
        if (mockFound) {
            setEvent(mockFound as Event)
        }
        setLoading(false)
    }, [id])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">Carregando...</div>
    }

    if (!event) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h1 className="text-2xl font-bold">Evento não encontrado</h1>
                <p className="text-slate-600">Verifique o endereço e tente novamente.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
            <PublicHeader title={event.name} />

            <main className="flex-1">
                <PublicHero
                    event={event}
                    plantaoItems={[]}
                />

                {/* News Section with mock data for now if empty */}
                <NewsCarousel news={[
                    {
                        id: '1',
                        title: 'Inscrições Abertas para Todas as Modalidades',
                        category: 'Geral',
                        description: 'Garanta sua participação no maior evento esportivo escolar do ano. As vagas são limitadas por modalidade.',
                        date: '10 de Dez 2025',
                        author: 'Coordenação'
                    },
                    {
                        id: '2',
                        title: 'Confira o Regulamento Atualizado',
                        category: 'Importante',
                        description: 'Novas regras para o Futsal e Vôlei foram adicionadas. Leiam atentamente o documento oficial.',
                        date: '08 de Dez 2025',
                        author: 'Técnica'
                    },
                    {
                        id: '3',
                        title: 'Tabela de Jogos - Primeira Fase',
                        category: 'Programação',
                        description: 'A tabela completa com horários e locais dos jogos da primeira fase já está disponível.',
                        date: '05 de Dez 2025',
                        author: 'Esportes'
                    },
                    {
                        id: '4',
                        title: 'Reunião Técnica Obrigatória',
                        category: 'Urgente',
                        description: 'Atenção técnicos: reunião obrigatória dia 15/12 para congresso técnico.',
                        date: '01 de Dez 2025',
                        author: 'Direção'
                    }
                ]} />

                <PublicAbout description={event.description} />

                <PublicPartners
                    realizers={event.realizerLogos || [
                        'https://upload.wikimedia.org/wikipedia/commons/2/2c/Logo_Prefeitura_de_Fortaleza.svg'
                    ]}
                    supporters={event.supporterLogos || [
                        'https://logodownload.org/wp-content/uploads/2019/08/secretaria-do-esporte-ceara-logo.png'
                    ]}
                />
            </main>

            <PublicFooter eventName={event.name} />
        </div>
    )
}
