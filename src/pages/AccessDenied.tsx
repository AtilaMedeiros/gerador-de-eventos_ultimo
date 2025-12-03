import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <ShieldAlert className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Acesso Negado</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8">
        Você não tem permissão para acessar esta página. Verifique suas
        credenciais ou entre em contato com o administrador do sistema.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button onClick={() => navigate('/area-do-produtor/inicio')}>
          Ir para Início
        </Button>
      </div>
    </div>
  )
}
