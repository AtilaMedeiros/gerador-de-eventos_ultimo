import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Briefcase, User, Mail, Phone, FileText, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useParticipant } from '@/contexts/ParticipantContext'
import { toast } from 'sonner'

const techSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  sex: z.enum(['Feminino', 'Masculino']),
  dob: z.string().min(10, 'Data inválida').max(10),
  cpf: z.string().min(11, 'CPF inválido'),
  cref: z.string().optional(),

  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Contato inválido'),
  password: z.string(),
})

type TechFormValues = z.infer<typeof techSchema>

export default function TechnicianForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { technicians, addTechnician, updateTechnician } = useParticipant()
  const isEditing = id && id !== 'novo'
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TechFormValues>({
    resolver: zodResolver(techSchema),
    defaultValues: {
      name: '',
      sex: 'Feminino',
      dob: '',
      cpf: '',
      cref: '',

      email: '',
      phone: '',
      password: '@Sme2025',
    },
  })

  useEffect(() => {
    if (isEditing && id) {
      const tech = technicians.find((t) => t.id === id)
      if (tech) {
        // Convert Date to DD/MM/YYYY string
        const d = new Date(tech.dob)
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        form.reset({
          ...tech,
          dob: `${day}/${month}/${year}`,
        })
      } else {
        navigate('/area-do-participante/tecnicos')
      }
    }
  }, [isEditing, id, technicians, form, navigate])

  const onSubmit = async (data: TechFormValues) => {
    setIsSubmitting(true)
    try {
      // Parse DD/MM/YYYY to Date
      const [day, month, year] = data.dob.split('/')

      const payload = {
        name: data.name,
        sex: data.sex,
        dob: new Date(`${year}-${month}-${day}T00:00:00`),
        cpf: data.cpf,
        cref: data.cref,
        email: data.email,
        phone: data.phone,

      }

      if (isEditing && id) {
        updateTechnician(id, payload)
      } else {
        addTechnician(payload)
      }

      // Simulate slight delay for effect
      await new Promise(resolve => setTimeout(resolve, 500))
      navigate('/area-do-participante/tecnicos')
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar técnico")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simple masks
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    if (value.length >= 5) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`
    } else if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    onChange(value)
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`
    }
    onChange(value)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 10) {
      value = `(${value.slice(0, 2)})${value.slice(2, 7)}-${value.slice(7)}`
    } else if (value.length > 6) {
      value = `(${value.slice(0, 2)})${value.slice(2, 6)}-${value.slice(6)}`
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)})${value.slice(2)}`
    }
    onChange(value)
  }

  return (
    <div className="max-w-full mx-auto h-[calc(100vh-5rem)] flex flex-col animate-fade-in text-foreground">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-6 shrink-0 px-1">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg shadow-sm">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {isEditing ? 'Editar Técnico' : 'Novo Técnico'}
            </h2>
            <p className="text-muted-foreground text-sm">
              Preencha os dados do membro da comissão técnica.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/area-do-participante/tecnicos')}
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
            Salvar Técnico
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 lg:pr-4 scrollbar-thin pb-6">
        <div className="max-w-5xl mx-auto">
          <Form {...form}>
            <form className="space-y-6">

              {/* Personal Info Section */}
              <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2 border-b pb-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground/80">Informações Pessoais</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" maxLength={255} {...field} className="bg-background/50" />
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
                        <FormLabel>Sexo</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-6"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Feminino" id="sexoFeminino" />
                              </FormControl>
                              <FormLabel htmlFor="sexoFeminino" className="font-normal cursor-pointer">Feminino</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Masculino" id="sexoMasculino" />
                              </FormControl>
                              <FormLabel htmlFor="sexoMasculino" className="font-normal cursor-pointer">Masculino</FormLabel>
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
                      <FormItem>
                        <FormLabel>Nascimento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="00/00/0000"
                            maxLength={10}
                            {...field}
                            onChange={(e) => handleDateChange(e, field.onChange)}
                            className="bg-background/50"
                          />
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
                          <Input
                            placeholder="000.000.000-00"
                            maxLength={14}
                            {...field}
                            onChange={(e) => handleCpfChange(e, field.onChange)}
                            className="bg-background/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Professional Info Section */}
              <div className="space-y-4 p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2 border-b pb-2">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                    <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground/80">Dados Profissionais & Contato</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cref"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CREF</FormLabel>
                        <div className="relative">
                          <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input placeholder="Nº do Cref" {...field} className="pl-9 bg-background/50" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>E-mail</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input type="email" placeholder="E-mail" maxLength={255} {...field} className="pl-9 bg-background/50" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Contato</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="(00)0000-0000"
                              maxLength={15}
                              {...field}
                              onChange={(e) => handlePhoneChange(e, field.onChange)}
                              className="pl-9 bg-background/50"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>
                          Senha inicial (será solicitado a troca no primeiro login)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="@Sme2025"
                            readOnly
                            className="bg-muted text-muted-foreground"
                            {...field}
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
