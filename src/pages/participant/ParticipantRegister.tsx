import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { Loader2, School, Search, ArrowLeft } from 'lucide-react'
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

export default function ParticipantRegister() {
  const navigate = useNavigate()
  const { login } = useAuth()
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
      } catch (error) {
        toast.error('Erro ao buscar CEP.')
      } finally {
        setIsLoadingCep(false)
      }
    }
  }

  async function onSubmit(data: RegisterFormValues) {
    setIsSubmitting(true)
    try {
      // Mock Registration API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Auto login
      await login(data.email, data.password)

      toast.success('Conta criada com sucesso!')
      navigate('/area-do-participante/inicio')
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => navigate('/area-do-participante/login')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Login
        </Button>

        <Card className="shadow-lg border-none">
          <CardHeader className="text-center border-b bg-primary/5 rounded-t-lg py-8">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <School className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Cadastro de Instituição
            </CardTitle>
            <CardDescription>
              Preencha os dados para registrar sua escola nos eventos esportivos
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 border-l-4 border-primary pl-3">
                    Informações Básicas
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Nome da Escola</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Escola Municipal..."
                              {...field}
                            />
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
                            <Input
                              placeholder="00.000.000/0000-00"
                              maxLength={18}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                        <FormItem className="col-span-2">
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
                        <FormItem className="col-span-2">
                          <FormLabel>Município</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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

                  <div className="grid md:grid-cols-2 gap-6">
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
                                <FormLabel className="font-normal">
                                  Pública
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Privada" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Privada
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
                                <FormLabel className="font-normal">
                                  Municipal
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Estadual" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Estadual
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="Federal" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Federal
                                </FormLabel>
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

                {/* Contact Info */}
                <div className="space-y-6 pt-4 border-t">
                  <h3 className="text-lg font-semibold flex items-center gap-2 border-l-4 border-primary pl-3">
                    Contato e Acesso
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
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
                        <FormItem className="col-span-2">
                          <FormLabel>E-mail Institucional</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@escola.com"
                              {...field}
                            />
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
                            <Input
                              type="password"
                              placeholder="******"
                              {...field}
                            />
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
                            <Input
                              type="password"
                              placeholder="******"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando Cadastro...
                      </>
                    ) : (
                      'Finalizar Cadastro da Escola'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
