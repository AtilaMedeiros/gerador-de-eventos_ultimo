/* Layout Component - Wraps the dashboard content */
import { Outlet } from 'react-router-dom'
import { ProducerSidebar } from './ProducerSidebar'
import { ProducerHeader } from './ProducerHeader'

export default function ProducerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 dark:bg-background">
      <ProducerSidebar />
      <main className="flex flex-col flex-1 w-full transition-all duration-300 ease-in-out min-w-0">
        <ProducerHeader />
        <div className="flex-1 p-6 md:p-8 container mx-auto max-w-7xl animate-fade-in space-y-6">
          <Outlet />
        </div>
        <footer className="border-t bg-background/50 p-6 text-center text-xs text-muted-foreground">
          © 2025 Gerador de Eventos. Todos os direitos reservados.
        </footer>
      </main>
    </div>
  )
}
