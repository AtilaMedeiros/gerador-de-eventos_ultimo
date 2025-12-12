import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Loader2,
    School,
    Search,
    ArrowLeft,
    Save,
    MapPin,
    Phone,
    X
} from 'lucide-react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// Mock Municipality List
const MUNICIPALITIES = [
    'Fortaleza',
    'Caucaia',
    'Juazeiro do Norte',
    'Maracanaú',
    'Sobral',
    'Crato',
    'Itapipoca',
    'Maranguape',
    'Iguatu',
    'Quixadá',
]

const registerSchema = z
    .object({
        // Basic Info
        name: z.string().min(3, 'Nome é obrigatório'),
        inep: z.string().max(8, 'Máximo 8 caracteres').min(1, 'INEP é obrigatório'),
        cnpj: z.string().max(18, 'CNPJ inválido').min(14, 'CNPJ é obrigatório'),
        municipality: z.string().min(1, 'Selecione um município'),
        address: z.string().min(3, 'Endereço é obrigatório'),
        neighborhood: z.string().min(2, 'Bairro é obrigatório'),
        cep: z.string().min(8, 'CEP inválido').max(9, 'CEP inválido'),
        type: z.enum(['Publica', 'Privada']),
        sphere: z.enum(['Municipal', 'Estadual', 'Federal']),
        directorName: z.string().min(3, 'Nome do diretor é obrigatório'),

        // Contact Info
        landline: z.string().min(8, 'Telefone fixo é obrigatório'),
        mobile: z.string().min(9, 'Celular é obrigatório'),
        email: z.string().email('Email inválido'),
        password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function SchoolForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = id && id !== 'novo'
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoadingCep, setIsLoadingCep] = useState(false)

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            inep: '',
            cnpj: '',
            municipality: '',
            address: '',
            neighborhood: '',
            cep: '',
            type: 'Publica',
            sphere: 'Municipal',
            directorName: '',
            landline: '',
            mobile: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '')
        if (cep.length === 8) {
            setIsLoadingCep(true)
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                const data = await response.json()
                if (!data.erro) {
                    form.setValue('address', data.logradouro)
                    form.setValue('neighborhood', data.bairro)
                    form.setValue('municipality', data.localidade) // Might need mapping if select options are strict
                    toast.success('Endereço encontrado!')
                } else {
                    toast.error('CEP não encontrado.')
                }
            } catch {
                toast.error('Erro ao buscar CEP.')
            } finally {
                setIsLoadingCep(false)
            }
        }
    }

    async function onSubmit(_: RegisterFormValues) {
        setIsSubmitting(true)
        try {
            // Mock Registration API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            toast.success(isEditing ? 'Escola atualizada com sucesso!' : 'Escola cadastrada com sucesso!')
            navigate('/area-do-produtor/escolas')
        } catch {
            toast.error('Erro ao salvar escola. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col">
            {/* Premium Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/area-do-produtor/escolas')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {isEditing ? 'Editar Escola' : 'Nova Escola'}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {isEditing ? 'Atualize os dados da instituição.' : 'Cadastre uma nova instituição de ensino.'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/area-do-produtor/escolas')}
                    >
                        <X className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditing ? 'Salvar Alterações' : 'Salvar Escola'}
                    </Button>
                </div>
            </div>

            {/* Main Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-thin pb-6">
                <div className="max-w-5xl mx-auto">
                    <Form {...form}>
                        <form className="space-y-6">

                            {/* Basic Info Section */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <School className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Informações Básicas</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel>Nome da Escola</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Escola Municipal..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="inep"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Código INEP</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="00000000" maxLength={8} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cnpj"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CNPJ</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="00.000.000/0000-00" maxLength={18} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Tipo de Escola</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-4"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Publica" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Pública</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Privada" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Privada</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sphere"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel>Esfera Administrativa</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-4"
                                                    >
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Municipal" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Municipal</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Estadual" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Estadual</FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="Federal" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">Federal</FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="directorName"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel>Nome do Diretor(a)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome completo" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Endereço e Localização</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="cep"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CEP</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="00000-000"
                                                            maxLength={9}
                                                            {...field}
                                                            onBlur={handleCepBlur}
                                                        />
                                                    </FormControl>
                                                    {isLoadingCep && (
                                                        <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-primary" />
                                                    )}
                                                    {!isLoadingCep && field.value && (
                                                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground opacity-50" />
                                                    )}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel>Endereço</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Rua, Número..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="neighborhood"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bairro</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Bairro" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="municipality"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel>Município</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o município" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {MUNICIPALITIES.map((city) => (
                                                            <SelectItem key={city} value={city}>
                                                                {city}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Contact Section */}
                            <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Contato e Acesso</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="landline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Telefone Fixo</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(00) 0000-0000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="mobile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Celular / WhatsApp</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="(00) 90000-0000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="col-span-1 md:col-span-2">
                                                <FormLabel>E-mail Institucional</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="email@escola.com" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Este email será usado para login.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="******" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar Senha</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="******" {...field} />
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
