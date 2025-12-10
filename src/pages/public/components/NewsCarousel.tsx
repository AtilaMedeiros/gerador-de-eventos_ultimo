import { useState, useRef, useEffect } from 'react'
import { Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParams } from 'react-router-dom'
import { useCommunication } from '@/contexts/CommunicationContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Slide {
    id: string
    type: string
    typeColor: string
    title: string
    description: string
    date: string
    author: string
}

export function NewsCarousel() {
    const { id } = useParams()
    const { notices } = useCommunication()

    // Filter notices for this event and category 'Últimas Notícias'
    const eventNotices = notices.filter(
        n => n.eventId === id && n.category === 'Últimas Notícias'
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Urgente': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
            case 'Informativo': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
            case 'Plantão': return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300'
            case 'Geral': return 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300'
            case 'Programação': return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300'
            default: return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
        }
    }

    // Convert to slides format
    const baseSlides: Slide[] = eventNotices.map(notice => ({
        id: notice.id,
        type: notice.category,
        typeColor: getCategoryColor(notice.category),
        title: notice.title,
        description: notice.description,
        date: format(new Date(notice.date), "dd 'de' MMM yyyy", { locale: ptBR }),
        author: notice.author,
    }))

    // For infinite effect, duplicate slides if needed
    let slides: Slide[] = [...baseSlides]
    if (baseSlides.length > 0 && baseSlides.length < 4) {
        // Duplicate to have at least 4 slides for visual effect
        while (slides.length < 4) {
            slides = [...slides, ...baseSlides.map((s, i) => ({ ...s, id: `${s.id}-dup-${slides.length + i}` }))]
        }
    }

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

    // Card dimensions
    const cardWidth = 352
    const cardGap = 16

    // Auto Play Logic
    useEffect(() => {
        if (isAutoPlaying && slides.length > 1) {
            autoPlayRef.current = setInterval(() => {
                nextSlide()
            }, 6000)
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current)
            }
        }
    }, [isAutoPlaying, currentIndex, slides.length])

    const resetAutoPlay = () => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current)
        }
        if (slides.length > 1) {
            autoPlayRef.current = setInterval(() => {
                nextSlide()
            }, 4000)
        }
    }

    const nextSlide = () => {
        if (slides.length === 0) return
        setCurrentIndex((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        if (slides.length === 0) return
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }

    const handleManualNext = () => {
        nextSlide()
        resetAutoPlay()
    }

    const handleManualPrev = () => {
        prevSlide()
        resetAutoPlay()
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
        resetAutoPlay()
    }

    // Calculate transform to center the active card
    // Formula: translateX(calc(-cardWidth * currentIndex + 50% - cardWidth/2))
    const translateX = `calc(-${cardWidth + cardGap}px * ${currentIndex} + 50% - ${cardWidth / 2}px)`

    if (slides.length === 0) {
        return null
    }

    return (
        <section className="w-full max-w-7xl mx-auto flex flex-col items-center pt-8 pb-16 px-4 bg-white dark:bg-slate-950">
            {/* Title preserved */}
            <div className="w-full max-w-7xl mx-auto px-4 mb-12 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="relative inline-block">
                    <h2 className="text-2xl md:text-3xl uppercase italic leading-none tracking-[-0.08em]" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                        <span className="text-slate-900 dark:text-white">Últimas</span>
                        <span className="text-primary ml-1">Notícias</span>
                    </h2>
                    {/* Blue line under 'Últimas' */}
                    <div className="absolute left-1 -bottom-3 h-2 w-24 bg-primary skew-x-[-12deg]"></div>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative w-full max-w-4xl">
                <div className="overflow-hidden py-4">
                    <div
                        className="flex transition-transform duration-900 ease-out"
                        style={{
                            transform: `translateX(${translateX})`,
                            gap: `${cardGap}px`
                        }}
                    >
                        {slides.map((slide, index) => {
                            const isActive = index === currentIndex
                            return (
                                <div
                                    key={slide.id}
                                    className={cn(
                                        "flex-shrink-0 transition-all duration-500",
                                        isActive ? "scale-100 opacity-100" : "scale-95 opacity-60"
                                    )}
                                    style={{ width: `${cardWidth}px` }}
                                >
                                    <div className={cn(
                                        "rounded-xl flex flex-col h-[240px] transition-all duration-300 overflow-hidden",
                                        isActive
                                            ? "bg-white dark:bg-slate-800 shadow-2xl"
                                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md"
                                    )}>
                                        <div className="p-6 h-full flex flex-col">
                                            <div className="mb-2 shrink-0">
                                                <h2 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1 leading-tight">
                                                    {slide.title}
                                                </h2>
                                                <div className="mt-2 h-px w-1/3 bg-primary"></div>
                                            </div>

                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow leading-relaxed line-clamp-3">
                                                {slide.description}
                                            </p>

                                            <div className="flex flex-col items-end space-y-3 text-sm shrink-0">
                                                <div className="flex items-center text-slate-500 dark:text-slate-400">
                                                    <span className="mr-2">{slide.date}</span>
                                                    <Calendar size={18} className="text-primary" />
                                                </div>
                                                <div className="flex items-center text-slate-500 dark:text-slate-400">
                                                    <span className="mr-2">{slide.author}</span>
                                                    <User size={18} className="text-primary" />
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
                {slides.length > 1 && (
                    <>
                        <button
                            onClick={handleManualPrev}
                            aria-label="Anterior"
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleManualNext}
                            aria-label="Próximo"
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="flex justify-center space-x-2 mt-12">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                index === currentIndex
                                    ? "bg-primary ring-2 ring-primary/50"
                                    : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                            )}
                            aria-label={`Ir para slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
