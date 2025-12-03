import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
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

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
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
        toast.success('Bem-vindo de volta!', {
          description: 'Login realizado com sucesso.',
          icon: <CheckCircle2 className="h-4 w-4 text-success" />,
        })
        const from =
          (location.state as any)?.from?.pathname || '/area-do-produtor/inicio'
        navigate(from, { replace: true })
      } else {
        toast.error('Credenciais inválidas', {
          description: 'Verifique seu email e senha e tente novamente.',
        })
        form.setError('root', {
          message: 'Credenciais inválidas',
        })
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado', {
        description: 'Tente novamente mais tarde.',
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://img.usecurling.com/p/1200/1200?q=abstract%20geometry&color=blue')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/40"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          <div>
            <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
              <span className="font-bold text-xl">GE</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Gerencie seus eventos esportivos com excelência.
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              A plataforma completa para criação, gestão e divulgação de
              competições esportivas escolares e profissionais.
            </p>
          </div>
          <div className="text-sm text-primary-foreground/60">
            © 2025 Gerador de Eventos. Todos os direitos reservados.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gray-50/50 dark:bg-background">
        <div className="w-full max-w-[400px] space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg">
              GE
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Acesse sua conta
            </h2>
            <p className="text-muted-foreground mt-2">
              Entre com suas credenciais para acessar a área do produtor.
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
                        placeholder="admin@exemplo.com"
                        type="email"
                        autoComplete="email"
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <a
                        href="#"
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={(e) => e.preventDefault()}
                      >
                        Esqueceu a senha?
                      </a>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          disabled={isSubmitting}
                          className="h-12 pr-10 bg-white dark:bg-secondary/20"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-10 w-10 hover:bg-transparent text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
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
                className="w-full h-12 text-base font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar no Sistema
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 dark:bg-background px-2 text-muted-foreground">
                Ambiente de Demonstração
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground bg-white dark:bg-secondary/10 p-4 rounded-lg border border-dashed">
            <p>Use qualquer email válido e senha com 6+ caracteres.</p>
            <p className="mt-1 font-medium">
              Para testar erro, use a senha "error".
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
