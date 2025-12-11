'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter, useParams } from 'next/navigation'
import { Save, Trophy, Loader2, X, Users, Ruler, Activity } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useModality } from '@/contexts/ModalityContext'

const modalitySchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    category: z.string().min(3, 'Categoria é obrigatória'), // Esporte principal ex: Futebol
    gender: z.enum(['Feminino', 'Masculino', 'Misto']),
    type: z.enum(['Coletiva', 'Individual']),
    eventCategory: z.string().optional(), // Categoria do evento ex: Sub-15
    minAge: z.coerce.number().min(0).optional(),
    maxAge: z.coerce.number().min(0).optional(),
    minAthletes: z.coerce.number().min(1).optional(),
    maxAthletes: z.coerce.number().min(1).optional(),
    maxTeams: z.coerce.number().min(0).optional(), // 0 = unlimited
    maxEventsPerAthlete: z.coerce.number().min(0).optional(),
})

type ModalityFormValues = z.infer<typeof modalitySchema>

export default function ModalityFormPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { modalities, createModality, updateModality } = useModality()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Client-side safety
    const [isClient, setIsClient] = useState(false)
    useEffect(() => setIsClient(true), [])

    const isEditing = id && id !== 'nova'
    const editingModality = isEditing && isClient ? modalities.find(m => m.id === id) : null

    const form = useForm<ModalityFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(modalitySchema) as any,
        defaultValues: {
            name: '',
            category: '',
            gender: 'Misto',
            type: 'Coletiva',
            eventCategory: '',
            minAge: 0,
            maxAge: 99,
            minAthletes: 1,
            maxAthletes: 20,
            maxTeams: 0,
            maxEventsPerAthlete: 1,
        },
    })

    useEffect(() => {
        if (isEditing && editingModality) {
            form.reset({
                name: editingModality.name,
                category: editingModality.category,
                gender: editingModality.gender as 'Misto' | 'Feminino' | 'Masculino',
                type: (editingModality.type as 'Coletiva' | 'Individual') || 'Coletiva',
                eventCategory: editingModality.eventCategory || '',
                minAge: editingModality.minAge || 0,
                maxAge: editingModality.maxAge || 99,
                minAthletes: editingModality.minAthletes || 1,
                maxAthletes: editingModality.maxAthletes || 20,
                maxTeams: editingModality.maxTeams || 0,
                maxEventsPerAthlete: editingModality.maxEventsPerAthlete || 1,
            })
        }
    }, [isEditing, editingModality, form])

    const onSubmit = async (data: ModalityFormValues) => {
        setIsSubmitting(true)
        try {
            const payload = {
                ...data,
                // Ensure numbers are numbers
                minAge: Number(data.minAge),
                maxAge: Number(data.maxAge),
                minAthletes: Number(data.minAthletes),
                maxAthletes: Number(data.maxAthletes),
                maxTeams: Number(data.maxTeams),
                maxEventsPerAthlete: Number(data.maxEventsPerAthlete),
            }

            if (isEditing && id) {
                await updateModality(id, payload)
                toast.success('Modalidade atualizada com sucesso!')
            } else {
                await createModality(payload)
                toast.success('Modalidade criada com sucesso!')
            }

            await new Promise(resolve => setTimeout(resolve, 500))
            router.push('/area-do-produtor/modalidades')
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao salvar modalidade.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const categories = [
        'Atletismo', 'Badminton', 'Basquetebol', 'Ciclismo', 'Futebol', 'Futsal',
        'Ginástica', 'Handebol', 'Judô', 'Karatê', 'Natação', 'Tênis de Mesa',
        'Voleibol', 'Vôlei de Praia', 'Xadrez'
    ]

    const handleTypeChange = (val: string) => {
        form.setValue('type', val as 'Coletiva' | 'Individual');
        // Set default athletes based on type
        if (val === 'Individual') {
            form.setValue('minAthletes', 1);
            form.setValue('maxAthletes', 1);
        } else {
            form.setValue('minAthletes', 5);
            form.setValue('maxAthletes', 20);
        }
    }

    if (!isClient) return null

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {isEditing ? 'Editar Modalidade' : 'Nova Modalidade'}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Configure as regras e categorias da modalidade.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/area-do-produtor/modalidades')}
                        disabled={isSubmitting}
                    >
                        <X className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-primary"
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-thin pb-6">
                <div className="max-w-4xl mx-auto">
                    <Form {...form}>
                        <form className="space-y-6">

                            {/* Basic Info */}
                            <div className="p-6 border rounded-xl bg-card shadow-sm space-y-6">
                                <div className="flex items-center gap-2 border-b pb-4">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                        <Trophy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Dados Principais</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Nome Exibição *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Futsal Sub-15 Masculino" {...field} className="text-lg font-medium" />
                                                </FormControl>
                                                <FormDescription>Nome completo que aparecerá nas tabelas</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Esporte Base *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="eventCategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Categoria do Evento</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Sub-15, Adulto" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-2">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Tipo de Modalidade</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={handleTypeChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-4"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors w-full">
                                                            <FormControl>
                                                                <RadioGroupItem value="Coletiva" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer flex-1">
                                                                Coletiva
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors w-full">
                                                            <FormControl>
                                                                <RadioGroupItem value="Individual" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer flex-1">
                                                                Individual
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Naipe/Sexo</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-4"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Masculino" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">M</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Feminino" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">F</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Misto" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">Misto</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Rules & Constraints using Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Age Rules */}
                                <div className="p-6 border rounded-xl bg-card shadow-sm space-y-6">
                                    <div className="flex items-center gap-2 border-b pb-4">
                                        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                                            <Ruler className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Faixa Etária (Anos)</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="minAge"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Mínima</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min={0} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <span className="pt-8 text-muted-foreground">-</span>
                                        <FormField
                                            control={form.control}
                                            name="maxAge"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Máxima</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min={0} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Participants Rules */}
                                <div className="p-6 border rounded-xl bg-card shadow-sm space-y-6">
                                    <div className="flex items-center gap-2 border-b pb-4">
                                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Participantes (Qtd)</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="minAthletes"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Mín. Atletas</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min={1} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <span className="pt-8 text-muted-foreground">-</span>
                                        <FormField
                                            control={form.control}
                                            name="maxAthletes"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>Máx. Atletas</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min={1} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Limits */}
                                <div className="p-6 border rounded-xl bg-card shadow-sm space-y-6 md:col-span-2">
                                    <div className="flex items-center gap-2 border-b pb-4">
                                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                                            <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <h3 className="font-semibold text-lg">Limites e Restrições</h3>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="maxTeams"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Máximo de Equipes (0 = Ilimitado)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min={0} {...field} />
                                                    </FormControl>
                                                    <FormDescription>Limite total de inscrições nesta modalidade</FormDescription>
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
                                                        <Input type="number" min={1} {...field} />
                                                    </FormControl>
                                                    <FormDescription>Quantas provas um atleta pode disputar</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
