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
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useParticipant } from '@/contexts/ParticipantContext'
import { Calendar, FileText, LogOut, User, Settings } from 'lucide-react'

export function ParticipantHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { school } = useParticipant()

  const handleLogout = () => {
    logout()
    navigate('/area-do-participante/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-subtle">
      <div className="flex items-center gap-2 font-bold text-lg md:hidden">
        GeradorEventos
      </div>

      <div className="hidden md:block flex-1">
        <h1 className="text-lg font-semibold text-foreground">
          {school?.name || 'Área do Participante'}
        </h1>
        {school && (
          <p className="text-xs text-muted-foreground">INEP: {school.inep}</p>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/area-do-participante/inicio')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Eventos
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/area-do-participante/fichas')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Fichas
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://img.usecurling.com/ppl/thumbnail?gender=female"
                  alt="@usuario"
                />
                <AvatarFallback>
                  {user?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/area-do-participante/escola')}
            >
              <User className="mr-2 h-4 w-4" /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('#')}>
              <Settings className="mr-2 h-4 w-4" /> Alterar Senha
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
