import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Rocket,
  AlertTriangle,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PublicHeader } from '@/pages/public/components/PublicHeader'
import { PublicHero } from '@/pages/public/components/PublicHero'
import { NewsCarousel } from '@/pages/public/components/NewsCarousel'
import { PublicAbout } from '@/pages/public/components/PublicAbout'
import { PublicPartners } from '@/pages/public/components/PublicPartners'
import { PublicFooter } from '@/pages/public/components/PublicFooter'
import { Event } from '@/contexts/EventContext'

interface EventPreviewProps {
  data: Event
  onClose: () => void
  onPublish: () => void
}

export function EventPreview({ data, onClose, onPublish }: EventPreviewProps) {
  // Map Event data to PublicHero props
  const eventForHero = {
    name: data.name,
    location: data.location || 'Local a definir',
    dataInicio: data.startDate instanceof Date ? data.startDate : new Date(data.startDate),
    dataFim: data.endDate instanceof Date ? data.endDate : new Date(data.endDate),
    inscricaoIndividualInicio: data.registrationIndividualStart ? (data.registrationIndividualStart instanceof Date ? data.registrationIndividualStart : new Date(data.registrationIndividualStart)) : new Date(),
    inscricaoIndividualFim: data.registrationIndividualEnd ? (data.registrationIndividualEnd instanceof Date ? data.registrationIndividualEnd : new Date(data.registrationIndividualEnd)) : new Date(),
    inscricaoColetivaInicio: data.registrationCollectiveStart ? (data.registrationCollectiveStart instanceof Date ? data.registrationCollectiveStart : new Date(data.registrationCollectiveStart)) : new Date(),
    inscricaoColetivaFim: data.registrationCollectiveEnd ? (data.registrationCollectiveEnd instanceof Date ? data.registrationCollectiveEnd : new Date(data.registrationCollectiveEnd)) : new Date(),
    coverImage: data.coverImage,
  }

  return (
    <div className="flex flex-col h-[90vh] w-full bg-background rounded-lg overflow-hidden border shadow-2xl animate-in zoom-in-95 duration-300">
      {/* Preview Header Bar */}
      <div className="bg-primary/5 border-b p-4 flex items-center justify-between shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-background text-foreground border-primary/50 px-3 py-1"
          >
            <AlertTriangle className="mr-1 h-3 w-3 text-warning" />
            Modo de Pré-visualização
          </Badge>
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Verifique como os participantes verão o evento antes de publicar.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao Formulário</span>
          </Button>
          <Button
            onClick={onPublish}
            className="bg-success hover:bg-success/90 text-white gap-2 shadow-sm"
          >
            <Rocket className="h-4 w-4" />
            Publicar Agora
          </Button>
        </div>
      </div>

      {/* 
         Preview Content Container 
         Using translate-x-0 to create a containing block for 'fixed' children (like PublicHeader)
         So they stick to this scroll view, not the browser window.
      */}
      <ScrollArea className="flex-1 bg-white relative">
        <div className="min-h-full flex flex-col transform translate-x-0 relative">
          {/* PublicHeader receives title */}
          <div className="sticky top-0 z-40 w-full">
            {/* 
                  Note: PublicHeader uses 'fixed'. Inside a transformed container, fixed behaves like absolute to the container.
                  Use 'sticky' wrapper here to emulate behavior or rely on exact Structure.
                  However, PublicHeader has logic for scrolling.
                  If we can't easily modify PublicHeader, we just let it be.
               */}
            <PublicHeader title={data.name} />
          </div>

          <main className="flex-1">
            <PublicHero event={eventForHero} plantaoItems={[]} />

            {/* NewsCarousel might be empty if no ID overlap, but we render it as requested */}
            <NewsCarousel />

            <PublicAbout description={data.description} />

            <PublicPartners
              realizers={data.realizerLogos || []}
              supporters={data.supporterLogos || []}
            />
          </main>

          <PublicFooter eventName={data.name} />
        </div>
      </ScrollArea>
    </div>
  )
}
