'use server'

import { Event } from '@/types/event'

// Simula armazenamento (migrar para banco de dados depois)
export async function getEvents(): Promise<Event[]> {
    // TODO: Buscar do banco de dados
    return []
}

export async function getEvent(id: string): Promise<Event | null> {
    const events = await getEvents()
    return events.find(e => e.id === id) || null
}

export async function createEvent(data: Omit<Event, 'id'>): Promise<{ success: boolean; event?: Event; error?: string }> {
    try {
        const newEvent: Event = {
            ...data,
            id: Date.now().toString(),
        }

        // TODO: Salvar no banco de dados

        return { success: true, event: newEvent }
    } catch (error) {
        return { success: false, error: 'Erro ao criar evento' }
    }
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<{ success: boolean; error?: string }> {
    try {
        // TODO: Atualizar no banco de dados
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Erro ao atualizar evento' }
    }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        // TODO: Deletar do banco de dados
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Erro ao deletar evento' }
    }
}
