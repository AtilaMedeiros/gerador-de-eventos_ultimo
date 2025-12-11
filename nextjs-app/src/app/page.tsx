'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { loginProducer } from '@/app/actions/auth'
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
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true)

        try {
            const result = await loginProducer(data)

            if (result.success) {
                toast.success('Login realizado com sucesso!', {
                    description: `Bem-vindo de volta, ${result.user?.name}`,
                })
                router.push('/area-do-produtor/inicio')
            } else {
                toast.error('Erro no login', {
                    description: result.error || 'Credenciais inválidas',
                })
            }
        } catch (error) {
            console.error('Erro no login:', error)
            toast.error('Erro no login', {
                description: 'Ocorreu um erro inesperado. Tente novamente.',
            })
        } finally {
            setIsLoading(false)
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
                                                type="email"
                                                placeholder="admin@exemplo.com"
                                                autoComplete="email"
                                                disabled={isLoading}
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
                                            <Link
                                                href="#"
                                                className="text-xs font-medium text-primary hover:underline"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                Esqueceu a senha?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    autoComplete="current-password"
                                                    disabled={isLoading}
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
                                disabled={isLoading}
                            >
                                {isLoading ? (
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
                            Para testar erro, use a senha &quot;error&quot;.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
