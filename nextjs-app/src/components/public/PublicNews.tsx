'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar, User, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link, useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface NewsItem {
    id: string
    title: string
    category: string
    description: string
    date: string
    author: string
}

interface PublicNewsProps {
    news: any[]
}

export function PublicNews({ news }: PublicNewsProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const router = useRouter()
    const params = useParams()

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
            <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
            <section
                className="py-12 bg-white"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="container max-w-5xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 mb-1 uppercase italic">
                                Últimas <span className="text-blue-600">Notícias</span>
                            </h2>
                            <div className="h-0.5 w-16 bg-blue-600 skew-x-[-12deg]"></div>
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

                            {/* Highlight (Left - Visual) */}
                            <div className="lg:col-span-4 relative group overflow-hidden min-h-[220px] bg-slate-900 border-r border-white/10 flex flex-col justify-between p-5">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-0"></div>
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-slate-900 to-transparent"></div>

                                <div className="relative z-10 w-full flex justify-between items-start">
                                    <span className="bg-blue-600 text-white font-black px-2.5 py-0.5 text-[10px] uppercase tracking-wider skew-x-[-12deg] inline-block">
                                        {activeNews.category}
                                    </span>
                                </div>

                                <div className="relative z-10 mt-auto">
                                    <div key={activeNews.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="h-0.5 w-8 bg-blue-600 mb-3"></div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white uppercase leading-tight line-clamp-3">
                                            {activeNews.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                                    {!isHovering && (
                                        <div
                                            key={`progress-visual-${activeIndex}`}
                                            className="h-full bg-blue-600 origin-left"
                                            style={{
                                                animation: 'progress 5s linear forwards'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Highlight Content (Right - Text) */}
                            <div className="lg:col-span-8 p-5 lg:p-6 flex flex-col justify-center relative bg-white text-slate-900">
                                <div key={activeNews.id + '-content'} className="animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-2 text-slate-500 mb-4 font-mono text-[10px] tracking-widest uppercase">
                                        <Calendar className="w-3 h-3 text-blue-600" />
                                        {activeNews.date}
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight mb-4 uppercase">
                                        {activeNews.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm md:text-base mb-6 line-clamp-3 max-w-3xl leading-relaxed">
                                        {activeNews.description}
                                    </p>

                                    <button
                                        onClick={() => router.push(`/evento/${params.slug}/${params.id}/comunicacao`)}
                                        className="group flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase text-[10px] hover:text-blue-600 transition-colors mt-auto w-fit cursor-pointer"
                                    >
                                        <div className="w-8 h-[1px] bg-slate-200 group-hover:bg-blue-600 transition-colors relative">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-900 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                                        </div>
                                        Ler Matéria Completa
                                    </button>
                                </div>

                                {/* Progress Bar - Bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                                    {!isHovering && (
                                        <div
                                            key={`progress-${activeIndex}`}
                                            className="h-full bg-blue-600 origin-left"
                                            style={{
                                                animation: 'progress 5s linear forwards'
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* List of Next Items */}
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
                                            <span className="font-mono text-[10px] transition-colors text-slate-400 group-hover:text-blue-600">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider transition-colors text-slate-400 group-hover:text-blue-600">
                                                {newsItem.category}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-bold uppercase transition-colors line-clamp-2 leading-snug text-slate-700 group-hover:text-slate-900">
                                            {newsItem.title}
                                        </h4>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 transition-all transform shrink-0 ml-3 text-blue-600/50 -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export function NewsCarousel({ news }: { news: any[] }) {
    const router = useRouter()
    const params = useParams()

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Urgente': return 'bg-red-100 text-red-700'
            case 'Informativo': return 'bg-blue-100 text-blue-700'
            case 'Plantão': return 'bg-yellow-100 text-yellow-800'
            case 'Geral': return 'bg-slate-100 text-slate-700'
            case 'Programação': return 'bg-purple-100 text-purple-700'
            default: return 'bg-green-100 text-green-700'
        }
    }

    const slides = news.map(notice => ({
        id: notice.id,
        type: notice.category,
        typeColor: getCategoryColor(notice.category),
        title: notice.title,
        description: notice.description,
        date: notice.date, // Already formatted
        author: notice.author || 'Organização',
    }))

    // Duplicate if few items for carousel feel (optional, simplified here)
    const displaySlides = slides.length > 0 && slides.length < 4
        ? [...slides, ...slides, ...slides].slice(0, 6)
        : slides

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

    const cardWidth = 352
    const cardGap = 16

    useEffect(() => {
        if (isAutoPlaying && displaySlides.length > 1) {
            autoPlayRef.current = setInterval(() => {
                nextSlide()
            }, 8000)
        }
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current)
        }
    }, [isAutoPlaying, currentIndex, displaySlides.length])

    const nextSlide = () => {
        if (displaySlides.length === 0) return
        setCurrentIndex((prev) => (prev + 1) % displaySlides.length)
    }

    const prevSlide = () => {
        if (displaySlides.length === 0) return
        setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
    }

    const translateX = `calc(-${cardWidth + cardGap}px * ${currentIndex} + 50% - ${cardWidth / 2}px)`

    if (displaySlides.length === 0) return null

    return (
        <section className="w-full max-w-7xl mx-auto flex flex-col items-center pt-8 pb-16 px-4 bg-white overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-4 mb-12 border-b border-slate-200 pb-4">
                <div className="relative inline-block">
                    <h2 className="text-2xl md:text-3xl uppercase italic leading-none tracking-[-0.08em]" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                        <span className="text-slate-900">Últimas</span>
                        <span className="text-blue-600 ml-1">Notícias</span>
                    </h2>
                    <div className="absolute left-1 -bottom-3 h-2 w-24 bg-blue-600 skew-x-[-12deg]"></div>
                </div>
            </div>

            <div className="relative w-full max-w-4xl">
                <div className="overflow-hidden py-4">
                    <div
                        className="flex transition-transform duration-[2000ms] ease-out"
                        style={{
                            transform: `translateX(${translateX})`,
                            gap: `${cardGap}px`
                        }}
                    >
                        {displaySlides.map((slide, index) => {
                            const isActive = index === currentIndex
                            return (
                                <div
                                    key={`${slide.id}-${index}`}
                                    onClick={() => router.push(`/evento/${params.slug}/${params.id}/comunicacao`)}
                                    className={cn(
                                        "flex-shrink-0 transition-all duration-500 cursor-pointer",
                                        isActive ? "scale-110 opacity-100 z-10" : "scale-90 opacity-60"
                                    )}
                                    style={{ width: `${cardWidth}px` }}
                                >
                                    <div className={cn(
                                        "rounded-xl flex flex-col h-[240px] transition-all duration-300 overflow-hidden",
                                        isActive
                                            ? "bg-white shadow-2xl border border-slate-100"
                                            : "bg-white border border-slate-200 shadow-md"
                                    )}>
                                        <div className="p-6 h-full flex flex-col">
                                            <div className="mb-2 shrink-0">
                                                <h2 className="text-xl font-bold text-slate-800 line-clamp-1 leading-tight">
                                                    {slide.title}
                                                </h2>
                                                <div className="mt-2 h-px w-1/3 bg-blue-600"></div>
                                            </div>

                                            <p className="text-sm text-slate-600 mb-4 flex-grow leading-relaxed line-clamp-3">
                                                {slide.description}
                                            </p>

                                            <div className="flex flex-col items-end space-y-3 text-sm shrink-0">
                                                <div className="flex items-center text-slate-500">
                                                    <span className="mr-2">{slide.date}</span>
                                                    <Calendar size={18} className="text-blue-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Navigation Buttons */}
                {displaySlides.length > 1 && (
                    <>
                        <button
                            onClick={() => { prevSlide(); setIsAutoPlaying(false) }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200 shadow-md hover:bg-white transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-blue-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => { nextSlide(); setIsAutoPlaying(false) }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200 shadow-md hover:bg-white transition-all duration-300 flex items-center justify-center text-slate-600 hover:text-blue-600"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>
        </section>
    )
}
