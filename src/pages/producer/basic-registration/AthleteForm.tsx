import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useParticipant } from '@/contexts/ParticipantContext'
import { format } from 'date-fns'

const athleteSchema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    sex: z.enum(['Feminino', 'Masculino']),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Data inválida',
    }),
    rg: z.string().optional(),
    cpf: z.string().min(11, 'CPF inválido').max(14),
    nis: z.string().optional(),
    motherName: z.string().min(3, 'Nome do Responsável é obrigatório'),
    motherCpf: z.string().min(11, 'CPF do Responsável inválido'),
})

type AthleteFormValues = z.infer<typeof athleteSchema>

export default function AthleteForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = id && id !== 'novo'
    const { athletes, addAthlete, updateAthlete } = useParticipant()

    const form = useForm<AthleteFormValues>({
        resolver: zodResolver(athleteSchema),
        defaultValues: {
            name: '',
            sex: 'Feminino',
            dob: '',
            rg: '',
            cpf: '',
            nis: '',
            motherName: '',
            motherCpf: '',
        },
    })

    // Load data for editing
    useEffect(() => {
        if (isEditing && id) {
            const athlete = athletes.find(a => a.id === id)
            if (athlete) {
                form.reset({
                    name: athlete.name,
                    sex: athlete.sex,
                    dob: format(new Date(athlete.dob), 'yyyy-MM-dd'),
                    rg: athlete.rg || '',
                    cpf: athlete.cpf,
                    nis: athlete.nis || '',
                    motherName: athlete.motherName,
                    motherCpf: athlete.motherCpf
                })
            } else {
                toast.error("Atleta não encontrado.")
                navigate('/area-do-produtor/atletas')
            }
        }
    }, [isEditing, id, athletes, form, navigate])

    const onSubmit = (data: AthleteFormValues) => {
        try {
            if (isEditing && id) {
                updateAthlete(id, {
                    name: data.name,
                    sex: data.sex,
                    dob: new Date(data.dob),
                    cpf: data.cpf,
                    motherName: data.motherName,
                    motherCpf: data.motherCpf,
                    rg: data.rg,
                    nis: data.nis
                })
            } else {
                addAthlete({
                    name: data.name,
                    sex: data.sex,
                    dob: new Date(data.dob),
                    cpf: data.cpf,
                    motherName: data.motherName,
                    motherCpf: data.motherCpf,
                    rg: data.rg,
                    nis: data.nis
                })
            }
            navigate('/area-do-produtor/atletas')
        } catch (error) {
            toast.error("Erro ao salvar atleta.")
            console.error(error)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pt-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/area-do-produtor/atletas')}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {isEditing ? 'Editar Atleta' : 'Novo Atleta'}
                    </h2>
                    <p className="text-muted-foreground">
                        {isEditing ? 'Atualize os dados do atleta.' : 'Preencha os dados para cadastrar um novo atleta.'}
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 bg-card p-6 rounded-lg border shadow-sm"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo *</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do atleta" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="sex"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Naipe *</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-4"
                                            value={field.value}
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Feminino" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Feminino</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Masculino" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Masculino</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="w-fit ml-auto">
                                    <FormLabel>Data de Nascimento *</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="w-[180px]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPF do Atleta *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="000.000.000-00"
                                            maxLength={14}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Deve ser único na escola.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rg"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>RG</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Número do RG" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nis"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>NIS (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Número NIS" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                        <FormField
                            control={form.control}
                            name="motherName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Responsável Legal *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="motherCpf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPF do Responsável Legal *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="000.000.000-00"
                                            maxLength={14}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/area-do-produtor/atletas')}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Atleta
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
