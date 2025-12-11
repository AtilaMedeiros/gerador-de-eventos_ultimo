import { Athlete } from '@/types/participant'

export const mockAthletes: Athlete[] = [
    {
        id: '1',
        name: 'Lucas Pereira',
        sex: 'Masculino',
        dob: new Date('2008-05-15T12:00:00'),
        cpf: '123.456.789-00',
        schoolId: 'school-1',
        motherName: 'Maria Pereira',
        motherCpf: '987.654.321-00',
        rg: '12345678'
    },
    {
        id: '2',
        name: 'Beatriz Costa',
        sex: 'Feminino',
        dob: new Date('2010-08-20T12:00:00'),
        cpf: '987.654.321-00',
        schoolId: 'school-1',
        motherName: 'Ana Costa',
        motherCpf: '111.222.333-44',
        rg: '87654321'
    },
]
