'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, User, Users, FileText } from 'lucide-react'
import Link from 'next/link'

export default function ParticipantHome() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">Área da Escola</h1>
                        <p className="text-muted-foreground mt-2">
                            Bem-vindo, {user?.name}!
                        </p>
                    </div>
                    <Button variant="outline" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Perfil da Escola
                            </CardTitle>
                            <CardDescription>
                                Gerencie informações da sua escola
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/area-do-participante/escola">
                                    Acessar Perfil
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                Atletas
                            </CardTitle>
                            <CardDescription>
                                Cadastre e gerencie seus atletas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/area-do-participante/atletas">
                                    Gerenciar Atletas
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Inscrições
                            </CardTitle>
                            <CardDescription>
                                Visualize fichas de inscrição
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/area-do-participante/fichas">
                                    Ver Fichas
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Card */}
                <Card className="mt-8 border-dashed">
                    <CardHeader>
                        <CardTitle>🎉 Área do Participante Ativa!</CardTitle>
                        <CardDescription>
                            Sistema de inscrição de atletas funcionando
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm">✅ Autenticação com cookies</p>
                        <p className="text-sm">✅ Navegação protegida</p>
                        <p className="text-sm">✅ Integração ViaCEP pronta</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
