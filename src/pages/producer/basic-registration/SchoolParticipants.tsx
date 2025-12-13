import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function SchoolParticipants() {
    const navigate = useNavigate()
    return (
        <div className="p-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Participantes da Escola</h1>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
        </div>
    )
}
