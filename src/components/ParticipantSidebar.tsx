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
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-lg shadow-primary/20"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard h-5 w-5" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg></div>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard transition-colors h-5 w-5 text-muted-foreground group-hover:text-foreground" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
          Visão Geral
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
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="transition-colors h-6 w-6 group-hover:text-foreground" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M290.2 49.04c-15.7.1-32.3 13.83-38 35.81-6.5 25.15 4.7 47.85 22.1 52.35 17.4 4.5 38.2-9.9 44.7-35 6.5-25.16-4.6-47.82-22.1-52.33-2.2-.56-4.4-.84-6.7-.83zM89.04 68.3L77.5 87.31c32.4 15.99 63.1 33.49 96.4 46.49 9.5-3.8 18.8-7.8 28-12-40.2-15.4-76.7-33.69-112.86-53.5zm148.06 56.1c-47.8 25.4-97.9 41.6-153.64 61.1l8.08 16.4c51.96-16.1 111.26-32.9 161.16-56-6.9-5.5-12.1-12.9-15.6-21.5zm30.3 34.8c-22.5 10.8-46.8 20.2-71.4 28.7-20.3 45.6-27.7 94.9-36.8 140.1l-2.1 10.5-101.02-39.4-16.03 25.4 130.25 60.7c1-1.4 1.7-2.5 2.9-4.5 3.9-6.7 9.2-16.6 15.2-28.6 11.9-23.8 26.7-55.9 40.4-88.1 13.8-32.1 26.4-64.4 33.9-88.4 1.9-6.1 3.5-11.6 4.7-16.4zm-31.9 134.6c-5.5 12.5-11.1 24.8-16.5 36.3 25 37.4 57 79 94.9 109.2l23.3-17.6c-35.8-39.7-72.9-84.3-101.7-127.9zM423.9 367a48 48 0 0 0-48 48 48 48 0 0 0 48 48 48 48 0 0 0 48-48 48 48 0 0 0-48-48z"></path></svg>
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
