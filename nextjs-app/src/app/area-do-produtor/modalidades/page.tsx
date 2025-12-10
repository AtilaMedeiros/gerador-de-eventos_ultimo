'use client'

import { useState } from 'react'
import { useModality } from '@/contexts/ModalityContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trophy, Pencil, Trash2 } from 'lucide-react'
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

export default function ModalitiesListPage() {
    const { modalities, isLoading, deleteModality } = useModality()

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta modalidade?')) {
            await deleteModality(id)
        }
    }

    if (isLoading) {
        return <div className="p-8">Carregando modalidades...</div>
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Modalidades</h1>
                    <p className="text-muted-foreground">Gerencie as modalidades esportivas</p>
                </div>
                <Button asChild>
                    <Link href="/area-do-produtor/modalidades/nova">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Modalidade
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Suas Modalidades</CardTitle>
                    <CardDescription>
                        Lista de todas as modalidades cadastradas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {modalities.length === 0 ? (
                        <div className="text-center py-12">
                            <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">Nenhuma modalidade cadastrada</h3>
                            <p className="text-muted-foreground mt-2">Comece criando sua primeira modalidade</p>
                            <Button asChild className="mt-6">
                                <Link href="/area-do-produtor/modalidades/nova">
                                    Criar Primeira Modalidade
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Gênero</TableHead>
                                    <TableHead>Faixa Etária</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modalities.map((modality) => (
                                    <TableRow key={modality.id}>
                                        <TableCell className="font-medium">{modality.name}</TableCell>
                                        <TableCell>{modality.category}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                modality.gender === 'M' ? 'default' :
                                                    modality.gender === 'F' ? 'secondary' :
                                                        'outline'
                                            }>
                                                {modality.gender === 'M' ? 'Masculino' :
                                                    modality.gender === 'F' ? 'Feminino' :
                                                        'Misto'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {modality.minAge && modality.maxAge
                                                ? `${modality.minAge} - ${modality.maxAge} anos`
                                                : 'Livre'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/area-do-produtor/modalidades/${modality.id}/editar`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(modality.id)}
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
