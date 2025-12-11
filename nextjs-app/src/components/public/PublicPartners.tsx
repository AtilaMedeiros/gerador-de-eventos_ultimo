'use client'

import { Separator } from '@/components/ui/separator'

interface PublicPartnersProps {
    realizers?: string[]
    supporters?: string[]
}

export function PublicPartners({ realizers = [], supporters = [] }: PublicPartnersProps) {
    // Use mock logos if none provided (as in legacy sample)
    // In a real scenario, we might want to hide sections if empty, 
    // but for the demo/mock feel we might want placeholders or just hide.
    // The legcy implementation hid if empty.

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 text-center">
                <div className="mb-12 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Nossos Parceiros
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Instituições e empresas que acreditam no poder transformador do
                        esporte e tornam este evento possível.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Realization */}
                    {realizers.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 max-w-xs mx-auto">
                                <Separator className="flex-1" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    Realização
                                </p>
                                <Separator className="flex-1" />
                            </div>
                            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                                {realizers.map((logo, i) => (
                                    <img
                                        key={i}
                                        src={logo}
                                        alt="Parceiro Realizador"
                                        className="h-24 md:h-40 object-contain hover:scale-110 transition-all duration-500"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Support */}
                    {supporters.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 max-w-xs mx-auto">
                                <Separator className="flex-1" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    Apoio
                                </p>
                                <Separator className="flex-1" />
                            </div>
                            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
                                {supporters.map((logo, i) => (
                                    <img
                                        key={i}
                                        src={logo}
                                        alt="Apoiador"
                                        className="h-16 md:h-24 object-contain hover:scale-105 transition-all duration-500"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
