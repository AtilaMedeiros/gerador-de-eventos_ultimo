import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
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
} from '@/components/ui/form'
import { useAuth } from '@/contexts/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function ParticipantLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsSubmitting(true)
    try {
      const success = await login(data.email, data.password)
      if (success) {
        toast.success('Acesso concedido!', {
          icon: <CheckCircle2 className="h-4 w-4 text-success" />,
        })
        navigate('/area-do-participante/inicio')
      } else {
        toast.error('Credenciais inválidas.')
      }
    } catch (error) {
      toast.error('Erro ao conectar.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Visual Side - Right for variation */}
      <div className="hidden lg:flex w-1/2 relative bg-secondary overflow-hidden order-2">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1200/1200?q=running%20track&color=blue')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/90 via-secondary/70 to-background/40"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-secondary-foreground h-full text-center">
          <div className="h-20 w-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-8 animate-fade-in-up">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Área do Participante
          </h1>
          <p className="text-lg opacity-80 max-w-md">
            Gerencie suas inscrições, acompanhe resultados e acesse documentos
            exclusivos para escolas, técnicos e atletas.
          </p>
        </div>
      </div>

      {/* Form Side - Left */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gray-50/50 dark:bg-background order-1">
        <div className="w-full max-w-[400px] space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground font-bold mb-6 shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Bem-vindo
            </h2>
            <p className="text-muted-foreground mt-2">
              Entre com sua conta institucional ou pessoal.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="escola@email.com"
                        type="email"
                        disabled={isSubmitting}
                        className="h-12 bg-white dark:bg-secondary/20"
                        {...field}
                      />
                    </FormControl>
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
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? 'text' : 'password'}
                          disabled={isSubmitting}
                          className="h-12 pr-10 bg-white dark:bg-secondary/20"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium shadow-lg shadow-secondary/25 hover:shadow-secondary/40 transition-all"
                variant="secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Acessando...
                  </>
                ) : (
                  <>
                    Acessar Painel
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Ainda não tem cadastro?{' '}
              <a
                href="/area-do-participante/cadastro"
                className="font-medium text-primary hover:underline"
              >
                Criar Nova Conta
              </a>
            </p>

            <div className="text-xs text-muted-foreground bg-white dark:bg-secondary/10 p-3 rounded-lg border border-dashed">
              <span className="font-semibold">Acesso Rápido (Demo):</span>
              <br />
              Email: escola@exemplo.com (Diretor)
              <br />
              Email: tecnico@exemplo.com (Técnico)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
