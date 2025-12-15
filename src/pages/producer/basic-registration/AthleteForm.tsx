import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, User, FileText, Shield, Loader2, X, Trophy, Building2, Check, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useParticipant, Athlete } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { INITIAL_SCHOOLS } from '@/backend/banco/escolas'
import { cn } from "@/lib/utils"

const athleteSchema = z.object({
    eventId: z.string().min(1, 'Selecione um evento'),
    schoolId: z.string().min(1, 'Selecione uma escola'),
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
    const { athletes, addAthlete, updateAthlete } = useParticipant()
    const { events } = useEvent()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [openEvent, setOpenEvent] = useState(false)
    const [openSchool, setOpenSchool] = useState(false)

    // Load Schools
    const [schools, setSchools] = useState<any[]>([])
    useEffect(() => {
        const stored = localStorage.getItem('ge_schools_list')
        setSchools(stored ? JSON.parse(stored) : INITIAL_SCHOOLS)
    }, [])

    // Filter Events (Rascunho or Publicado)
    const availableEvents = useMemo(() => {
        return events.filter(e => ['RASCUNHO', 'PUBLICADO'].includes(e.adminStatus))
    }, [events])

    const isEditing = id && id !== 'novo'
    const editingAthlete = useMemo(() =>
        isEditing ? athletes.find(a => a.id === id) : null
        , [isEditing, id, athletes])

    const form = useForm<AthleteFormValues>({
        resolver: zodResolver(athleteSchema),
        defaultValues: {
            eventId: '',
            schoolId: '',
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

    useEffect(() => {
        if (isEditing && editingAthlete) {
            form.reset({
                eventId: editingAthlete.eventId || '',
                schoolId: editingAthlete.schoolId || '',
                name: editingAthlete.name,
                sex: editingAthlete.sex,
                dob: format(new Date(editingAthlete.dob), 'yyyy-MM-dd'),
                rg: editingAthlete.rg || '',
                cpf: editingAthlete.cpf,
                nis: editingAthlete.nis || '',
                motherName: editingAthlete.motherName,
                motherCpf: editingAthlete.motherCpf
            })
        }
    }, [isEditing, editingAthlete, form])

    const onSubmit = async (data: AthleteFormValues) => {
        setIsSubmitting(true)
        try {
            const payload = {
                name: data.name,
                sex: data.sex,
                dob: new Date(data.dob + 'T12:00:00'),
                cpf: data.cpf,
                motherName: data.motherName,
                motherCpf: data.motherCpf,
                rg: data.rg,
                nis: data.nis,
                eventId: data.eventId,
                schoolId: data.schoolId
            }

            // Quick visual delay
            await new Promise(resolve => setTimeout(resolve, 500))

            if (isEditing && id) {
                updateAthlete(id, payload)
            } else {
                addAthlete(payload)
            }

            navigate('/area-do-produtor/atletas')
        } catch (error) {
            console.error(error)
            toast.error("Erro ao salvar atleta.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col animate-fade-in text-foreground px-4 md:px-0">
            {/* Premium Header */}
            <div className="flex items-center justify-between mb-6 shrink-0 pt-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg shadow-sm">
                        <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {isEditing ? 'Editar Atleta' : 'Novo Atleta'}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {isEditing ? 'Gerencie as informações detalhadas do atleta.' : 'Preencha os dados completos para o cadastro.'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/area-do-produtor/atletas')}
                        disabled={isSubmitting}
                        className="hidden sm:flex"
                    >
                        <X className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="shadow-md hover:shadow-lg transition-all"
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Salvar Atleta
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-thin pb-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    <Form {...form}>
                        <form className="space-y-6">

                            {/* Section 0: Vínculo */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2 border-b pb-2">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                        <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground/80">Vínculo & Afiliação</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="eventId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Evento *</FormLabel>
                                                <Popover open={openEvent} onOpenChange={setOpenEvent}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={openEvent}
                                                                className={cn(
                                                                    "w-full justify-between h-10 bg-background/50",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? availableEvents.find((event) => event.id === field.value)?.name
                                                                    : "Selecione o evento..."}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[400px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Buscar evento..." />
                                                            <CommandList>
                                                                <CommandEmpty>Nenhum evento encontrado.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {availableEvents.map((event) => (
                                                                        <CommandItem
                                                                            value={event.name}
                                                                            key={event.id}
                                                                            onSelect={() => {
                                                                                form.setValue("eventId", event.id)
                                                                                setOpenEvent(false)
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    event.id === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {event.name}
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="schoolId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Escola / Instituição *</FormLabel>
                                                <Popover open={openSchool} onOpenChange={setOpenSchool}>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={openSchool}
                                                                className={cn(
                                                                    "w-full justify-between h-10 bg-background/50",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value
                                                                    ? schools.find((school) => school.id === field.value)?.name
                                                                    : "Selecione a escola..."}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-[400px] p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Buscar escola..." />
                                                            <CommandList>
                                                                <CommandEmpty>Nenhuma escola encontrada.</CommandEmpty>
                                                                <CommandGroup>
                                                                    {schools.map((school) => (
                                                                        <CommandItem
                                                                            value={school.name}
                                                                            key={school.id}
                                                                            onSelect={() => {
                                                                                form.setValue("schoolId", school.id)
                                                                                setOpenSchool(false)
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    school.id === field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {school.name}
                                                                            <span className="ml-2 text-xs text-muted-foreground truncate">
                                                                                ({school.municipality})
                                                                            </span>
                                                                        </CommandItem>
                                                                    ))}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2 border-b pb-2">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                        <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground/80">Dados Pessoais</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel>Nome Completo *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome do atleta" {...field} className="bg-background/50" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                                        className="flex gap-6"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Feminino" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">Feminino</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Masculino" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal cursor-pointer">Masculino</FormLabel>
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
                                            <FormItem className="">
                                                <FormLabel>Data de Nascimento *</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} className="w-[180px] bg-background/50" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Documentation */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2 border-b pb-2">
                                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                                        <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground/80">Documentação</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                                        className="bg-background/50"
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
                                                <FormLabel>RG (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Número do RG" {...field} className="bg-background/50" />
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
                                                    <Input placeholder="Número NIS" {...field} className="bg-background/50" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Parent Info */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-2 border-b pb-2">
                                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                                        <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-foreground/80">Responsável Legal</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="motherName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do Responsável *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome completo" {...field} className="bg-background/50" />
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
                                                <FormLabel>CPF do Responsável *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="000.000.000-00"
                                                        maxLength={14}
                                                        {...field}
                                                        className="bg-background/50"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
