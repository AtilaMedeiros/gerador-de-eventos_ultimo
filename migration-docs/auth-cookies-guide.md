# Guia de Implementação: Autenticação com Cookies no Next.js

## Decisão Tomada ✅
Migrar de **localStorage** para **cookies httpOnly** para autenticação mais segura.

---

## 1. Estrutura de Autenticação

### Arquitetura

```
Autenticação com Cookies
├── Server Actions (app/actions/auth.ts)
│   ├── login()
│   ├── logout()
│   └── register()
│
├── Middleware (middleware.ts)
│   └── Verifica cookies em cada request
│
├── Cookies (httpOnly, secure, sameSite)
│   ├── auth-token (token do usuário)
│   └── user-role (produtor ou participante)
│
└── Client Components
    └── Usam Server Actions para login/logout
```

---

## 2. Server Actions para Autenticação

### [NEW] app/actions/auth.ts

```typescript
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Tipos
export type UserRole = 'produtor' | 'participante'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

// Simula busca de usuários do localStorage
// NOTA: No Next.js, você pode querer migrar isso para um banco de dados real
function getUsersFromStorage(role: UserRole): User[] {
  // Por enquanto, isso ainda depende de localStorage client-side
  // Você precisará migrar para uma solução server-side (Supabase, Firebase, etc)
  // ou manter lógica híbrida temporariamente
  return []
}

// ==================== PRODUTORES ====================

export async function loginProducer(credentials: LoginCredentials) {
  // Simulação de validação (substitua por lógica real)
  const users = getUsersFromStorage('produtor')
  const user = users.find(
    u => u.email === credentials.email && 
    // ATENÇÃO: Nunca armazene senhas em texto puro!
    // Use bcrypt ou similar
    checkPassword(credentials.password)
  )

  if (!user) {
    return { success: false, error: 'Credenciais inválidas' }
  }

  // Criar token (pode ser JWT real)
  const token = generateToken(user)

  // Configurar cookies
  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  cookies().set('user-role', 'produtor', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  cookies().set('user-data', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return { success: true, user }
}

export async function loginParticipant(credentials: LoginCredentials) {
  // Similar ao loginProducer, mas com role 'participante'
  const users = getUsersFromStorage('participante')
  const user = users.find(
    u => u.email === credentials.email && 
    checkPassword(credentials.password)
  )

  if (!user) {
    return { success: false, error: 'Credenciais inválidas' }
  }

  const token = generateToken(user)

  cookies().set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  cookies().set('user-role', 'participante', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  cookies().set('user-data', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return { success: true, user }
}

export async function logout() {
  cookies().delete('auth-token')
  cookies().delete('user-role')
  cookies().delete('user-data')
}

export async function getCurrentUser(): Promise<User | null> {
  const userDataCookie = cookies().get('user-data')
  
  if (!userDataCookie) {
    return null
  }

  try {
    const user = JSON.parse(userDataCookie.value)
    return user
  } catch {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get('auth-token')
  return !!token
}

export async function getUserRole(): Promise<UserRole | null> {
  const roleCookie = cookies().get('user-role')
  return roleCookie?.value as UserRole || null
}

// ==================== HELPERS ====================

function generateToken(user: User): string {
  // ATENÇÃO: Use JWT real em produção
  // npm install jsonwebtoken @types/jsonwebtoken
  // import jwt from 'jsonwebtoken'
  // return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
  
  // Temporário: apenas base64
  return Buffer.from(JSON.stringify({ userId: user.id })).toString('base64')
}

function checkPassword(password: string): boolean {
  // ATENÇÃO: Use bcrypt em produção
  // npm install bcryptjs @types/bcryptjs
  // import bcrypt from 'bcryptjs'
  // return bcrypt.compareSync(password, hashedPassword)
  
  // Temporário: validação simples
  return password.length >= 6
}
```

---

## 3. Middleware para Proteção de Rotas

