export type GlobalRole = 'admin' | 'producer' | 'school_admin' | 'technician'

export interface User {
    id: string
    name: string
    email: string
    role: GlobalRole
    schoolId?: string // Only for school_admin or technician
    permissions?: string[] // Optional legacy or specific global permissions
}

export const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'João Produtor',
        email: 'admin@exemplo.com',
        role: 'producer',
    },
    {
        id: '2',
        name: 'Diretor da Escola',
        email: 'escola@exemplo.com',
        role: 'school_admin',
        schoolId: 'school-1',
    },
    {
        id: '3',
        name: 'Técnico Esportivo',
        email: 'tecnico@exemplo.com',
        role: 'technician',
        schoolId: 'school-1',
    },
]

export const getStoredUsers = (): User[] => {
    const stored = localStorage.getItem('ge_users')
    if (stored) {
        try {
            return JSON.parse(stored)
        } catch (e) {
            return INITIAL_USERS
        }
    }
    // Initialize if empty
    localStorage.setItem('ge_users', JSON.stringify(INITIAL_USERS))
    return INITIAL_USERS
}

export const saveUser = (user: User) => {
    const users = getStoredUsers()
    // Avoid duplicates by email
    const existingIndex = users.findIndex(u => u.email === user.email)

    if (existingIndex >= 0) {
        users[existingIndex] = user
    } else {
        users.push(user)
    }

    localStorage.setItem('ge_users', JSON.stringify(users))
}

export const getMockUserByEmail = (email: string): User => {
    const users = getStoredUsers()
    const found = users.find(u => u.email === email)

    if (found) return found

    // Fallback Mock Logic for demos if not found in storage (keep existing behavior for seamless demo)
    if (email.includes('admin')) {
        return { ...INITIAL_USERS[0], email }
    } else if (email.includes('escola')) {
        return { ...INITIAL_USERS[1], email }
    } else if (email.includes('tecnico')) {
        return { ...INITIAL_USERS[2], email }
    }

    // Default Fallback
    return {
        id: crypto.randomUUID(),
        name: 'Usuário Temporário',
        email: email,
        role: 'school_admin',
        schoolId: 'school-1', // Default link for safety
    }
}
