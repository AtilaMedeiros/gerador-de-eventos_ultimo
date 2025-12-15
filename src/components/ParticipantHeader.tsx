import { useMemo } from 'react'
import { INITIAL_SCHOOLS } from '@/backend/banco/escolas'
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
import { useEvent } from '@/contexts/EventContext'
import { useAuth } from '@/contexts/AuthContext'
import { useParticipant } from '@/contexts/ParticipantContext'
import { LogOut, User, Settings } from 'lucide-react'
import { RiSwap2Line } from "react-icons/ri";

export function ParticipantHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { school, selectedEventId, selectEvent } = useParticipant()
  const { events } = useEvent()

  // Filter events where the school is registered (Logic: Match INEP across all school records)
  const availableEvents = useMemo(() => {
    if (!school?.inep) return []

    // 1. Get global list of schools to find other registrations for the same INEP
    let allSchools: any[] = []
    try {
      const stored = localStorage.getItem('ge_schools_list')
      if (stored) allSchools = JSON.parse(stored)
      else allSchools = INITIAL_SCHOOLS
    } catch (e) {
      allSchools = INITIAL_SCHOOLS
    }

    // 2. Find all records matching this INEP
    const linkedSchools = allSchools.filter((s: any) => s.inep === school.inep)
    // Ensure current session school is included
    if (!linkedSchools.find((s: any) => s.id === school.id)) {
      linkedSchools.push(school)
    }

    // 3. Collect all Event IDs linked to this INEP
    const allowedEventIds = new Set<string>()
    linkedSchools.forEach((s: any) => {
      if (s.eventId) allowedEventIds.add(s.eventId)
      if (s.eventIds && Array.isArray(s.eventIds)) {
        s.eventIds.forEach((id: string) => allowedEventIds.add(id))
      }
    })

    // 4. Return events that match the allowed IDs
    return events.filter(e => allowedEventIds.has(e.id))
  }, [events, school])

  // Current event can be outside available if data is desynced, but we display it anyway if selected
  const currentEvent = events.find(e => e.id === selectedEventId) || (availableEvents.length > 0 ? availableEvents[0] : (events.length > 0 ? events[0] : null))

  const handleLogout = () => {
    logout()
    navigate('/area-do-participante/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-subtle">
      <div className="flex items-center gap-2 font-bold text-lg md:hidden">
        GeradorEventos
      </div>

      <div className="hidden md:flex flex-1 items-center gap-6">
        {currentEvent && (
          <>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11 text-muted-foreground hover:text-primary [&_svg]:!size-7">
                    <RiSwap2Line className="!h-7 !w-7" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Trocar Evento</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableEvents.length > 0 ? (
                    availableEvents.map(event => (
                      <DropdownMenuItem
                        key={event.id}
                        onClick={() => selectEvent(event.id)}
                        className={event.id === selectedEventId ? "bg-primary/10 text-primary font-medium" : ""}
                      >
                        {event.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground text-center">
                      Nenhum evento vinculado.
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <div>
                <p className="text-lg font-bold text-primary truncate max-w-[400px] leading-tight">
                  {currentEvent.name}
                </p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">
                  Evento Atual
                </p>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
          </>
        )}

        <div>
          <h1 className="text-lg font-semibold text-foreground leading-tight">
            {school?.name || 'Área do Participante'}
          </h1>
          {school && (
            <p className="text-xs text-muted-foreground">INEP: {school.inep}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">


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
