'use server'

import { cookies } from 'next/headers'

// ==================== TIPOS ====================

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

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

// ==================== HELPERS ====================

function generateToken(user: User): string {
  // TEMPORÁRIO: Base64 simples
  // TODO: Implementar JWT real com jsonwebtoken
  return Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64')
}

function verifyPassword(inputPassword: string, storedHash?: string): boolean {
  // TEMPORÁRIO: Validação simples
  // TODO: Implementar bcrypt
  return inputPassword.length >= 6
}

// Simula busca de usuário (TEMPORÁRIO - migrar para banco de dados)
async function findUser(email: string, role: UserRole): Promise<User | null> {
  // TODO: Buscar do banco de dados (Supabase/Firebase/Prisma)
  // Por enquanto, retorna null para forçar usuário a usar dados reais
  
  // EXEMPLO de usuário teste:
  if (email === 'produtor@teste.com' && role === 'produtor') {
    return {
      id: '1',
      email: 'produtor@teste.com',
      name: 'Produtor Teste',
      role: 'produtor',
    }
  }
  
  if (email === 'participante@teste.com' && role === 'participante') {
    return {
      id: '2',
      email: 'participante@teste.com',
      name: 'Escola Teste',
      role: 'participante',
    }
  }
  
  return null
}

// ==================== AUTENTICAÇÃO ====================

export async function loginProducer(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const user = await findUser(credentials.email, 'produtor')
    
    if (!user || !verifyPassword(credentials.password)) {
      return {
        success: false,
        error: 'Email ou senha inválidos',
      }
    }

    // Criar token
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

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Erro no login do produtor:', error)
    return {
      success: false,
      error: 'Erro ao processar login',
    }
  }
}

export async function loginParticipant(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const user = await findUser(credentials.email, 'participante')
    
    if (!user || !verifyPassword(credentials.password)) {
      return {
        success: false,
        error: 'Email ou senha inválidos',
      }
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

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Erro no login do participante:', error)
    return {
      success: false,
      error: 'Erro ao processar login',
    }
  }
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

// ==================== REGISTRO ====================

export interface RegisterData {
  name: string
  email: string
  password: string
  // Adicionar outros campos conforme necessário
}

export async function registerParticipant(data: RegisterData): Promise<AuthResult> {
  try {
    // TODO: Criar usuário no banco de dados
    
    // Por enquanto, retorna sucesso simulado
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'participante',
    }

    return {
      success: true,
      user: newUser,
    }
  } catch (error) {
    console.error('Erro no registro:', error)
    return {
      success: false,
      error: 'Erro ao processar cadastro',
    }
  }
}
