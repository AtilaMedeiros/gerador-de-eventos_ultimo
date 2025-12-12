import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Bell, Menu, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEvent } from '@/contexts/EventContext'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function DashboardHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const { hasPermission, user } = useAuth()
  const { getEventById } = useEvent()

  // Try to get eventId from params or parse it from location if needed
  // The route structure is /area-do-produtor/evento/:eventId/...
  // If DashboardHeader is rendered inside the route context, params.eventId should be available.
  // However, if it's a shared component used in different contexts, we might need to be careful.
  const eventId = params.eventId || location.pathname.split('/evento/')[1]?.split('/')[0]
  const event = eventId ? getEventById(eventId) : undefined

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/area-do-produtor/inicio')) return 'Visão Geral'
    if (path.includes('/area-do-produtor/evento') && !path.includes('/dashboard'))
      return path.includes('/novo') ? 'Criar Evento' : 'Gerenciar Eventos'
    if (path.includes('/area-do-produtor/modalidades'))
      return 'Catálogo de Modalidades'
    if (path.includes('/area-do-produtor/identidade-visual'))
      return 'Temas & Identidade'
    if (path.includes('/area-do-produtor/usuarios'))
      return 'Gestão de Usuários'
    if (path.includes('/area-do-produtor/publicacoes'))
      return 'Publicações'
    if (path.includes('/area-do-produtor/configurar-evento'))
      return 'Configuração do Evento'
    if (path.includes('/area-do-produtor/relatorios'))
      return 'Relatórios e Analytics'
    if (path.includes('/area-do-produtor/perfil')) return 'Perfil do Usuário'
    if (path.includes('/area-do-produtor/configuracoes'))
      return 'Configurações do Sistema'
    // Event Panel routes
    // Event Panel routes
    if (path.includes('/area-do-produtor/evento/')) {
      if (path.includes('/dashboard')) return 'Visão Geral'





      if (path.includes('/publicacoes')) return 'Avisos e Boletins'
      return 'Painel do Evento'
    }

    if (path.includes('/area-do-produtor/escolas')) return 'Escolas'
    if (path.includes('/area-do-produtor/atletas')) return 'Atletas'

    return 'Área do Produtor'
  }



  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm relative">
      {/* Mobile Menu Trigger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            {/* Reusing Sidebar content structure would be ideal here, keeping simple for now */}
            <div className="p-6">
              <h2 className="font-bold text-lg mb-4">Menu</h2>
              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/area-do-produtor/inicio')}
                >
                  Visão Geral
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() =>
                    navigate('/area-do-produtor/evento')
                  }
                >
                  Eventos
                </Button>
                {/* ... other mobile links ... */}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col justify-center z-10">
        <h1 className="text-lg font-bold text-foreground tracking-tight leading-none">
          {getPageTitle()}
        </h1>
        <p className="text-xs text-muted-foreground hidden md:block">
          Bem-vindo à área do produtor de evento.
        </p>
      </div>

      {/* Centered Event Name - Premium Design */}
      {event && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 group cursor-default">
          <div className="p-1 rounded-full text-primary/80 group-hover:text-primary transition-colors">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-foreground/90 tracking-tight group-hover:text-primary transition-colors">
            {event.name}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 ml-auto z-10">


        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full border border-border p-0 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Avatar className="h-full w-full">
                <AvatarImage
                  src="https://img.usecurling.com/ppl/thumbnail?gender=male"
                  alt="@produtor"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/area-do-produtor/perfil')}
            >
              Perfil e Conta
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/area-do-produtor/configuracoes')}
            >
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive"
              onClick={() => navigate('/')}
            >
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