### [NEW] middleware.ts (raiz do projeto)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Obter cookies
  const authToken = request.cookies.get('auth-token')
  const userRole = request.cookies.get('user-role')
  
  // ==================== ROTAS PROTEGIDAS DO PRODUTOR ====================
  if (pathname.startsWith('/area-do-produtor')) {
    if (!authToken || userRole?.value !== 'produtor') {
      // Redirecionar para login do produtor
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  // ==================== ROTAS PROTEGIDAS DO PARTICIPANTE ====================
  if (pathname.startsWith('/area-do-participante')) {
    // Exceções: login e cadastro são públicos
    const isPublicParticipantRoute = 
      pathname.includes('/login') || 
      pathname.includes('/cadastro') ||
      pathname.includes('/imprimir')
    
    if (!isPublicParticipantRoute) {
      if (!authToken || userRole?.value !== 'participante') {
        // Redirecionar para login do participante
        return NextResponse.redirect(new URL('/area-do-participante/login', request.url))
      }
    }
  }
  
  // ==================== REDIRECIONAMENTO SE JÁ AUTENTICADO ====================
  
  // Se já está logado como produtor e tenta acessar login
  if (pathname === '/' && authToken && userRole?.value === 'produtor') {
    return NextResponse.redirect(new URL('/area-do-produtor/inicio', request.url))
  }
  
  // Se já está logado como participante e tenta acessar login
  if (pathname === '/area-do-participante/login' && authToken && userRole?.value === 'participante') {
    return NextResponse.redirect(new URL('/area-do-participante/inicio', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## 4. Context API (Client-Side) - Adaptado

Ainda podemos usar Context para estado client-side, mas agora ele busca do servidor:

### [NEW] app/contexts/AuthContext.tsx

```typescript
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getCurrentUser, logout as serverLogout, type User } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadUser = async () => {
    setIsLoading(true)
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const logout = async () => {
    await serverLogout()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const refreshUser = async () => {
    await loadUser()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

---

## 5. Componente de Login (Produtor)

### [NEW] app/page.tsx

```typescript
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

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
        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo, ${result.user?.name}`,
        })
        router.push('/area-do-produtor/inicio')
        router.refresh()
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: result.error,
        })
      }
    } catch (error) {
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login do Produtor</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o painel
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
                      <Input placeholder="seu@email.com" {...field} />
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
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 6. Migração de Dados localStorage → Servidor

### Estratégia de Transição

Como o sistema atual usa localStorage, você tem 3 opções:

#### Opção A: Script de Migração Client-Side (Temporário)

```typescript
// utils/migrateLocalStorage.ts
'use client'

export function migrateLocalStorageToServer() {
  // Executar uma vez ao fazer login
  const users = localStorage.getItem('ge_users')
  const schools = localStorage.getItem('ge_schools')
  const events = localStorage.getItem('ge_events')
  
  // Enviar para API/banco de dados
  // fetch('/api/migrate', { method: 'POST', body: JSON.stringify({ users, schools, events }) })
  
  // Limpar localStorage após migração
  // localStorage.clear()
}
```

#### Opção B: Manter Híbrido Temporariamente

Durante a transição:
- **Autenticação**: Cookies (servidor)
- **Dados (eventos, escolas, atletas)**: localStorage (client) → migrar gradualmente

#### Opção C: Migrar Tudo para Banco de Dados

Implementar backend real:
- **Supabase** (recomendado - fácil, grátis)
- **Firebase**
- **Prisma + PostgreSQL**

---

## 7. Checklist de Implementação

### Server Actions
- [ ] Criar `app/actions/auth.ts`
- [ ] Implementar `loginProducer()`
- [ ] Implementar `loginParticipant()`
- [ ] Implementar `logout()`
- [ ] Implementar `getCurrentUser()`
- [ ] Implementar `getUserRole()`

### Middleware
- [ ] Criar `middleware.ts` na raiz
- [ ] Proteger `/area-do-produtor/*`
- [ ] Proteger `/area-do-participante/*` (exceto login/cadastro)
- [ ] Redirecionar se já autenticado

### Context (Client)
- [ ] Criar novo `AuthContext` que usa Server Actions
- [ ] Implementar `logout()` com cookies
- [ ] Implementar `refreshUser()`

### Páginas de Login
- [ ] Migrar `Login.tsx` → `app/page.tsx`
- [ ] Migrar `ParticipantLogin.tsx` → `app/area-do-participante/login/page.tsx`
- [ ] Usar Server Actions ao invés de Context direto

### Segurança
- [ ] Implementar JWT real (não base64)
- [ ] Implementar bcrypt para senhas
- [ ] Adicionar CSRF protection
- [ ] Configurar HTTPS em produção

### Migração de Dados
- [ ] Decidir estratégia (híbrido ou banco completo)
- [ ] Se banco: escolher solução (Supabase/Firebase/Prisma)
- [ ] Migrar dados de usuários
- [ ] Migrar dados de eventos/escolas/atletas

---

## 8. Próximos Passos

Após autenticação funcionar:
1. Migrar demais Contexts (Event, Modality, etc) para Server Actions/States
2. Decidir sobre persistência de dados (localStorage vs banco)
3. Implementar API routes se necessário

---

**Documento criado em**: 10/12/2025  
**Status**: Fase 2 - Implementação  
**Abordagem**: Cookies httpOnly + Server Actions
