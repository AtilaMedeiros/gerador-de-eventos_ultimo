import { useState, useEffect } from 'react'
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
  items: { title: string; description: string }[]
}

export function PublicTicker({ items }: PublicTickerProps) {
  if (items.length === 0) return null

  // No duplication - display original items only
  const tickerItems = items

  return (
    <>
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      <div className="relative bg-[#0f172a] text-white overflow-hidden h-12 flex items-center border-b border-[#0f172a]/50 shadow-lg z-20">
        <div className="absolute left-0 top-0 bottom-0 z-20 bg-[#dc2626] px-6 md:px-8 flex items-center gap-3 font-bold uppercase tracking-wider text-xs md:text-sm shadow-xl pr-10 md:pr-12" style={{ clipPath: "polygon(0px 0px, 100% 0px, 85% 100%, 0% 100%)" }}>
          <div className="relative">
            <Radio className="w-4 h-4 md:w-5 md:h-5 relative z-10" aria-hidden="true" />
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50"></div>
          </div>
          Plantão
        </div>

        <div className="flex items-center w-full overflow-hidden pl-32 md:pl-40">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: 'ticker-scroll 40s linear infinite',
            }}
          >
            {tickerItems.map((item, i) => (
              <div key={`ticker-${i}`} className="flex items-center px-8">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-[#f59e0b] mr-3 fill-[#f59e0b] drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] shrink-0" aria-hidden="true" />
                <span className="text-sm md:text-base tracking-wide flex items-center gap-2">
                  <span className="font-bold text-[#f59e0b] uppercase">{item.title}:</span>
                  <span
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    className="[&>p]:inline [&>p]:m-0"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(45deg,transparent_25%,#fff_25%,#fff_50%,transparent_50%,transparent_75%,#fff_75%,#fff_100%)] bg-[length:8px_8px]"></div>
      </div>
    </>
  )
}

export function PublicNews({ news }: PublicNewsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Auto-rotate carousel
  useEffect(() => {
    if (isHovering || news.length <= 1) return

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % news.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [news.length, isHovering])

  if (news.length === 0) return null

  const activeNews = news[activeIndex]
  const nextNews = news.length > 1
    ? [...news.slice(activeIndex + 1), ...news.slice(0, activeIndex)].slice(0, 4)
    : []

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + news.length) % news.length)
  }

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % news.length)
  }

  return (
    <>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
      <section
        className="py-8 bg-white"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 mb-1 uppercase italic">
                Últimas <span className="text-primary">Notícias</span>
              </h2>
              <div className="h-0.5 w-16 bg-primary skew-x-[-12deg]"></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 group"
              >
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="border border-slate-200 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

              {/* Destaque Principal (Esquerda - Visual Gráfico) */}
              <div className="lg:col-span-4 relative group overflow-hidden min-h-[220px] bg-slate-900 border-r border-white/10 flex flex-col justify-between p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0"></div>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-slate-900 to-transparent"></div>

                <div className="relative z-10 w-full flex justify-between items-start">
                  <span className="bg-primary text-primary-foreground font-black px-2.5 py-0.5 text-[10px] uppercase tracking-wider skew-x-[-12deg] inline-block">
                    {activeNews.category}
                  </span>
                </div>

                <div className="relative z-10 mt-auto">
                  <div key={activeNews.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="h-0.5 w-8 bg-primary mb-3"></div>
                    <h3 className="text-xl md:text-2xl font-bold text-white uppercase leading-tight line-clamp-3">
                      {activeNews.title}
                    </h3>
                  </div>
                </div>

                {/* Barra de Progresso do Auto-play */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                  {!isHovering && (
                    <div
                      key={`progress-visual-${activeIndex}`}
                      className="h-full bg-primary origin-left"
                      style={{
                        animation: 'progress 5s linear forwards'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Conteúdo do Destaque (Direita - Texto) */}
              <div className="lg:col-span-8 p-5 lg:p-6 flex flex-col justify-center relative bg-white text-slate-900">
                <div key={activeNews.id + '-content'} className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 text-slate-500 mb-4 font-mono text-[10px] tracking-widest uppercase">
                    <Calendar className="w-3 h-3 text-primary" />
                    {activeNews.date}
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight mb-4 uppercase">
                    {activeNews.title}
                  </h3>

                  <p className="text-slate-600 text-sm md:text-base mb-6 line-clamp-3 max-w-3xl leading-relaxed">
                    {activeNews.description}
                  </p>

                  <button className="group flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase text-[10px] hover:text-primary transition-colors mt-auto w-fit cursor-pointer">
                    <div className="w-8 h-[1px] bg-slate-200 group-hover:bg-primary transition-colors relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-900 rounded-full group-hover:bg-primary transition-colors"></div>
                    </div>
                    Ler Matéria Completa
                  </button>
                </div>

                {/* Barra de Progresso do Auto-play - Na parte INFERIOR do bloco de conteúdo */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                  {!isHovering && (
                    <div
                      key={`progress-${activeIndex}`}
                      className="h-full bg-primary origin-left"
                      style={{
                        animation: 'progress 5s linear forwards'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Lista de Próximas (Abaixo) */}
            <div className="border-t border-slate-100 divide-y divide-slate-100 md:divide-y-0 md:divide-x grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-slate-50">
              {nextNews.map((newsItem, index) => (
                <div
                  key={newsItem.id}
                  onClick={() => {
                    const newIndex = news.findIndex(n => n.id === newsItem.id)
                    if (newIndex !== -1) setActiveIndex(newIndex)
                  }}
                  className="p-4 flex items-center justify-between cursor-pointer transition-colors group relative overflow-hidden hover:bg-white h-full"
                >
                  <div className="flex flex-col gap-1.5 relative z-10 w-full">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] transition-colors text-slate-400 group-hover:text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider transition-colors text-slate-400 group-hover:text-primary">
                        {newsItem.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold uppercase transition-colors line-clamp-2 leading-snug text-slate-700 group-hover:text-slate-900">
                      {newsItem.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 transition-all transform shrink-0 ml-3 text-primary/50 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
