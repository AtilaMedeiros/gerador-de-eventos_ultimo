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
     * Rule: (RASCUNHO | PUBLICADO | REABERTO) AND (AGENDADO | ATIVO)
     */
    static isEditable(adminStatus: string, timeStatus: string): boolean {
        const validAdmin = ['RASCUNHO', 'PUBLICADO', 'REABERTO'].includes(adminStatus)
        const validTime = ['AGENDADO', 'ATIVO'].includes(timeStatus)
        return validAdmin && validTime
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
}
