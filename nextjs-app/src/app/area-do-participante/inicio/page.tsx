'use client'

import { useEffect, useState } from 'react'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Users,
    School,
    Trophy,
    Calendar,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ParticipantDashboard() {
    const router = useRouter()
    const { user } = useAuth()
    const { school, athletes, inscriptions, selectedEventId } = useParticipant()
    const { events } = useEvent()
    const [greeting, setGreeting] = useState('')

    const currentEvent = events.find(e => e.id === selectedEventId) || events[0]

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Bom dia')
        else if (hour < 18) setGreeting('Boa tarde')
        else setGreeting('Boa noite')
    }, [])

    const stats = {
        athletes: athletes.length,
        inscriptions: inscriptions.length,
        confirmed: inscriptions.filter(i => i.status === 'Confirmada').length,
        pending: inscriptions.filter(i => i.status === 'Pendente').length,
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        {greeting}, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Bem-vindo à área do participante
                    </p>
                </div>
                {currentEvent && (
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-xs">Evento Atual</CardDescription>
                            <CardTitle className="text-lg">{currentEvent.name}</CardTitle>
                        </CardHeader>
                    </Card>
                )}
            </div>

            {/* School Info */}
            {school && (
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <School className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>{school.name}</CardTitle>
                                <CardDescription>INEP: {school.inep} • {school.municipality}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/area-do-participante/escola')}
                            className="w-full md:w-auto"
                        >
                            Ver Perfil Completo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Atletas
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.athletes}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.athletes === 0 ? 'Nenhum atleta cadastrado' : 'atletas cadastrados'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Inscrições
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.inscriptions}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            inscrições em modalidades
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-green-200 dark:border-green-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Confirmadas
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            inscrições confirmadas
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-orange-200 dark:border-orange-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pendentes
                        </CardTitle>
                        <Clock className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            aguardando confirmação
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/area-do-participante/atletas')}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Gerenciar Atletas</CardTitle>
                                <CardDescription>
                                    Cadastre e gerencie os atletas da sua escola
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full">
                            Ver Atletas
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/area-do-participante/escola')}>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <School className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle>Perfil da Escola</CardTitle>
                                <CardDescription>
                                    Atualize os dados institucionais
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full">
                            Editar Perfil
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Event Info */}
            {currentEvent ? (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                                <CardTitle>Informações do Evento</CardTitle>
                                <CardDescription>{currentEvent.name}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Local:</span>
                            <span className="font-medium">{currentEvent.location || 'A definir'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Período:</span>
                            <span className="font-medium">
                                {currentEvent.startDate && currentEvent.endDate
                                    ? `${new Date(currentEvent.startDate).toLocaleDateString()} - ${new Date(currentEvent.endDate).toLocaleDateString()}`
                                    : 'A definir'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium text-green-600">Inscrições Abertas</span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/10">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            <div>
                                <CardTitle className="text-orange-900 dark:text-orange-100">
                                    Nenhum Evento Selecionado
                                </CardTitle>
                                <CardDescription>
                                    Selecione um evento no menu superior para começar
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            )}

            {/* Getting Started */}
            {stats.athletes === 0 && (
                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/10">
                    <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100">
                            🎯 Primeiros Passos
                        </CardTitle>
                        <CardDescription>
                            Siga estes passos para começar a usar o sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                1
                            </div>
                            <div>
                                <p className="font-medium">Complete o perfil da escola</p>
                                <p className="text-sm text-muted-foreground">
                                    Preencha todos os dados institucionais
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                2
                            </div>
                            <div>
                                <p className="font-medium">Cadastre seus atletas</p>
                                <p className="text-sm text-muted-foreground">
                                    Adicione os atletas que irão participar
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                                3
                            </div>
                            <div>
                                <p className="font-medium">Inscreva nas modalidades</p>
                                <p className="text-sm text-muted-foreground">
                                    Vincule os atletas às modalidades desejadas
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
