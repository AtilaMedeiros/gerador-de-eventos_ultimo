import { User } from '@/types/auth'

export const mockUsers: User[] = [
    {
        id: '1',
        email: 'produtor@teste.com',
        name: 'Produtor Teste',
        role: 'produtor',
    },
    {
        id: '2',
        email: 'participante@teste.com',
        name: 'Escola Teste',
        role: 'participante',
    }
]
