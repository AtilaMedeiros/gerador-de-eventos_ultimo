import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Zap,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Radio,
} from 'lucide-react'

interface PublicNewsProps {
  news: any[]
}

interface PublicTickerProps {
  items: string[]
}

export function PublicTicker({ items }: PublicTickerProps) {
  if (items.length === 0) return null

  return (
    <div className="bg-slate-900 border-b border-white/10 relative z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-stretch h-12">
          {/* Label */}
          <div className="bg-red-600 px-4 flex items-center justify-center gap-2 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
            <Radio className="h-4 w-4 text-white animate-pulse" />
            <span className="font-black text-white uppercase tracking-wider text-xs md:text-sm">
              PLANTÃO
            </span>
            {/* Slanted edge visual hack */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-slate-900 transform skew-x-12 translate-x-2" />
          </div>

          {/* Ticker Content */}
          <div className="flex-1 flex items-center overflow-hidden relative mask-linear-fade">
            <div className="animate-marquee whitespace-nowrap flex items-center text-white/90 text-sm font-medium">
              {items.map((item, i) => (
                <span key={i} className="mx-8 flex items-center gap-3">
                  <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  {item}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {items.map((item, i) => (
                <span key={`dup-${i}`} className="mx-8 flex items-center gap-3">
                  <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PublicNews({ news }: PublicNewsProps) {
  if (news.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Nenhuma notícia disponível no momento.
          </p>
        </div>
      </section>
    )
  }

  const featuredNews = news[0]
  const secondaryNews = news.slice(1, 5) // Take next 4 items

  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 relative inline-block">
              Últimas Notícias
              <span className="absolute bottom-1 left-0 w-1/2 h-3 bg-primary/20 -z-10" />
            </h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Featured News (Left/Top - Larger) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl">
              <img
                src={featuredNews.image}
                alt={featuredNews.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary hover:bg-primary text-white border-0 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    {featuredNews.category}
                  </Badge>
                  <span className="text-white/70 text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {featuredNews.date}
                  </span>
                </div>

                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-primary-foreground transition-colors">
                  {featuredNews.title}
                </h3>

                <p className="text-white/80 text-base md:text-lg line-clamp-2 mb-6 max-w-3xl">
                  {featuredNews.description}
                </p>

                <div className="flex items-center justify-between">
                  <Button className="bg-white text-slate-900 hover:bg-white/90 font-bold rounded-full px-6">
                    Ler Matéria Completa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Progress Bar Visual */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10">
                  <div
                    className="h-full bg-primary w-0 group-hover:w-full transition-all ease-out"
                    style={{ transitionDuration: '2000ms' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Secondary News Grid (Right/Bottom) */}
          <div className="lg:col-span-5 xl:col-span-4 grid gap-4">
            {secondaryNews.map((item, index) => (
              <div
                key={item.id}
                className="group flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-lg font-black text-xl text-slate-300 border border-gray-100 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  0{index + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-transparent border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all transform group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}

            {/* View All Link */}
            <div className="mt-auto pt-4 text-right">
              <Button
                variant="link"
                className="text-slate-500 hover:text-primary font-semibold gap-2"
              >
                Ver todas as notícias
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
