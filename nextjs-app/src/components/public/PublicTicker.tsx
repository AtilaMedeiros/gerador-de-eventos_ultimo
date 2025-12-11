'use client'

import { Zap, Radio } from 'lucide-react'

interface PublicTickerProps {
    items: { title: string; description: string }[]
}

export function PublicTicker({ items }: PublicTickerProps) {
    if (items.length === 0) return null

    // No duplication - display original items only
    const tickerItems = items

    return (
        <>
            <style jsx global>{`
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
