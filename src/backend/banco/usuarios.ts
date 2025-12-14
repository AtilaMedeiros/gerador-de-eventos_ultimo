export type GlobalRole = 'admin' | 'producer' | 'participant'

export interface User {
    id: string
    name: string
    email: string
    role: GlobalRole
    cpf?: string
    phone?: string
    cref?: string
    sex?: 'Feminino' | 'Masculino'
    dob?: string // ISO Date string
    schoolId?: string // Only for school_admin or technician
    permissions?: string[] // Optional legacy or specific global permissions
    status?: 'active' | 'inactive'
    lastAccess?: string
}

export const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'Ricardo Souza',
        email: 'admin@exemplo.com',
        role: 'producer',
        cpf: '000.000.000-01',
        phone: '(11) 90000-0001',
        status: 'active',
        lastAccess: 'Hoje, 09:00'
    },
    {
        id: '2',
        name: 'Helena Martins',
        email: 'escola@exemplo.com',
        role: 'participant',
        schoolId: 'school-1',
        cpf: '000.000.000-02',
        phone: '(85) 99999-9999',
        status: 'active',
        lastAccess: 'Ontem, 14:00'
    },
    {
        id: '3',
        name: 'Carlos Eduardo',
        email: 'tecnico@exemplo.com',
        role: 'participant',
        schoolId: 'school-1',
        cpf: '000.000.000-03',
        cref: '123456-G/CE',
        sex: 'Masculino',
        dob: '1985-05-20',
        phone: '(85) 98888-8888',
        status: 'active',
        lastAccess: 'Há 2 dias'
    },
    // Merged from MOCK_USERS_LIST and adapted to match real structure
    {
        id: '4',
        name: 'Ana Silva',
        cpf: '123.456.789-00',
        phone: '(11) 98765-4321',
        email: 'ana.silva@email.com',
        role: 'admin',
        status: 'active',
        lastAccess: 'Hoje, 10:30',
    },
    {
        id: '5',
        name: 'Carlos Oliveira',
        cpf: '234.567.890-11',
        phone: '(21) 99876-5432',
        email: 'carlos.o@email.com',
        role: 'producer',
        status: 'active',
        lastAccess: 'Ontem, 15:45',
    },
    {
        id: '6',
        name: 'Marcos Santos',
        cpf: '345.678.901-22',
        phone: '(31) 91234-5678',
        email: 'marcos.s@email.com',
        role: 'participant',
        status: 'inactive',
        lastAccess: '10/05/2025',
    },
    {
        id: '7',
        name: 'João Silva',
        email: 'joao.silva@esportes.sp.gov.br',
        role: 'participant',
        schoolId: '1',
        cpf: '111.111.111-11',
        phone: '(11) 91111-1111',
        status: 'active',
        lastAccess: 'Hoje, 08:00'
    },
    {
        id: '8',
        name: 'Maria Santos',
        email: 'maria.santos@saber.rj.gov.br',
        role: 'participant',
        schoolId: '2',
        cpf: '222.222.222-22',
        phone: '(21) 92222-2222',
        status: 'active',
        lastAccess: 'Ontem, 16:30'
    },
    {
        id: '9',
        name: 'Pedro Costa',
        email: 'pedro.costa@institutoatletico.com.br',
        role: 'participant',
        schoolId: '3',
        cpf: '333.333.333-33',
        phone: '(31) 93333-3333',
        status: 'active',
        lastAccess: 'Hoje, 09:15'
    },
    {
        id: '10',
        name: 'Juliana Lima',
        email: 'juliana.lima@escoladesativada.com.br',
        role: 'participant',
        schoolId: '4',
        cpf: '444.444.444-44',
        phone: '(41) 94444-4444',
        status: 'active',
        lastAccess: 'Semana passada'
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

export const deleteUser = (userId: string) => {
    let users = getStoredUsers()
    users = users.filter(u => u.id !== userId)
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
        role: 'participant',
        schoolId: 'school-1', // Default link for safety
    }
}
