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
