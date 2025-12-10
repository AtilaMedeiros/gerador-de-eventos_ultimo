'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function AthletesPage() {
    const { user } = useAuth()

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Atletas</h1>
                    <p className="text-muted-foreground">Gerencie os atletas da sua escola</p>
                </div>
                <Button asChild>
                    <Link href="/area-do-participante/atletas/novo">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Novo Atleta
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seus Atletas</CardTitle>
                    <CardDescription>
                        Lista de todos os atletas cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">Nenhum atleta cadastrado</h3>
                        <p className="text-muted-foreground mt-2">
                            Comece cadastrando o primeiro atleta da sua escola
                        </p>
                        <Button asChild className="mt-6">
                            <Link href="/area-do-participante/atletas/novo">
                                Cadastrar Primeiro Atleta
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
