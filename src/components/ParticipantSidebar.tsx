import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Home,
  School,
  Users,
  GraduationCap,
  FileText,
  LogOut,
} from 'lucide-react'

export function ParticipantSidebar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path
  const isChildActive = (path: string) => location.pathname.startsWith(path)

  return (
    <aside className="hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b border-sidebar-border">
        <Link
          to="/area-do-participante/inicio"
          className="flex items-center gap-2"
        >
          <div className="bg-secondary text-secondary-foreground p-1 rounded-md">
            <School className="h-6 w-6" />
          </div>
          <span className="font-bold text-lg tracking-tight">Participante</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/area-do-participante/inicio"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            isActive('/area-do-participante/inicio') &&
              'bg-sidebar-accent text-primary',
          )}
        >
          <Home className="h-4 w-4" />
          Início / Meus Eventos
        </Link>

        <Link
          to="/area-do-participante/escola"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            isActive('/area-do-participante/escola') &&
              'bg-sidebar-accent text-primary',
          )}
        >
          <School className="h-4 w-4" />
          Escola
        </Link>

        <Link
          to="/area-do-participante/atletas"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            isChildActive('/area-do-participante/atletas') &&
              'bg-sidebar-accent text-primary',
          )}
        >
          <Users className="h-4 w-4" />
          Atletas
        </Link>

        <Link
          to="/area-do-participante/tecnicos"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            isChildActive('/area-do-participante/tecnicos') &&
              'bg-sidebar-accent text-primary',
          )}
        >
          <GraduationCap className="h-4 w-4" />
          Técnicos
        </Link>

        <Link
          to="/area-do-participante/fichas"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            isActive('/area-do-participante/fichas') &&
              'bg-sidebar-accent text-primary',
          )}
        >
          <FileText className="h-4 w-4" />
          Ficha de Inscrição
        </Link>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Link
          to="/area-do-participante/login"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Link>
      </div>
    </aside>
  )
}
