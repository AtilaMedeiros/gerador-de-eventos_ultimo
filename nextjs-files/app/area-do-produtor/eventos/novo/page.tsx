'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEvent } from '@/contexts/EventContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const eventSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    slug: z.string().min(3, 'Slug deve ter no mínimo 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
    location: z.string().min(3, 'Local deve ter no mínimo 3 caracteres'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().min(1, 'Data de término é obrigatória'),
    logo: z.string().optional(),
})

type EventFormValues = z.infer<typeof eventSchema>

export default function NewEventPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { createEvent } = useEvent()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: '',
            slug: '',
            description: '',
            location: '',
            startDate: '',
            endDate: '',
            logo: '',
        },
    })

    // Auto-gerar slug do nome
    const watchName = form.watch('name')
    if (watchName && !form.getValues('slug')) {
        const slug = watchName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

        if (slug !== form.getValues('slug')) {
            form.setValue('slug', slug)
        }
    }

    async function onSubmit(data: EventFormValues) {
        setIsLoading(true)

        try {
            await createEvent(data)

            toast({
                title: 'Evento criado com sucesso!',
                description: `O evento "${data.name}" foi criado.`,
            })

            router.push('/area-do-produtor/eventos')
        } catch (error) {
            console.error('Erro ao criar evento:', error)
            toast({
                variant: 'destructive',
                title: 'Erro ao criar evento',
                description: 'Ocorreu um erro. Tente novamente.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/area-do-produtor/eventos">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Novo Evento</h1>
                    <p className="text-muted-foreground">Crie um novo evento esportivo</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações do Evento</CardTitle>
                    <CardDescription>
                        Preencha as informações básicas do seu evento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Evento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Campeonato Estadual de Futebol" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug (URL)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="campeonato-estadual-futebol" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            URL amigável gerada automaticamente. Pode ser editada.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva o evento..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Local</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: São Paulo - SP" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Início</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Término</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/area-do-produtor/eventos">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Criar Evento'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
