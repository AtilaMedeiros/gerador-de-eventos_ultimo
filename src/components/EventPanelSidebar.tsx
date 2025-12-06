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
  Users,
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
        {/* Principal */}
        <div className="space-y-1">

          <NavItem
            to={`/area-do-produtor/evento/${eventId}/dashboard`}
            icon={LayoutDashboard}
            label="Visão Geral"
            active={isActive(`/area-do-produtor/evento/${eventId}/dashboard`)}
          />
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/relatorios`}
            icon={FileBarChart}
            label="Relatório"
            active={isActive(`/area-do-produtor/evento/${eventId}/relatorios`)}
          />
        </div>

        {/* Participantes */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Participantes
          </p>
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/escolas`}
            icon={School}
            label="Escolas"
            active={isActive(`/area-do-produtor/evento/${eventId}/escolas`)}
          />
          <NavItem
            to={`/area-do-produtor/evento/${eventId}/atletas`}
            icon={Users}
            label="Atletas"
            active={isActive(`/area-do-produtor/evento/${eventId}/atletas`)}
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
            to={`/area-do-produtor/comunicacao?eventId=${eventId}`}
            icon={Megaphone}
            label="Avisos e Boletins"
            active={location.pathname === '/area-do-produtor/comunicacao' && location.search.includes(`eventId=${eventId}`)}
          />
        </div>
      </div>


      <div className="p-4 border-t border-border/50">
        <button
          onClick={() => navigate('/area-do-produtor/cadastro-basico/evento')}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 w-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Lista
        </button>
      </div>
    </aside >
  )
}
