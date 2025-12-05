import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Settings,
  FileBarChart,
  User,
  Users,
  LogOut,
  Calendar,
  Trophy,
  Palette,
  ChevronRight,
} from 'lucide-react'
import { useCallback } from 'react'

export function DashboardSidebar() {
  const location = useLocation()

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  )
  const isChildActive = useCallback(
    (path: string) => location.pathname.startsWith(path),
    [location.pathname],
  )

  // Highlight "Eventos" if we are in the basic registration for events OR configuring an event
  const isEventosActive =
    isChildActive('/area-do-produtor/cadastro-basico/evento') ||
    isChildActive('/area-do-produtor/configurar-evento')

  const NavItem = ({
    to,
    icon: Icon,
    label,
    active,
  }: {
    to: string
    icon: any
    label: string
    active: boolean
  }) => (
    <Link
      to={to}
      className={cn(
        'group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary/50 hover:text-foreground',
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            'h-4 w-4 transition-colors',
            active
              ? 'text-primary'
              : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
        {label}
      </div>
      {active && (
        <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
      )}
    </Link>
  )

  return (
    <aside className="hidden w-72 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-sidebar-foreground md:flex min-h-screen sticky top-0 h-screen overflow-y-auto z-40 shadow-subtle">
      <div className="p-6 border-b border-border/50 flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-lg shadow-primary/20">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight block leading-none">
            Gerador
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Eventos
          </span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-8">
        <div className="space-y-1">

          <NavItem
            to="/area-do-produtor/inicio"
            icon={LayoutDashboard}
            label="Visão Geral"
            active={isActive('/area-do-produtor/inicio')}
          />
          <NavItem
            to="/area-do-produtor/relatorios"
            icon={FileBarChart}
            label="Relatórios"
            active={isChildActive('/area-do-produtor/relatorios')}
          />
        </div>

        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Cadastro
          </p>
          <NavItem
            to="/area-do-produtor/cadastro-basico/evento"
            icon={Calendar}
            label="Eventos"
            active={isEventosActive}
          />
          <NavItem
            to="/area-do-produtor/cadastro-basico/modalidades"
            icon={Trophy}
            label="Modalidades"
            active={isChildActive(
              '/area-do-produtor/cadastro-basico/modalidades',
            )}
          />
          <NavItem
            to="/area-do-produtor/cadastro-basico/identidade-visual"
            icon={Palette}
            label="Identidade Visual"
            active={isChildActive(
              '/area-do-produtor/cadastro-basico/identidade-visual',
            )}
          />
          <NavItem
            to="/area-do-produtor/cadastro-basico/usuarios"
            icon={Users}
            label="Usuários"
            active={isChildActive('/area-do-produtor/cadastro-basico/usuarios')}
          />
        </div>


      </div>

      <div className="p-4 border-t border-border/50">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 w-full"
        >
          <LogOut className="h-4 w-4" />
          Encerrar Sessão
        </Link>
      </div>
    </aside>
  )
}
