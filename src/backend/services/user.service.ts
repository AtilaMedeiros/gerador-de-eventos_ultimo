import { User, GlobalRole, saveUser, getStoredUsers } from '@/backend/banco/usuarios'

export class UserService {
    /**
     * Business Rule: Determines if a user with `creatorRole` can create a user with `targetRole`.
     */
    static canCreateRole(creatorRole: GlobalRole, targetRole: GlobalRole): boolean {
        if (creatorRole === 'admin') return true // Admin creates anyone

        if (creatorRole === 'producer') {
            // Producer creates other Producers (team members) or School Admins?
            // Usually Producer creates team members.
            if (targetRole === 'producer') return true
            if (targetRole === 'school_admin') return true
            if (targetRole === 'technician') return true
            return false // Cannot create Admin
        }

        if (creatorRole === 'school_admin') {
            // School Admin creates Technicians or Students (Users?)
            if (targetRole === 'technician') return true
            return false // Cannot create Admin or Producer
        }

        return false
    }

    /**
     * Creates a new user in the system after validating rules.
     */
    static createUser(creator: User | null, userData: Omit<User, 'id'>): User {
        // 1. Permission Check
        // If no creator (public registration), we assume it's allowed for specific roles like 'producer' (signup) 
        // or 'school_admin' (participant signup).
        if (creator) {
            if (!this.canCreateRole(creator.role, userData.role)) {
                throw new Error(`User with role ${creator.role} cannot create ${userData.role}`)
            }
        }

        // 2. Duplication Check
        const users = getStoredUsers()
        if (users.some(u => u.email === userData.email)) {
            throw new Error('Email already registered')
        }

        // 3. Persistence
        const newUser: User = {
            ...userData,
            id: crypto.randomUUID()
        }
        saveUser(newUser)
        return newUser
    }

    /**
     * Public registration helper (no creator required).
     * E.g. Self-signup page.
     */
    static registerProducer(data: { name: string, email: string }): User {
        return this.createUser(null, {
            ...data,
            role: 'producer'
        })
    }
}
