'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useModality } from '@/contexts/ModalityContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const modalitySchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    category: z.string().min(3, 'Categoria é obrigatória'),
    gender: z.enum(['M', 'F', 'Misto'], { required_error: 'Gênero é obrigatório' }),
    minAge: z.coerce.number().min(0).max(100).optional(),
    maxAge: z.coerce.number().min(0).max(100).optional(),
})

type ModalityFormValues = z.infer<typeof modalitySchema>

export default function NewModalityPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { createModality } = useModality()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ModalityFormValues>({
        resolver: zodResolver(modalitySchema),
        defaultValues: {
            name: '',
            category: '',
            gender: 'Misto',
        },
    })

    async function onSubmit(data: ModalityFormValues) {
        setIsLoading(true)

        try {
            await createModality(data)

            toast({
                title: 'Modalidade criada com sucesso!',
                description: `A modalidade "${data.name}" foi criada.`,
            })

            router.push('/area-do-produtor/modalidades')
        } catch (error) {
            console.error('Erro ao criar modalidade:', error)
            toast({
                variant: 'destructive',
                title: 'Erro ao criar modalidade',
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
                    <Link href="/area-do-produtor/modalidades">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Nova Modalidade</h1>
                    <p className="text-muted-foreground">Crie uma nova modalidade esportiva</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informações da Modalidade</CardTitle>
                    <CardDescription>
                        Preencha os dados da modalidade
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
                                        <FormLabel>Nome da Modalidade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Futebol Sub-15" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoria</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma categoria" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Futebol">Futebol</SelectItem>
                                                <SelectItem value="Futsal">Futsal</SelectItem>
                                                <SelectItem value="Vôlei">Vôlei</SelectItem>
                                                <SelectItem value="Basquete">Basquete</SelectItem>
                                                <SelectItem value="Handebol">Handebol</SelectItem>
                                                <SelectItem value="Atletismo">Atletismo</SelectItem>
                                                <SelectItem value="Natação">Natação</SelectItem>
                                                <SelectItem value="Judô">Judô</SelectItem>
                                                <SelectItem value="Xadrez">Xadrez</SelectItem>
                                                <SelectItem value="Tênis de Mesa">Tênis de Mesa</SelectItem>
                                                <SelectItem value="Outros">Outros</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gênero</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="M">Masculino</SelectItem>
                                                <SelectItem value="F">Feminino</SelectItem>
                                                <SelectItem value="Misto">Misto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="minAge"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Idade Mínima (opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ex: 15" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Deixe em branco se não houver restrição
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maxAge"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Idade Máxima (opcional)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Ex: 18" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Deixe em branco se não houver restrição
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/area-do-produtor/modalidades">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Criar Modalidade'
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
