'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useModality } from '@/contexts/ModalityContext'
import { useEffect } from 'react'
import {
    ArrowLeft,
    ShieldCheck,
    Users,
    User,
    Trophy,
    LayoutList,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const formSchema = z.object({
    type: z.enum(['coletiva', 'individual']),
    name: z
        .string()
        .min(1, 'Nome é obrigatório')
        .max(255, 'Máximo de 255 caracteres'),
    gender: z.enum(['feminino', 'masculino', 'misto']),
    eventCategory: z.string().optional(),
    maxAthletes: z.coerce.number().min(1, 'Mínimo 1 atleta').max(999, 'Máximo 999'),
    minAthletes: z.coerce.number().min(1, 'Mínimo 1 atleta').max(999, 'Máximo 999'),
    maxEventsPerAthlete: z.coerce.number().min(0, 'Mínimo 0'),
    maxTeams: z.coerce.number().min(0, 'Mínimo 0'),
    minAge: z.coerce.number().min(0, 'Mínimo 0').max(99, 'Máximo 99 anos'),
    maxAge: z.coerce.number().min(0, 'Mínimo 0').max(99, 'Máximo 99 anos'),
})

type FormValues = z.infer<typeof formSchema>

interface ModalityFormProps {
    onSuccess?: () => void
    onCancel?: () => void
    isModal?: boolean
    modalityId?: string | null
}

export default function ModalityForm({ onSuccess, onCancel, isModal = false, modalityId }: ModalityFormProps) {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    // Ensure param ID is treated as string, fallback to empty string if undefined
    const paramId = typeof params?.id === 'string' ? params.id : undefined;

    const id = modalityId || paramId
    const returnTo = searchParams?.get('returnTo')
    const { createModality, updateModality, modalities } = useModality()

    const isEditing = !!id && id !== 'nova'

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            name: '',
            type: 'coletiva',
            gender: 'masculino',
            eventCategory: '',
            minAge: 0,
            maxAge: 99,
            minAthletes: 1,
            maxAthletes: 20,
            maxEventsPerAthlete: 1,
            maxTeams: 0,
        },
    })

    useEffect(() => {
        if (isEditing && id) {
            const modality = modalities.find(m => m.id === id)
            if (modality) {
                form.reset({
                    name: modality.name,
                    type: (modality.type as 'coletiva' | 'individual') || 'coletiva',
                    gender: (modality.gender as 'masculino' | 'feminino' | 'misto') || 'masculino',
                    eventCategory: modality.eventCategory || '',
                    minAthletes: modality.minAthletes ?? 1,
                    maxAthletes: modality.maxAthletes ?? 20,
                    maxEventsPerAthlete: modality.maxEventsPerAthlete ?? 1,
                    maxTeams: modality.maxTeams || 0,
                    minAge: modality.minAge ?? 0,
                    maxAge: modality.maxAge ?? 99,
                })
            }
        }
    }, [isEditing, id, modalities, form])

    const onSubmit = async (values: FormValues) => {
        try {
            const modalityData = {
                ...values,
                category: values.eventCategory || ''
            }

            if (isEditing && id) {
                await updateModality(id, modalityData)
            } else {
                await createModality(modalityData)
            }

            if (onSuccess) {
                onSuccess()
                return
            }

            if (returnTo) {
                router.push(returnTo)
            } else {
                router.push('/area-do-produtor/modalidades')
            }
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    return (
        <div className={cn("max-w-5xl mx-auto animate-fade-in", isModal ? "pb-6" : "pb-20")}>
            <div className="flex items-center gap-4 mb-6">
                {!isModal && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            returnTo ? router.push(returnTo) : router.push('/area-do-produtor/modalidades')
                        }
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                )}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Editar Modalidade' : 'Nova Modalidade'}
                    </h2>
                    <p className="text-muted-foreground">
                        Preencha as informações técnicas da modalidade esportiva.
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Info Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="shadow-sm border-primary/10">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                                            <Trophy className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                Dados Principais
                                            </CardTitle>
                                            <CardDescription>
                                                Identificação básica da modalidade.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome da Modalidade</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: Atletismo, Natação, Futsal..."
                                                        className="text-lg h-12"
                                                        maxLength={255}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Disputa</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Selecione o tipo" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="coletiva">
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                                    Coletiva (Equipe)
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="individual">
                                                                <div className="flex items-center gap-2">
                                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                                    Individual
                                                                </div>
                                                            </SelectItem>
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
                                                    <FormLabel>Gênero / Naipe</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11">
                                                                <SelectValue placeholder="Selecione o gênero" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="masculino">
                                                                Masculino
                                                            </SelectItem>
                                                            <SelectItem value="feminino">Feminino</SelectItem>
                                                            <SelectItem value="misto">Misto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="eventCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Especificação da Prova / Categoria
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Ex: 100m Rasos, Peso Pena (Opcional)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Utilizado para diferenciar provas de uma mesma
                                                    modalidade (ex: Natação).
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm border-primary/10">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                Regras de Elegibilidade
                                            </CardTitle>
                                            <CardDescription>
                                                Restrições de idade e quantidade de participantes.
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="minAge"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Idade Mínima (Anos)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="maxAge"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Idade Máxima (Anos)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Separator />

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="minAthletes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mín. Atletas por Equipe</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="maxAthletes"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Máx. Atletas por Equipe</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Settings Column */}
                        <div className="space-y-6">
                            <Card className="shadow-sm border-primary/10 h-full">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                                            <LayoutList className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Configurações</CardTitle>
                                            <CardDescription>Limites do evento.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">


                                    <FormField
                                        control={form.control}
                                        name="maxTeams"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Máximo de Equipes</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-11" {...field} />
                                                </FormControl>
                                                <FormDescription>Use 0 para ilimitado.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="maxEventsPerAthlete"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Máx. Provas por Atleta</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-11" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Quantas provas dessa modalidade um mesmo atleta pode
                                                    disputar.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => {
                                if (onCancel) {
                                    onCancel()
                                    return
                                }
                                if (returnTo) {
                                    router.push(returnTo)
                                } else {
                                    router.push('/area-do-produtor/modalidades')
                                }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-success hover:bg-success/90 min-w-[150px]"
                        >
                            {isEditing ? 'Atualizar' : 'Salvar Modalidade'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
