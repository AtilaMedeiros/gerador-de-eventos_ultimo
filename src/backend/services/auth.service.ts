import { getMockUserByEmail, User, GlobalRole } from '@/backend/banco/usuarios'
import { getRoleForEvent, EventRole } from '@/backend/banco/permissoes'

export class AuthService {
    /**
     * Authenticates a user by email and password.
     * Currently mocks password check.
     */
    static async login(email: string, password: string): Promise<User | null> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Basic validation
        if (!email || !password) return null
        if (password === 'error') return null

        // Retrieve user from strict persistence layer
        const user = getMockUserByEmail(email)

        if (!user) return null

        // In a real app, we would hash compare here. 
        // For now, we accept any password > 6 chars unless it is 'error'
        if (password.length < 6) return null

        return user
    }

    /**
     * Checks if a user has a specific global permission.
     * Maps Global Roles to capabilities.
     */
    static hasGlobalPermission(user: User | null, permission: string): boolean {
        if (!user) return false

        // Admin has full access
        if (user.role === 'admin') return true

        // Legacy support (optional, can be removed if strictly using roles)
        if (user.permissions?.includes(permission)) return true

        // Specific role-based checks
        if (user.role === 'school_admin' && permission.startsWith('gerir_')) return true
        if (user.role === 'producer' && permission.includes('evento')) return true

        return false
    }

    /**
     * Retrieves the specific role a user has for a given event.
     */
    static getEventRole(user: User | null, eventId: string): EventRole | null {
        if (!user) return null

        // Global Admins are effectively owners of all events
        if (user.role === 'admin') return 'owner'

        return getRoleForEvent(user.id, eventId)
    }

    /**
     * Checks if a user can perform an action on a specific event.
     */
    static canManageEvent(user: User | null, eventId: string): boolean {
        const role = this.getEventRole(user, eventId)
        return role === 'owner' || role === 'assistant'
        // Observers cannot manage
    }
}
