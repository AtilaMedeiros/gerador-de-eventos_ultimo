import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: {
        default: 'Gerador de Eventos Esportivos',
        template: '%s | Gerador de Eventos',
    },
    description: 'Plataforma completa de gerenciamento de eventos esportivos',
    keywords: ['eventos', 'esportes', 'competições', 'gerenciamento'],
    authors: [{ name: 'Gerador de Eventos' }],
    creator: 'Gerador de Eventos',
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://www.geradordeeventos.com.br',
        siteName: 'Gerador de Eventos Esportivos',
        title: 'Gerador de Eventos Esportivos',
        description: 'Plataforma completa de gerenciamento de eventos esportivos',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
