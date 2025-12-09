import { Button } from '@/components/ui/button'
import { Calendar, Ticket, ArrowRight, Users, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'

interface PublicHeroProps {
  event: {
    name: string
    location: string
    dataInicio: Date
    dataFim: Date
    inscricaoIndividualFim: Date
    inscricaoColetivaFim: Date
    coverImage?: string
  }
}

export function PublicHero({ event }: PublicHeroProps) {
  const navigate = useNavigate()

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-slate-950 py-12 lg:py-20">
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight drop-shadow-lg">
            {event.name}
          </h1>

          <div className="space-y-3 font-medium text-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-300" />
              <p className="text-sm md:text-base">
                {format(event.dataInicio, 'dd MMM - yyyy', { locale: ptBR })} •{' '}
                {format(event.dataInicio, 'HH:mm')} &gt;{' '}
                {format(event.dataFim, 'dd MMM - yyyy', { locale: ptBR })} •{' '}
                {format(event.dataFim, 'HH:mm')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-300" />
              <p className="text-sm md:text-base">
                Evento presencial em <span className="text-blue-400 font-semibold">{event.location}</span>
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-[5px] shadow-lg gap-2"
              onClick={() => navigate('/area-do-participante/login')}
            >
              <Ticket className="w-5 h-5" />
              FAZER INSCRIÇÃO
            </Button>
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
    </section>
  )
}
