import { EventRole, saveInfoPermission, getRoleForEvent, getStoredPermissions } from '@/backend/banco/permissoes'
import { User } from '@/backend/banco/usuarios'
import { isBefore, isAfter } from 'date-fns'

export class EventService {
    /**
     * Assigns a user to an event team with a specific role.
     */
    static addTeamMember(targetUserId: string, eventId: string, role: EventRole) {
        // 1. Validation: Prevent duplicate same role? Or just overwrite?
        // Current logic overwrites.

        // 2. Persist
        saveInfoPermission({
            userId: targetUserId,
            eventId: eventId,
            role: role
        })
    }

    /**
     * Removes a user from an event team.
     */
    static removeTeamMember(targetUserId: string, eventId: string) {
        const perms = getStoredPermissions()
        const filtered = perms.filter(p => !(p.userId === targetUserId && p.eventId === eventId))
        localStorage.setItem('ge_event_roles', JSON.stringify(filtered))
    }

    /**
     * Automatically executes when a new event is created.
     * Assigns the creator as 'owner'.
     */
    static onEventCreated(creator: User, eventId: string) {
        this.addTeamMember(creator.id, eventId, 'owner')
    }

    /**
     * Retrieves all team members for a specific event.
     */
    static getTeamMembers(eventId: string) {
        const perms = getStoredPermissions().filter(p => p.eventId === eventId)
        return perms
    }

    /**
     * Calculates the temporal status of an event.
     */
    static getTimeStatus(startDate: Date | undefined, endDate: Date | undefined): 'AGENDADO' | 'ATIVO' | 'ENCERRADO' {
        if (!startDate || !endDate) return 'AGENDADO'
        const now = new Date()
        if (isBefore(now, startDate)) return 'AGENDADO'
        if (isAfter(now, endDate)) return 'ENCERRADO'
        return 'ATIVO'
    }

    /**
     * Determines if an event is considered "editable" or "eligible" for operations.
     * Rule: (RASCUNHO | PUBLICADO) AND (AGENDADO | ATIVO)
     */
    static isEditable(adminStatus: string, timeStatus: string): boolean {
        // Filtro baseado puramente em status de negócio conforme solicitado
        // "permitir os status de negocio publicado ou rascunho e nao olhar mais para datas"
        return ['RASCUNHO', 'PUBLICADO'].includes(adminStatus)
    }

    /**
     * Prepares initial event data with correct defaults.
     */
    static prepareNewEvent(data: any): any {
        return {
            ...data,
            id: crypto.randomUUID(),
            adminStatus: 'RASCUNHO',
            computedTimeStatus: data.startDate && data.endDate
                ? this.getTimeStatus(new Date(data.startDate), new Date(data.endDate))
                : 'AGENDADO'
        }
    }
    /**
     * Retrieves the entire map of event modalities.
     */
    static getAllEventModalitiesMap(): Record<string, string[]> {
        const storedAssociations = localStorage.getItem('ge_event_modalities')
        if (!storedAssociations) return {}
        try {
            return JSON.parse(storedAssociations)
        } catch (e) {
            console.error('Failed to parse event modalities map', e)
            return {}
        }
    }

    /**
     * Retrieves associated modalities for an event.
     */
    static getEventModalities(eventId: string): string[] {
        const map = this.getAllEventModalitiesMap()
        return map[eventId] || []
    }

    /**
     * Saves associated modalities for an event.
     */
    static saveEventModalities(eventId: string, modalityIds: string[]) {
        const map = this.getAllEventModalitiesMap()
        map[eventId] = modalityIds
        localStorage.setItem('ge_event_modalities', JSON.stringify(map))
    }
}
