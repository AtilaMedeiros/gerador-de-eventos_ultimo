import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Home, Megaphone, FileText, LogIn } from 'lucide-react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface PublicHeaderProps {
  title: string
}

export function PublicHeader({ title }: PublicHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { slug, id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const eventBaseUrl = `/evento/${slug}/${id}`
  const communicationUrl = `${eventBaseUrl}/comunicacao`
  const regulationUrl = `${eventBaseUrl}/comunicacao?tab=regulamentos`

  const isHome = location.pathname === eventBaseUrl
  const isCommunication =
    location.pathname === communicationUrl &&
    !location.search.includes('tab=regulamentos')
  const isRegulation =
    location.pathname === communicationUrl &&
    location.search.includes('tab=regulamentos')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link
        to={eventBaseUrl}
        className={cn(
          'text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2',
          mobile ? 'w-full py-4 text-lg border-b border-border/10' : 'py-2',
          !mobile && isHome
            ? 'text-primary'
            : !mobile && isScrolled
              ? 'text-slate-600 hover:text-primary'
              : !mobile
                ? 'text-white/90 hover:text-white'
                : '',
          mobile && isHome ? 'text-primary' : 'text-foreground/80',
        )}
      >
        {mobile && <Home className="h-5 w-5" />}
        INÍCIO
        {!mobile && isHome && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
        )}
      </Link>
      <Link
        to={communicationUrl}
        className={cn(
          'text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2',
          mobile ? 'w-full py-4 text-lg border-b border-border/10' : 'py-2',
          !mobile && isCommunication
            ? 'text-primary'
            : !mobile && isScrolled
              ? 'text-slate-600 hover:text-primary'
              : !mobile
                ? 'text-white/90 hover:text-white'
                : '',
          mobile && isCommunication ? 'text-primary' : 'text-foreground/80',
        )}
      >
        {mobile && <Megaphone className="h-5 w-5" />}
        COMUNICAÇÃO
      </Link>
      <Link
        to={regulationUrl}
        className={cn(
          'text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2',
          mobile ? 'w-full py-4 text-lg border-b border-border/10' : 'py-2',
          !mobile && isRegulation
            ? 'text-primary'
            : !mobile && isScrolled
              ? 'text-slate-600 hover:text-primary'
              : !mobile
                ? 'text-white/90 hover:text-white'
                : '',
          mobile && isRegulation ? 'text-primary' : 'text-foreground/80',
        )}
      >
        {mobile && <FileText className="h-5 w-5" />}
        REGULAMENTO
      </Link>
    </>
  )

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-slate-200/50'
          : 'bg-transparent border-transparent py-6',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg text-lg transform group-hover:rotate-6 transition-transform duration-300">
            JE
          </div>
          <span
            className={cn(
              'text-xl font-bold tracking-tight transition-colors hidden sm:block uppercase',
              isScrolled ? 'text-slate-900' : 'text-white',
            )}
          >
            {title}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 relative">
          <NavLinks />
          <div className="h-6 w-px bg-current opacity-20 mx-2" />
          <Button
            size="sm"
            className={cn(
              'font-bold shadow-md transition-all duration-300 hover:scale-105 px-6 rounded-full',
              isScrolled
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-white text-primary hover:bg-white/90',
            )}
            onClick={() => navigate('/area-do-participante/login')}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Área do Participante
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  !isScrolled &&
                    'text-white hover:bg-white/20 hover:text-white',
                )}
              >
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] bg-white/95 backdrop-blur-xl border-l border-white/20">
              <div className="flex flex-col h-full mt-6">
                <div className="mb-8 px-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Navegação
                  </span>
                </div>
                <nav className="flex flex-col gap-2 px-2">
                  <NavLinks mobile />
                </nav>
                <div className="mt-auto mb-8 px-2">
                  <Button
                    className="w-full shadow-lg font-bold text-lg h-14 rounded-xl"
                    onClick={() => navigate('/area-do-participante/login')}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Login
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
