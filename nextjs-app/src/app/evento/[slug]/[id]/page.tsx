import { Metadata } from 'next'
import { EventPublicPage } from '@/components/public/EventPublicPage'
import { mockEvents } from '@/mocks/events'

type Props = {
    params: { slug: string; id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // Try to find in mocks for metadata
    const event = mockEvents.find(e => e.id === params.id)

    if (!event) {
        return {
            title: 'Evento | Convida',
            description: 'Detalhes do evento esportivo.'
        }
    }

    return {
        title: `${event.name} | Convida`,
        description: event.description?.substring(0, 160),
        openGraph: {
            title: event.name,
            description: event.description?.substring(0, 160),
            type: 'website',
            images: event.coverImage ? [event.coverImage] : [],
        },
    }
}

export default function EventPage({ params }: Props) {
    return <EventPublicPage />
}
