export type EventRole = 'owner' | 'assistant' | 'observer'

export interface EventPermission {
    userId: string
    eventId: string
    role: EventRole
}

export const INITIAL_EVENT_PERMISSIONS: EventPermission[] = [
    {
        userId: '1', // João Produtor
        eventId: '1', // Tech Summit (Assumed ID)
        role: 'owner'
    }
]

export const getStoredPermissions = (): EventPermission[] => {
    const stored = localStorage.getItem('ge_event_roles')
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch (e) {
            return INITIAL_EVENT_PERMISSIONS
        }
    }
    return INITIAL_EVENT_PERMISSIONS
}

export const saveInfoPermission = (perm: EventPermission) => {
    const all = getStoredPermissions()
    // Remove existing for same user/event to replace
    const filtered = all.filter(p => !(p.userId === perm.userId && p.eventId === perm.eventId))
    filtered.push(perm)
    localStorage.setItem('ge_event_roles', JSON.stringify(filtered))
}

export const getRoleForEvent = (userId: string, eventId: string): EventRole | null => {
    const all = getStoredPermissions()
    const found = all.find(p => p.userId === userId && p.eventId === eventId)
    return found ? found.role : null
}
