import { Outlet } from 'react-router-dom'
import { EventPanelSidebar } from './EventPanelSidebar'
import { DashboardHeader } from './DashboardHeader'

export default function EventPanelLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-background">
      <EventPanelSidebar />
      <main className="flex flex-col flex-1 w-full transition-all duration-300 ease-in-out min-w-0">
        <DashboardHeader />
        <div className="flex-1 p-6 md:p-8 container mx-auto max-w-7xl animate-fade-in space-y-6">
          <Outlet />
        </div>
        <footer className="border-t bg-background/50 p-6 text-center text-xs text-muted-foreground">
          © 2025 Gerador de Eventos. Painel do Evento.
        </footer>
      </main>
    </div>
  )
}
