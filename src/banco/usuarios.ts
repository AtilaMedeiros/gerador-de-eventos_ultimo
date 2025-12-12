export const MOCK_USERS = [
    {
        id: '1',
        name: 'João Produtor',
        email: 'admin@exemplo.com',
        role: 'producer',
        permissions: ['criar_evento', 'editar_evento', 'ver_relatorios'],
    },
    {
        id: '2',
        name: 'Diretor da Escola',
        email: 'escola@exemplo.com',
        role: 'school_admin',
        permissions: ['gerir_escola', 'gerir_atletas', 'gerir_tecnicos'],
        schoolId: 'school-1',
    },
    {
        id: '3',
        name: 'Técnico Esportivo',
        email: 'tecnico@exemplo.com',
        role: 'technician',
        permissions: ['ver_atletas'],
        schoolId: 'school-1',
    },
]

export const getMockUserByEmail = (email: string) => {
    if (email.includes('admin')) {
        return MOCK_USERS.find(u => u.role === 'producer') || MOCK_USERS[0]
    } else if (email.includes('escola')) {
        return MOCK_USERS.find(u => u.role === 'school_admin') || MOCK_USERS[1]
    } else if (email.includes('tecnico')) {
        return MOCK_USERS.find(u => u.role === 'technician') || MOCK_USERS[2]
    } else {
        // Default fallback
        return {
            id: '2',
            name: 'Diretor da Escola',
            email: email,
            role: 'school_admin',
            permissions: ['gerir_escola', 'gerir_atletas', 'gerir_tecnicos'],
            schoolId: 'school-1',
        }
    }
}
