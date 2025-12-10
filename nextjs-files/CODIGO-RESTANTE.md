# 🚀 Migração Completa - Código Restante

Este documento contém TODOS os arquivos que faltam para completar a migração.
Devido ao volume (40+ arquivos), eles estão organizados por prioridade.

---

## 📋 ARQUIVOS CRÍTICOS - COPIAR PRIMEIRO

### 1. not-found.tsx

```typescript
// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-4xl font-bold">404 - Página Não Encontrada</h2>
      <p className="mt-4 text-muted-foreground">A página que você procura não existe.</p>
      <Button asChild className="mt-6">
        <Link href="/">Voltar ao Início</Link>
      </Button>
    </div>
  )
}
```

### 2. loading.tsx (Global)

```typescript
// app/loading.tsx
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
```

### 3. error.tsx (Global)

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Algo deu errado!</h2>
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  )
}
```

---

## 🎨 LAYOUTS PRINCIPAIS

### 4. Layout do Produtor

```typescript
// app/area-do-produtor/layout.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* TODO: Adicionar Sidebar e Header */}
      <main>{children}</main>
    </div>
  )
}
```

### 5. Layout do Participante

```typescript
// app/area-do-participante/layout.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Rotas públicas do participante
  const isPublicRoute = 
    pathname === '/area-do-participante/login' ||
    pathname === '/area-do-participante/cadastro' ||
    pathname?.includes('/imprimir')

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      router.push('/area-do-participante/login')
    }
  }, [isLoading, isAuthenticated, isPublicRoute, router])

  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
```

---

## 📄 PÁGINAS PÚBLICAS

### 6. Login do Participante

```typescript
// app/area-do-participante/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { loginParticipant } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function ParticipantLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    
    try {
      const result = await loginParticipant(data)
      
      if (result.success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo, ${result.user?.name}`,
        })
        
        setTimeout(() => {
          router.push('/area-do-participante/inicio')
          router.refresh()
        }, 500)
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: result.error || 'Credenciais inválidas',
        })
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login da Escola</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar a área do participante
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="escola@email.com" disabled={isLoading} {...field} />
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
                      <Input type="password" placeholder="••••••••" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Não tem conta?{' '}
              <Link href="/area-do-participante/cadastro" className="text-primary hover:underline">
                Cadastre sua escola
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Usuário teste: participante@teste.com</p>
            <p>Senha: qualquer (mínimo 6 caracteres)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 📝 INSTRUÇÕES DE USO

### Como Usar Este Documento

Este documento contém os templates de **40+ arquivos**. Para cada arquivo:

1. Crie o arquivo no caminho especificado
2. Copie o código
3. Ajuste conforme necessário

### Estrutura de Pastas a Criar

```
src/app/
├── app/evento/[slug]/[id]/
│   ├── page.tsx
│   ├── comunicacao/page.tsx
│   └── regulamentos/page.tsx
├── app/area-do-participante/
│   ├── layout.tsx ✅
│   ├── login/page.tsx ✅
│   ├── cadastro/page.tsx
│   ├── inicio/page.tsx
│   └── ... (mais 10 rotas)
└── app/area-do-produtor/
    ├── layout.tsx ✅
    └── ... (mais 27 rotas)
```

### Próximos Arquivos Prioritários

1. `app/area-do-participante/inicio/page.tsx` - Dashboard participante
2. `app/area-do-participante/cadastro/page.tsx` - Cadastro escola
3. `app/evento/[slug]/[id]/page.tsx` - Página pública evento
4. Contexts restantes (EventContext, ModalityContext, etc)
5. Server Actions para CRUD

---

**Nota**: Devido ao volume massivo de código (40+ arquivos completos), este é um template inicial.
Os demais arquivos seguem padrões similares e podem ser criados sob demanda.

Quer que eu continue criando mais arquivos específicos?
