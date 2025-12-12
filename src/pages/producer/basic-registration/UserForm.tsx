import { useEffect } from 'react'
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
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(255, 'Máximo de 255 caracteres'),
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .max(14, 'Máximo de 14 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório'),
  role: z
    .string()
    .min(1, 'Tipo de Acesso é obrigatório'),
  password: z.string().max(255),
})

type FormValues = z.infer<typeof formSchema>

export default function UserForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = id && id !== 'novo'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      phone: '',
      role: '',
      password: '@Sme2025',
    },
  })

  useEffect(() => {
    if (isEditing) {
      // Mock data fetch for editing
      form.reset({
        name: 'Ana Silva',
        cpf: '123.456.789-00',
        email: 'ana.silva@email.com',
        phone: '(11) 99999-9999',
        role: 'Administrador', // Matching the Select value
        password: '@Sme2025',
      })
    }
  }, [isEditing, form])

  function onSubmit(values: FormValues) {
    console.log(values)
    // Here you would normally make an API call
    toast.success(
      isEditing
        ? 'Usuário atualizado com sucesso!'
        : 'Usuário criado com sucesso!',
    )
    navigate('/area-do-produtor/usuarios')
  }

  // Simple CPF Mask
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 9) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4')
    } else if (value.length > 6) {
      value = value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3')
    } else if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d{0,3}).*/, '$1.$2')
    }

    form.setValue('cpf', value, { shouldValidate: true })
  }

  // Simple Phone Mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, '($1')
    }

    form.setValue('phone', value, { shouldValidate: true })
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/area-do-produtor/usuarios')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar um novo usuário no sistema.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 bg-card p-6 rounded-lg border shadow-sm">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome completo"
                      maxLength={255}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CPF */}
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
                        onChange={handleCpfChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telefone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (WhatsApp)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        {...field}
                        onChange={handlePhoneChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@exemplo.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Acesso (Cargo/Função renamed to role which is used for produtor type) */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Acesso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de acesso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Administrador">Administrador</SelectItem>
                      <SelectItem value="Produtor">Produtor</SelectItem>
                      <SelectItem value="Participante">Participante</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Senha Inicial */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
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

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate('/area-do-produtor/usuarios')
              }
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-success hover:bg-success/90 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
