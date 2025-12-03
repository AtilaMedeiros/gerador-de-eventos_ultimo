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
  }
}

export function PublicHero({ event }: PublicHeroProps) {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 bg-slate-950">
      {/* Dynamic Background Image with Blur and Dim */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-10" />
        <img
          src="https://img.usecurling.com/p/1920/1080?q=stadium%20night%20atmosphere&color=blue"
          alt="Event Background"
          className="w-full h-full object-cover scale-105 animate-[pulse_15s_infinite_alternate] opacity-60 blur-[2px]"
        />
        {/* Overlay Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-10" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-0" />

      <div className="container mx-auto px-4 relative z-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8 animate-in slide-in-from-left duration-1000 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-lg hover:bg-white/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              Temporada {new Date().getFullYear()}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
            {event.name}
          </h1>

          {/* Key Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group cursor-default">
              <div className="p-2.5 bg-primary/20 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Evento
                </p>
                <p className="font-bold text-white text-sm leading-tight">
                  {format(event.dataInicio, 'dd/MM', { locale: ptBR })} a{' '}
                  {format(event.dataFim, 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group cursor-default">
              <div className="p-2.5 bg-orange-500/20 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Insc. Coletivas
                </p>
                <p className="font-bold text-white text-sm leading-tight">
                  Até{' '}
                  {format(event.inscricaoColetivaFim, 'dd/MM', {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group cursor-default sm:col-span-2">
              <div className="p-2.5 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Local
                </p>
                <p className="font-bold text-white text-sm leading-tight">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-8 h-auto shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:shadow-[0_0_50px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all duration-300 rounded-2xl group border-t border-white/20"
              onClick={() => navigate('/area-do-participante/login')}
            >
              <Ticket className="mr-3 h-6 w-6 animate-pulse" />
              INSCREVA-SE AGORA
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Visual Element */}
        <div className="hidden lg:block relative animate-in slide-in-from-right duration-1000 delay-300 fade-in">
          <div className="relative z-10 group perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-blue-500 to-purple-600 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-500 animate-pulse" />
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl aspect-[4/3] transform group-hover:rotate-1 transition-transform duration-500 ease-out">
              <img
                src="https://img.usecurling.com/p/800/600?q=athlete%20celebrating&color=blue&dpr=2"
                alt="Promo"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-white uppercase border border-white/10">
                    Destaque
                  </span>
                </div>
                <p className="text-white font-bold text-3xl leading-tight drop-shadow-lg">
                  Momentos Inesquecíveis
                </p>
                <p className="text-slate-300 text-sm mt-2 max-w-xs">
                  Prepare-se para a maior competição do ano.
                </p>
              </div>
            </div>

            {/* Decorative Floating Circles */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 animate-[bounce_3s_infinite]" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-xl opacity-60 animate-[bounce_4s_infinite]" />
          </div>
        </div>
      </div>
    </section>
  )
}
