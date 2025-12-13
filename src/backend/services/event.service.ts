import { EventRole, saveInfoPermission, getRoleForEvent, getStoredPermissions } from '@/backend/banco/permissoes'
import { User } from '@/backend/banco/usuarios'

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
}
