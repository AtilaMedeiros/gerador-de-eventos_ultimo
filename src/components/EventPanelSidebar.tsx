import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileBarChart,
  School,
  Trophy,
  Palette,
  Megaphone,
  ArrowLeft,
  Settings,
} from 'lucide-react'
import { useEvent } from '@/contexts/EventContext'

export function EventPanelSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { eventId } = useParams()
  const { getEventById } = useEvent()

  const event = eventId ? getEventById(eventId) : undefined

  const isActive = (path: string) => location.pathname === path
  const isChildActive = (path: string) => location.pathname.startsWith(path)

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

  if (!event) {
    return (
      <aside className="hidden w-72 flex-col border-r bg-background text-foreground md:flex min-h-screen p-6">
        <p>Evento não encontrado.</p>
        <Link
          to="/area-do-produtor/cadastro-basico/evento"
          className="text-primary hover:underline mt-4"
        >
          Voltar
        </Link>
      </aside>
    )
  }

  return (
    <aside className="hidden w-72 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-sidebar-foreground md:flex min-h-screen sticky top-0 h-screen overflow-y-auto z-40 shadow-subtle">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-border/50">
        <button
          onClick={() => navigate('/area-do-produtor/cadastro-basico/evento')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Lista
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <Settings className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <span
              className="font-bold text-sm tracking-tight block leading-tight truncate"
              title={event.name}
            >
              {event.name}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Painel de Gestão
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-8">
        {/* Principal */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Principal
          </p>
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/dashboard`}
            icon={LayoutDashboard}
            label="Dashboard"
            active={isActive(`/area-do-produtor/evento/${eventId}/dashboard`)}
          />
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/relatorios`}
            icon={FileBarChart}
            label="Relatório"
            active={isActive(`/area-do-produtor/evento/${eventId}/relatorios`)}
          />
        </div>

        {/* Escolas */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Escolas
          </p>
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/escolas`}
            icon={School}
            label="Escolas Inscritas"
            active={isActive(`/area-do-produtor/evento/${eventId}/escolas`)}
          />
        </div>

        {/* Vínculos */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Vínculos
          </p>
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/modalidades`}
            icon={Trophy}
            label="Modalidades"
            active={isChildActive(
              `/area-do-produtor/evento/${eventId}/modalidades`,
            )}
          />
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/tema`}
            icon={Palette}
            label="Tema Aplicado"
            active={isChildActive(`/area-do-produtor/evento/${eventId}/tema`)}
          />
        </div>

        {/* Comunicação */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Comunicação
          </p>
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/comunicacao`}
            icon={Megaphone}
            label="Avisos e Boletins"
            active={isChildActive(
              `/area-do-produtor/evento/${eventId}/comunicacao`,
            )}
          />
        </div>
      </div>
    </aside>
  )
}
