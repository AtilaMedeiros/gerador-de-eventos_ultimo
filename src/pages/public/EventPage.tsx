import { useParams } from 'react-router-dom'
import { PublicHeader } from './components/PublicHeader'
import { PublicHero } from './components/PublicHero'
import { PublicNews, PublicTicker } from './components/PublicNews'
import { PublicAbout } from './components/PublicAbout'
import { PublicPartners } from './components/PublicPartners'
import { PublicFooter } from './components/PublicFooter'
import { useEvent } from '@/contexts/EventContext'
import { useCommunication } from '@/contexts/CommunicationContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function EventPage() {
  const { slug, id } = useParams()
  const { getEventById } = useEvent()
  const { notices } = useCommunication()

  // Get Event Data
  const eventData = id ? getEventById(id) : undefined

  // Use event data or fallback to safe defaults if id is invalid
  const event = eventData
    ? {
      name: eventData.name,
      location: eventData.location || 'Local a definir',
      dataInicio: eventData.startDate,
      dataFim: eventData.endDate,
      inscricaoIndividualInicio: eventData.registrationIndividualStart || new Date(),
      inscricaoIndividualFim: eventData.registrationIndividualEnd || new Date(),
      inscricaoColetivaInicio: eventData.registrationCollectiveStart || new Date(),
      inscricaoColetivaFim: eventData.registrationCollectiveEnd || new Date(),
      coverImage: eventData.coverImage,
      description: eventData.description,
    }
    : {
      name: slug || 'Evento',
      location: 'Local a definir',
      dataInicio: new Date(),
      dataFim: new Date(),
      inscricaoIndividualInicio: new Date(),
      inscricaoIndividualFim: new Date(),
      inscricaoColetivaInicio: new Date(),
      inscricaoColetivaFim: new Date(),
      coverImage: undefined,
      description: undefined,
    }

  // Filter Notices for "Plantão" (Ticker) - Urgent or Plantão categories
  const plantaoNotices = notices
    .filter(
      (n) =>
        n.eventId === id &&
        (n.category === 'Plantão' ||
          n.category === 'plantao' ||
          n.category === 'Urgente'),
    )
    .map((n) => n.title)

  // Filter Notices for "Últimas Notícias" (Featured + Grid)
  // We'll take all other notices as news
  const newsNotices = notices
    .filter(
      (n) =>
        n.eventId === id &&
        n.category !== 'Plantão' &&
        n.category !== 'plantao' &&
        n.category !== 'Urgente',
    )
    .map((n, index) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      date: format(n.date, 'dd MMM yyyy', { locale: ptBR }).toUpperCase(),
      description: n.description,
      image: `https://img.usecurling.com/p/800/600?q=sports%20${index}&color=blue`,
    }))

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/30 text-slate-900 flex flex-col">
      <PublicHeader title={event.name} />

      <main className="flex-1">
        <PublicHero
          event={event}
          plantaoItems={plantaoNotices.length > 0 ? plantaoNotices : [
            "Inscrições abertas para todas as modalidades!",
            "Confira o regulamento atualizado.",
            "Resultados da primeira fase disponíveis."
          ]}
        />
        <PublicNews news={newsNotices} />
        <PublicAbout description={event.description} />
        <PublicPartners />
      </main>

      <PublicFooter eventName={event.name} />
    </div>
  )
}
