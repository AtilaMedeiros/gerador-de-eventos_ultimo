'use client'

import { useState } from 'react'
import { useEvent } from '@/contexts/EventContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar, MapPin, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function EventsListPage() {
    const { events, isLoading, deleteEvent } = useEvent()

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            await deleteEvent(id)
        }
    }

    if (isLoading) {
        return <div className="p-8">Carregando eventos...</div>
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Eventos</h1>
                    <p className="text-muted-foreground">Gerencie todos os seus eventos esportivos</p>
                </div>
                <Button asChild>
                    <Link href="/area-do-produtor/eventos/novo">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Evento
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seus Eventos</CardTitle>
                    <CardDescription>
                        Lista de todos os eventos cadastrados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Nenhum evento cadastrado</h3>
                            <p className="text-muted-foreground mt-2">Comece criando seu primeiro evento esportivo</p>
                            <Button asChild className="mt-6">
                                <Link href="/area-do-produtor/eventos/novo">
                                    Criar Primeiro Evento
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Local</TableHead>
                                    <TableHead>Período</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                                {event.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">Ativo</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/area-do-produtor/eventos/${event.id}/editar`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(event.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
