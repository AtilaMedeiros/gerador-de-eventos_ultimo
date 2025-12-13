export type GlobalRole = 'admin' | 'producer' | 'school_admin' | 'technician' | 'participant'

export interface User {
    id: string
    name: string
    email: string
    role: GlobalRole
    cpf?: string
    phone?: string
    schoolId?: string // Only for school_admin or technician
    permissions?: string[] // Optional legacy or specific global permissions
}

export const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'João Produtor',
        email: 'admin@exemplo.com',
        role: 'producer',
        cpf: '000.000.000-01',
        phone: '(11) 90000-0001'
    },
    {
        id: '2',
        name: 'Diretor da Escola',
        email: 'escola@exemplo.com',
        role: 'school_admin',
        schoolId: 'school-1',
        cpf: '000.000.000-02',
        phone: '(85) 99999-9999'
    },
    {
        id: '3',
        name: 'Técnico Esportivo',
        email: 'tecnico@exemplo.com',
        role: 'technician',
        schoolId: 'school-1',
        cpf: '000.000.000-03',
        phone: '(85) 98888-8888'
    },
    // Merged from MOCK_USERS_LIST and adapted
    {
        id: '4',
        name: 'Ana Silva',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        email: 'ana.silva@email.com',
        role: 'admin',
    },
    {
        id: '5',
        name: 'Carlos Oliveira',
        cpf: '234.567.890-11',
        phone: '(21) 99876-5432',
        email: 'carlos.o@email.com',
        role: 'producer',
    },
    {
        id: '6',
        name: 'Marcos Santos',
        cpf: '345.678.901-22',
        phone: '(31) 91234-5678',
        email: 'marcos.s@email.com',
        role: 'participant',
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

export const MOCK_USERS_LIST = [
    {
        id: 1,
        name: 'Ana Silva',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        email: 'ana.silva@email.com',
        role: 'Administrador',
        status: 'active',
        lastAccess: 'Hoje, 10:30',
    },
    {
        id: 2,
        name: 'Carlos Oliveira',
        cpf: '234.567.890-11',
        phone: '(21) 99876-5432',
        email: 'carlos.o@email.com',
        role: 'Produtor',
        status: 'active',
        lastAccess: 'Ontem, 15:45',
    },
    {
        id: 3,
        name: 'Marcos Santos',
        cpf: '345.678.901-22',
        phone: '(31) 91234-5678',
        email: 'marcos.s@email.com',
        role: 'Participante',
        status: 'inactive',
        lastAccess: '10/05/2025',
    },
]
