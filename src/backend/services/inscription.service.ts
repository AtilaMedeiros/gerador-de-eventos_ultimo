import { MOCK_INSCRIPTIONS_SEED } from '@/backend/banco/inscricoes'

export interface Inscription {
    id: string
    schoolId: string
    athleteId: string
    eventId: string
    modalityId: string
    status: 'Confirmada' | 'Pendente' | 'Cancelada'
}

export class InscriptionService {
    /**
     * Checks if the registration period is open.
     */
    static isRegistrationOpen(start: Date, end: Date): boolean {
        const now = new Date()
        return now >= new Date(start) && now <= new Date(end)
    }

    /**
     * Checks if school has reached the limit for a modality.
     */
    static canSubscribe(schoolId: string, modalityId: string, limit: number): boolean {
        // Mock check against existing inscriptions
        const count = MOCK_INSCRIPTIONS_SEED.filter(
            i => i.schoolId === schoolId && i.modalityId === modalityId
        ).length

        return count < limit
    }

    /**
     * Creates a new inscription.
     */
    static createInscription(data: Omit<Inscription, 'id' | 'status'>): Inscription {
        // Here we would validate limits and deadlines via service methods

        const newInscription: Inscription = {
            ...data,
            id: crypto.randomUUID(),
            status: 'Confirmada'
        }

        // In a real app, save to backend. 
        // For mock, we would push to MOCK_INSCRIPTIONS_SEED if it were mutable or localStorage.

        return newInscription
    }
}
