import { Button } from '@/components/ui/button'
import { Calendar, Ticket, ArrowRight, Users, MapPin, User } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { PublicTicker } from './PublicNews'

interface PublicHeroProps {
  event: {
    name: string
    location: string
    dataInicio: Date
    dataFim: Date
    inscricaoIndividualInicio: Date
    inscricaoIndividualFim: Date
    inscricaoColetivaInicio: Date
    inscricaoColetivaFim: Date
    coverImage?: string
  }
  plantaoItems?: string[]
}

export function PublicHero({ event, plantaoItems }: PublicHeroProps) {
  const navigate = useNavigate()

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-slate-950 py-16 lg:py-28 min-h-[480px]">
      {/* Dynamic Background Image with Blur and Dim */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-10" />
        <img
          src={
            event.coverImage ||
            'https://img.usecurling.com/p/1920/1080?q=stadium%20night%20atmosphere&color=blue'
          }
          alt="Event Background"
          className="w-full h-full object-cover opacity-60 blur-md"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Content - Event Info */}
        <div className="space-y-6 text-white max-w-2xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-tight drop-shadow-lg">
            {event.name}
          </h1>

          <ul className="space-y-3">
            {/* Event Dates */}
            <li className="flex items-center gap-3 text-blue-50 text-sm md:text-base font-light group">
              <div className="p-2 bg-white/5 rounded-lg backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300">
                <Calendar className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300 capitalize">
                {event.dataInicio.getMonth() === event.dataFim.getMonth()
                  ? `${format(event.dataInicio, 'dd')} a ${format(event.dataFim, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                  : `${format(event.dataInicio, "dd 'de' MMMM", { locale: ptBR })} a ${format(event.dataFim, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                }
              </span>
            </li>

            {/* Individual Registration */}
            <li className="flex items-center gap-3 text-blue-50 text-sm md:text-base font-light group">
              <div className="p-2 bg-white/5 rounded-lg backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300">
                <User className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                Inscrições Individuais: De {format(event.inscricaoIndividualInicio, "dd/MM", { locale: ptBR })} até {format(event.inscricaoIndividualFim, "dd/MM", { locale: ptBR })}
              </span>
            </li>

            {/* Collective Registration */}
            <li className="flex items-center gap-3 text-blue-50 text-sm md:text-base font-light group">
              <div className="p-2 bg-white/5 rounded-lg backdrop-blur-md border border-white/10 shadow-inner group-hover:bg-blue-400/20 group-hover:border-blue-400/50 transition-all duration-300">
                <Users className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                Inscrições Coletivas: De {format(event.inscricaoColetivaInicio, "dd/MM", { locale: ptBR })} até {format(event.inscricaoColetivaFim, "dd/MM", { locale: ptBR })}
              </span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={() => navigate('/area-do-participante/login')}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 bg-[#65a30d] hover:bg-[#65a30d]/90 text-white font-bold text-base px-8 py-6 rounded-xl shadow-[0_10px_30px_rgba(101,163,13,0.4)] hover:shadow-[0_15px_40px_rgba(101,163,13,0.6)] transition-all duration-300 transform hover:-translate-y-1 group border-t border-white/20 w-full md:w-auto"
            >
              <Ticket className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" aria-hidden="true" />
              INSCREVA-SE AGORA
            </button>
          </div>

        </div>

        {/* Right Content - Visual Element (Cover Image) */}
        <div className="hidden lg:block relative justify-self-end w-full max-w-xl">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video">
            <img
              src={
                event.coverImage ||
                'https://img.usecurling.com/p/1920/1080?q=event%20promo&color=blue'
              }
              alt={event.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            {/* Share Button Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white hover:bg-white/90 text-slate-900 font-bold rounded-full shadow-lg gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-[-45deg] text-blue-600" />
                COMPARTILHAR
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <PublicTicker items={plantaoItems || []} />
      </div>
    </section>
  )
}
