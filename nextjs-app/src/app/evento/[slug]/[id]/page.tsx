import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Simula busca do evento (depois migrar para banco de dados)
async function getEvent(id: string) {
    // TODO: Buscar do banco de dados ou API
    // Por enquanto, retorna dados mockados

    if (typeof window !== 'undefined') {
        const events = localStorage.getItem('ge_events')
        if (events) {
            const parsed = JSON.parse(events)
            return parsed.find((e: any) => e.id === id)
        }
    }

    return null
}

type Props = {
    params: { slug: string; id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const event = await getEvent(params.id)

    if (!event) {
        return {
            title: 'Evento não encontrado',
        }
    }

    return {
        title: event.name,
        description: event.description?.substring(0, 160),
        openGraph: {
            title: event.name,
            description: event.description?.substring(0, 160),
            type: 'website',
        },
    }
}

export default async function EventPage({ params }: Props) {
    const event = await getEvent(params.id)

    if (!event) {
        notFound()
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold mb-4">{event.name}</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: event.description || '' }} />
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Localização</h3>
                        <p>{event.location}</p>
                    </div>

                    <div className="bg-card p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Período</h3>
                        <p>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* TODO: Adicionar mais seções conforme necessário */}
            </div>
        </div>
    )
}
