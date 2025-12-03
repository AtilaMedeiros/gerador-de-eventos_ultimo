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
  role: z
    .string()
    .min(1, 'Cargo/Função é obrigatório')
    .max(255, 'Máximo de 255 caracteres'),
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
        role: 'Administradora',
        password: '@Sme2025', // Usually wouldn't return password, but adhering to form structure
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
    navigate('/area-do-produtor/cadastro-basico/usuarios')
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

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/area-do-produtor/cadastro-basico/usuarios')}
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

            {/* CPF */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cpf</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="00.000.000-00"
                      maxLength={14}
                      {...field}
                      onChange={handleCpfChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cargo/Função */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo/Função</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Cargo ou Função"
                      maxLength={255}
                      {...field}
                    />
                  </FormControl>
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
                navigate('/area-do-produtor/cadastro-basico/usuarios')
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
