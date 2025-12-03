import { Outlet } from 'react-router-dom'
import { ParticipantSidebar } from './ParticipantSidebar'
import { ParticipantHeader } from './ParticipantHeader'
import { useParticipant } from '@/contexts/ParticipantContext'

export default function ParticipantLayout() {
  // Ensure Participant Context is loaded
  const { school } = useParticipant()

  return (
    <div className="flex min-h-screen bg-background">
      <ParticipantSidebar />
      <main className="flex flex-col flex-1 w-full transition-all duration-300 ease-in-out">
        <ParticipantHeader />
        <div className="flex-1 p-6 md:p-8 container mx-auto max-w-7xl animate-fade-in">
          <Outlet />
        </div>
        <footer className="border-t p-4 text-center text-xs text-muted-foreground">
          © 2025 Gerador de Eventos. Área do Participante.
        </footer>
      </main>
    </div>
  )
}
