import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Loader2,
  School,
  Search,
  Save,
  MapPin,
  Phone,
  X,
  Building
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
import { useParticipant } from '@/contexts/ParticipantContext'
import { useAuth } from '@/contexts/AuthContext'
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

const schoolSchema = z.object({
  // Basic Info
  name: z.string().min(3, 'Nome é obrigatório'),
  inep: z.string().max(8, 'Máximo 8 caracteres').min(1, 'INEP é obrigatório'),
  cnpj: z.string().optional(),
  municipality: z.string().min(1, 'Selecione um município'),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  cep: z.string().optional(),
  type: z.enum(['Publica', 'Privada']).optional(),
  sphere: z.enum(['Municipal', 'Estadual', 'Federal']).optional(),
  directorName: z.string().min(3, 'Nome do diretor é obrigatório'),

  // Contact Info
  landline: z.string().optional(),
  mobile: z.string().min(9, 'Celular é obrigatório'),
  email: z.string().email('Email inválido'),
})

type SchoolFormValues = z.infer<typeof schoolSchema>

export default function SchoolProfile() {
  const { user } = useAuth()
  const { school, updateSchool } = useParticipant()
  const isResponsible = user?.role === 'school_admin' || true // Force true for demo/produtor role masquerading

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
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
    },
  })

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        inep: school.inep,
        municipality: school.municipality,
        directorName: school.directorName,
        email: school.email,
        mobile: school.mobile,
        // Mock additional fields if they don't exist in 'school' context yet
        cnpj: '00.000.000/0000-00',
        address: 'Rua Principal, 123',
        neighborhood: 'Centro',
        cep: '60000-000',
        type: 'Publica',
        sphere: 'Municipal',
        landline: '(85) 3333-4444'
      })
    }
  }, [school, form])

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isResponsible) return

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
      } catch {
        toast.error('Erro ao buscar CEP.')
      } finally {
        setIsLoadingCep(false)
      }
    }
  }

  // ... existing imports ...

  const onSubmit = async (data: SchoolFormValues) => {
    setIsSubmitting(true)
    try {
      if (!school) return // Safety check

      // Validate or Transform data if needed
      // SchoolService expects Partial<School>
      // We can map fields if necessary or pass directly if they match

      SchoolService.updateSchool(school.id, {
        name: data.name,
        inep: data.inep,
        municipality: data.municipality,
        directorName: data.directorName,
        email: data.email,
        mobile: data.mobile,
        cnpj: data.cnpj,
        address: data.address,
        neighborhood: data.neighborhood,
        cep: data.cep,
        type: data.type,
        sphere: data.sphere,
        landline: data.landline
      })

      // Update Local Context (ParticipantContext)
      // Since context likely wraps the state, and updateSchool updates localStorage, 
      // we also need to update the context state to reflect changes immediately in UI
      // updateSchool(data) // Original context function - let's keep it to sync UI state
      // OR better: Refactor ParticipantContext to use SchoolService too? 
      // For this task, we focus on the Business Logic being in Service.
      // The context `updateSchool` probably just sets state.
      updateSchool(data)

      toast.success('Dados da escola atualizados com sucesso!')
    } catch (e) {
      console.error(e)
      toast.error('Erro ao atualizar dados.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!school) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col animate-fade-in">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Perfil da Escola
            </h2>
            <p className="text-muted-foreground text-sm">
              Gerencie os dados institucionais da sua escola.
            </p>
          </div>
        </div>
        {isResponsible && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => form.reset()}
              disabled={!form.formState.isDirty}
            >
              <X className="mr-2 h-4 w-4" /> Cancelar
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || !form.formState.isDirty}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Alterações
            </Button>
          </div>
        )}
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
                          <Input placeholder="Escola Municipal..." {...field} readOnly={!isResponsible} />
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
                          <Input
                            placeholder="00000000"
                            maxLength={8}
                            {...field}
                            readOnly
                            className="bg-muted opacity-80 cursor-not-allowed"
                          />
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
                          <Input placeholder="00.000.000/0000-00" maxLength={18} {...field} readOnly={!isResponsible} />
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
                            disabled={!isResponsible}
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
                            disabled={!isResponsible}
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
                          <Input placeholder="Nome completo" {...field} readOnly={!isResponsible} />
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
                              readOnly={!isResponsible}
                            />
                          </FormControl>
                          {isLoadingCep && (
                            <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-primary" />
                          )}
                          {!isLoadingCep && field.value && isResponsible && (
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
                          <Input placeholder="Rua, Número..." {...field} readOnly={!isResponsible} />
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
                          <Input placeholder="Bairro" {...field} readOnly={!isResponsible} />
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isResponsible}>
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
                          <Input placeholder="(00) 0000-0000" {...field} readOnly={!isResponsible} />
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
                          <Input placeholder="(00) 90000-0000" {...field} readOnly={!isResponsible} />
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
                          <Input type="email" placeholder="email@escola.com" {...field} readOnly={!isResponsible} />
                        </FormControl>
                        <FormDescription>
                          Este email é usado para notificações importantes e login.
                        </FormDescription>
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
