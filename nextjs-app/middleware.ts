import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Obter cookies de autenticação
    const authToken = request.cookies.get('auth-token')
    const userRole = request.cookies.get('user-role')

    // ==================== ÁREA DO PRODUTOR ====================
    if (pathname.startsWith('/area-do-produtor')) {
        // Verificar se está autenticado E é produtor
        if (!authToken || userRole?.value !== 'produtor') {
            console.log('🔒 Acesso negado à área do produtor - redirecionando para login')
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // ==================== ÁREA DO PARTICIPANTE ====================
    if (pathname.startsWith('/area-do-participante')) {
        // Exceções: rotas públicas do participante
        const isPublicParticipantRoute =
            pathname === '/area-do-participante/login' ||
            pathname === '/area-do-participante/cadastro' ||
            pathname.includes('/area-do-participante/imprimir')

        // Se não é rota pública, verificar autenticação
        if (!isPublicParticipantRoute) {
            if (!authToken || userRole?.value !== 'participante') {
                console.log('🔒 Acesso negado à área do participante - redirecionando para login')
                return NextResponse.redirect(new URL('/area-do-participante/login', request.url))
            }
        }
    }

    // ==================== REDIRECIONAMENTO SE JÁ AUTENTICADO ====================

    // Produtor já logado tentando acessar login
    if (pathname === '/' && authToken && userRole?.value === 'produtor') {
        console.log('✅ Produtor já autenticado - redirecionando para dashboard')
        return NextResponse.redirect(new URL('/area-do-produtor/inicio', request.url))
    }

    // Participante já logado tentando acessar login
    if (pathname === '/area-do-participante/login' && authToken && userRole?.value === 'participante') {
        console.log('✅ Participante já autenticado - redirecionando para início')
        return NextResponse.redirect(new URL('/area-do-participante/inicio', request.url))
    }

    // Permitir acesso
    return NextResponse.next()
}

// Configuração do middleware
export const config = {
    matcher: [
        /*
         * Aplicar middleware em todas as rotas exceto:
         * - api (API routes)
         * - _next/static (arquivos estáticos)
         * - _next/image (otimização de imagens)
         * - favicon.ico
         * - arquivos públicos (imagens, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
