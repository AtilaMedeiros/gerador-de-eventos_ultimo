import { Separator } from '@/components/ui/separator'

interface PublicPartnersProps {
  realizers?: string[]
  supporters?: string[]
}

export function PublicPartners({ realizers = [], supporters = [] }: PublicPartnersProps) {
  // Fallback for demo if no props passed (optional, or just remove)
  // But for "Essas logos" (referring to uploaded ones), we should prioritize props.
  // If props are empty, currently we might want to show nothing?
  // Or if the user meant "Change the layout to this", I should just ensure layout matches.

  // Let's assume we want to show the uploaded images.
  // If no images uploaded, we hide the section? or show placeholders?
  // Given the previous contest, likely we want to show the uploaded ones.

  const hasContent = realizers.length > 0 || supporters.length > 0

  // If no content, maybe return null? Or render with placeholders as fallback?
  // I will interpret "Essas logos" as the user wanting the uploaded logos to show up here.

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

          {/* Fallback if both empty - keeping original placeholders for development/demo if needed, or removing? 
              The user didn't ask to remove placeholders, but "Essas logos" (referring to uploaded) implies replacement.
              However, if I remove placeholders and valid data isn't passed yet, section disappears.
              I will assume the user will test with data. 
          */}
        </div>
      </div>
    </section>
  )
}
