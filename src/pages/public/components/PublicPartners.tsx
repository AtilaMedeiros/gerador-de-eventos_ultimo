import { Separator } from '@/components/ui/separator'

export function PublicPartners() {
  const realizerLogos = [
    'government',
    'education department',
    'sports ministry',
    'city hall',
  ]
  const supporterLogos = [
    'local bank',
    'sports brand',
    'water company',
    'transport',
    'media group',
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-12 space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Nossos Parceiros
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Instituições e empresas que acreditam no poder transformador do
            esporte e tornam este evento possível.
          </p>
        </div>

        <div className="space-y-16">
          {/* Realization */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 max-w-xs mx-auto">
              <Separator className="flex-1" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                Realização
              </p>
              <Separator className="flex-1" />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
              {realizerLogos.map((q, i) => (
                <img
                  key={i}
                  src={`https://img.usecurling.com/i?q=${q}&color=blue&shape=fill`}
                  alt="Parceiro Realizador"
                  className="h-16 md:h-24 object-contain grayscale hover:grayscale-0 opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-500"
                />
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 max-w-xs mx-auto">
              <Separator className="flex-1" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                Apoio
              </p>
              <Separator className="flex-1" />
            </div>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {supporterLogos.map((q, i) => (
                <img
                  key={i}
                  src={`https://img.usecurling.com/i?q=${q}&color=gray&shape=outline`}
                  alt="Apoiador"
                  className="h-10 md:h-14 object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 hover:scale-105 transition-all duration-500"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
