'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, User, Settings, FileText } from 'lucide-react'

export default function ProducerDashboard() {
    const { user, logout } = useAuth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">Dashboard do Produtor</h1>
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
                                Perfil
                            </CardTitle>
                            <CardDescription>
                                Gerencie suas informações pessoais
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Email: {user?.email}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Eventos
                            </CardTitle>
                            <CardDescription>
                                Crie e gerencie eventos esportivos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">
                                Criar Novo Evento
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Settings className="mr-2 h-5 w-5" />
                                Configurações
                            </CardTitle>
                            <CardDescription>
                                Ajuste as configurações do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                Acessar Configurações
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Informação de Teste */}
                <Card className="mt-8 border-dashed">
                    <CardHeader>
                        <CardTitle>🎉 Parabéns! A migração está funcionando!</CardTitle>
                        <CardDescription>
                            Você está autenticado com cookies httpOnly e Server Actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm">✅ Next.js 16+ com App Router</p>
                        <p className="text-sm">✅ Autenticação com cookies httpOnly</p>
                        <p className="text-sm">✅ Middleware protegendo rotas</p>
                        <p className="text-sm">✅ Server Actions funcionando</p>
                        <p className="text-sm">✅ TailwindCSS 4 configurado</p>
                        <p className="text-sm">✅ shadcn-ui components instalados</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
