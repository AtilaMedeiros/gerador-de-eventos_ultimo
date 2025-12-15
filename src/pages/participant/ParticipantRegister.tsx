import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, School, Search, ArrowLeft, Check, User, Building, Phone, MapPin, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { INITIAL_SCHOOLS } from '@/backend/banco/escolas'

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
  Card,
  CardContent,
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { UserService } from '@/backend/services/user.service'
import { AuthService } from '@/backend/services/auth.service'
import { SchoolService } from '@/backend/services/school.service'

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

// --- Schemas ---

const step1Schema = z.object({
  // School Info
  schoolName: z.string().min(3, 'Nome é obrigatório'),
  inep: z.string().max(8, 'Máximo 8 caracteres').min(1, 'INEP é obrigatório'),
  cnpj: z.string().max(18, 'CNPJ inválido').min(14, 'CNPJ é obrigatório'),
  type: z.enum(['Publica', 'Privada']),
  sphere: z.enum(['Municipal', 'Estadual', 'Federal']),
  directorName: z.string().min(3, 'Nome do diretor é obrigatório'),

  // Location
  cep: z.string().min(8, 'CEP inválido'),
  address: z.string().min(3, 'Endereço é obrigatório'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  municipality: z.string().min(1, 'Selecione um município'),

  // School Contact
  landline: z.string().optional(),
  schoolMobile: z.string().min(9, 'Celular inválido'),
})

const baseStep2Schema = z.object({
  // Responsible Info
  responsibleName: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  mobile: z.string().min(9, 'Celular/WhatsApp é obrigatório'), // WhatsApp
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
})

const step2Schema = baseStep2Schema.refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

// Combined Schema for type definition
// We merge with baseStep2Schema to avoid ZodEffects issues in merge
const combinedSchema = step1Schema.merge(baseStep2Schema)
type RegisterFormValues = z.infer<typeof combinedSchema>

// Steps Definition
const steps = [
  {
    id: 1,
    title: 'Dados da Escola',
    description: 'Informações da Instituição',
    icon: School,
  },
  {
    id: 2,
    title: 'Dados do Responsável',
    description: 'Acesso e Contato',
    icon: User,
  },
]

export default function ParticipantRegister() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()
  const urlEventId = searchParams.get('eventId')
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver((step === 1 ? step1Schema : step2Schema) as any),
    mode: 'onChange',
    defaultValues: {
      schoolName: '',
      inep: '',
      cnpj: '',
      type: 'Publica',
      sphere: 'Municipal',
      directorName: '',
      cep: '',
      address: '',
      neighborhood: '',
      municipality: '',
      landline: '',
      schoolMobile: '',
      responsibleName: '',
      cpf: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // CEP Handler (Step 1)
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
          form.setValue('municipality', data.localidade)
          toast.success('Endereço encontrado!')
        } else {
          toast.error('CEP não encontrado.')
        }
      } catch (error) {
        toast.error('Erro ao buscar CEP.')
      } finally {
        setIsLoadingCep(false)
      }
    }
  }

  const handleNext = async () => {
    // Validate Step 1 Fields explicitly
    const step1Fields = Object.keys(step1Schema.shape) as Array<keyof typeof step1Schema.shape>
    // We cast to any to avoid generic key issues with trigger, or use specific list if reliable
    const isValid = await form.trigger(step1Fields as any)

    if (isValid) {
      // --- DUPLICATION CHECK ---
      try {
        const inep = form.getValues().inep
        let activeEventId = urlEventId || '1'

        // Resolve Event ID identically to onSubmit logic to ensure consistency
        const storedEvents = localStorage.getItem('ge_events')
        if (storedEvents) {
          try {
            const parsedEvents = JSON.parse(storedEvents)
            if (urlEventId) {
              // If URL param exists, it takes precedence (assuming it's valid)
            } else {
              // Fallback logic
              const bestEvent = parsedEvents.find((e: any) => e.status === 'published') || parsedEvents[0]
              if (bestEvent) activeEventId = bestEvent.id
            }
          } catch (e) { }
        }

        SchoolService.validateRegistration(inep, activeEventId)
      } catch (validationError: any) {
        toast.error(validationError.message)
        return // Prevent proceeding to Step 2
      }

      setStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  // MOCK_SCHOOLS import moved to top of file in previous steps or needs to be here if not already
  // ... existing code ...

  // ... existing code ...

  const onSubmit = async (values: RegisterFormValues) => {
    // Zod resolver with partial schema might strip fields from 'values'.
    // Use getValues() to ensure we have data from all steps.
    const data = form.getValues()

    setIsSubmitting(true)
    try {
      // Simulate API Call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 1. Get Active Event to link
      // Priority: URL Param > Storage Selected > Default

      const storedEvents = localStorage.getItem('ge_events')
      let activeEventId = urlEventId || '1' // Default if nothing else
      let activeEventName = 'Tech Summit 2025' // Fallback name

      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents)
          // If we have an ID, find that specific event
          if (activeEventId) {
            const targetEvent = parsedEvents.find((e: any) => e.id === activeEventId)
            if (targetEvent) {
              activeEventName = targetEvent.name
            }
          } else {
            // Fallback to published if no ID was passed
            const bestEvent = parsedEvents.find((e: any) => e.status === 'published') || parsedEvents[0]
            if (bestEvent) {
              activeEventId = bestEvent.id
              activeEventName = bestEvent.name
            }
          }
        } catch (e) { }
      }

      // --- DUPLICATION CHECK ---
      // Verify if INEP is already registered for this Event
      const dupCheckEventId = activeEventId
      try {
        // Using explicit service method that uses INEP as unique identifier
        SchoolService.validateRegistration(data.inep, dupCheckEventId)
      } catch (validationError: any) {
        toast.error(validationError.message)
        setIsSubmitting(false)
        return
      }

      // 2. Prepare IDs upfront
      const newSchoolId = crypto.randomUUID()
      // We don't generate userId manually because UserService does it, 
      // but we need the user to link. So we rely on UserService returning the user.

      // 3. Create User First (to get ID) OR Create School First (to get ID)?
      // User needs schoolId. School needs responsibleId. Circular dependency if we are strict.
      // Solution: Generate School ID first. Create User with School ID. Then Create School with User ID.

      const role = 'participant'
      const newUser = UserService.createUser(null, {
        name: data.responsibleName,
        email: data.email,
        role: role,
        phone: data.mobile,
        cpf: data.cpf,
        schoolId: newSchoolId, // Link User -> School
        // Add extra fields if compatible with User interface or cast
      } as any)

      // 4. Create School Object
      const newSchool = {
        id: newSchoolId,
        name: data.schoolName,
        inep: data.inep,
        cnpj: data.cnpj,
        type: data.type,
        sphere: data.sphere,
        directorName: data.directorName,
        // Location
        municipality: data.municipality,
        address: data.address,
        neighborhood: data.neighborhood,
        cep: data.cep,
        // Contact
        landline: data.landline || '',
        mobile: data.schoolMobile,
        email: data.email,
        responsibleName: data.responsibleName,
        responsibleId: newUser.id, // Link School -> User
        // Link Event
        eventId: activeEventId,
        eventName: activeEventName,
        eventIds: [activeEventId], // Modern array support
        athletesList: [], // Initialize empty list
      }

      // 5. Save School to Global List
      const storedList = localStorage.getItem('ge_schools_list')
      let currentList = storedList ? JSON.parse(storedList) : [...INITIAL_SCHOOLS]

      const existingSchoolIndex = currentList.findIndex((s: any) => s.inep === newSchool.inep)

      if (existingSchoolIndex >= 0) {
        // MERGE STRATEGY
        const existingSchool = currentList[existingSchoolIndex]

        // 1. Link new event to existing school
        const mergedEventIds = new Set(existingSchool.eventIds || [])
        if (existingSchool.eventId) mergedEventIds.add(existingSchool.eventId)
        mergedEventIds.add(activeEventId)

        const updatedSchool = {
          ...existingSchool,
          eventIds: Array.from(mergedEventIds),
        }
        currentList[existingSchoolIndex] = updatedSchool
        localStorage.setItem('ge_schools_list', JSON.stringify(currentList))

        // 2. Fix the user we just created to point to the OLD school ID
        const allUsers = JSON.parse(localStorage.getItem('ge_users') || '[]')
        const userIndex = allUsers.findIndex((u: any) => u.id === newUser.id)
        if (userIndex >= 0) {
          allUsers[userIndex].schoolId = existingSchool.id
          localStorage.setItem('ge_users', JSON.stringify(allUsers))
        }

        // 3. Update Session
        localStorage.setItem('ge_school_data', JSON.stringify(updatedSchool))

      } else {
        // NEW STRATEGY
        currentList.push(newSchool)
        localStorage.setItem('ge_schools_list', JSON.stringify(currentList))
        localStorage.setItem('ge_school_data', JSON.stringify(newSchool))
      }

      // Login
      await login(data.email, data.password)

      toast.success('Cadastro realizado com sucesso!')
      navigate('/area-do-participante/inicio')
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Erro ao realizar cadastro.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navigation Bar Component-ish */}
      <div className="border-b bg-white z-10 sticky top-0 shadow-sm">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="pl-0 hover:bg-transparent hover:text-primary gap-2"
            onClick={() => {
              if (step === 2) handleBack()
              else navigate('/area-do-participante/login')
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 1 ? 'Voltar para Login' : 'Voltar para Etapa 1'}
          </Button>

          <div className="text-sm font-medium text-muted-foreground mr-4 hidden md:block">
            Passo {step} de 2
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-12 px-4">

        {/* Wizard Progress Header */}
        <div className="w-full max-w-4xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="min-w-[200px]">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {step === 1 ? 'Cadastro da Escola' : 'Cadastro do Responsável'}
              </h2>
              <p className="text-muted-foreground text-sm">
                {step === 1 ? 'Dados institucionais da escola.' : 'Dados de acesso do gestor.'}
              </p>
            </div>

            {/* Separator */}
            <div className="hidden md:block h-10 w-px bg-border mx-4" />

            {/* Stepper Visuals */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 rounded-full" />
                <ol className="relative z-10 flex justify-between w-full">
                  {steps.map((s) => {
                    const isActive = s.id === step
                    const isCompleted = s.id < step

                    return (
                      <li key={s.id} className="flex flex-col items-center bg-gray-50 px-2 first:pl-0 last:pr-0">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                            isActive && 'border-primary bg-primary text-primary-foreground scale-110 shadow-md',
                            isCompleted && 'border-primary bg-primary text-primary-foreground',
                            !isActive && !isCompleted && 'border-muted-foreground/30 bg-white text-muted-foreground'
                          )}
                        >
                          {isCompleted ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                        </div>
                        <span className={cn(
                          "text-[10px] mt-1 font-medium uppercase tracking-wider transition-colors duration-200",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                          {s.title}
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="w-full max-w-4xl shadow-lg border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* --- Step 1: School Data --- */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Basic Info Block */}
                    <div className="space-y-4 p-5 border rounded-xl bg-card/50 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <School className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">Dados Institucionais</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="schoolName"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
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
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-2">
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
                                    <FormControl><RadioGroupItem value="Publica" /></FormControl>
                                    <FormLabel className="font-normal">Pública</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Privada" /></FormControl>
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
                              <FormLabel>Esfera</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex gap-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Municipal" /></FormControl>
                                    <FormLabel className="font-normal">Municipal</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Estadual" /></FormControl>
                                    <FormLabel className="font-normal">Estadual</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><RadioGroupItem value="Federal" /></FormControl>
                                    <FormLabel className="font-normal">Federal</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="directorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Diretor(a)</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address Block */}
                    <div className="space-y-4 p-5 border rounded-xl bg-card/50 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">Endereço e Contato</h3>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
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
                                {isLoadingCep && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-primary" />}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Logradouro</FormLabel>
                              <FormControl>
                                <Input placeholder="Rua, Av..." {...field} />
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
                            <FormItem className="col-span-2">
                              <FormLabel>Município</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {MUNICIPALITIES.map((city) => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="landline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone Fixo (Escola)</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 0000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="schoolMobile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Celular (WhatsApp)</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 90000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- Step 2: Responsible Data --- */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="p-5 border rounded-xl bg-card/50 shadow-sm space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-800">Dados do Responsável</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="responsibleName"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome do responsável..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cpf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CPF</FormLabel>
                              <FormControl>
                                <Input placeholder="000.000.000-00" maxLength={14} {...field} />
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
                              <FormLabel>WhatsApp / Celular</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 90000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>E-mail (Login)</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="seu.email@exemplo.com" {...field} />
                              </FormControl>
                              <FormDescription>Este e-mail será utilizado para entrar no sistema.</FormDescription>
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
                  </div>
                )}

                {/* --- Actions Footer --- */}
                <div className="flex gap-4 pt-6 border-t justify-end">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      Voltar
                    </Button>
                  )}

                  {step === 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="min-w-[140px] apple-button-gradient"
                    >
                      Próxima Etapa <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[140px] apple-button-gradient"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        'Finalizar Cadastro'
                      )}
                    </Button>
                  )}
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
