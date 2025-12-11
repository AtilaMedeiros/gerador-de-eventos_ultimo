import { Technician } from '@/types/participant'

export const mockTechnicians: Technician[] = [
    {
        id: 'tech-1',
        schoolId: 'school-1',
        name: 'Carlos Oliveira',
        sex: 'Masculino',
        dob: new Date('1985-05-10T12:00:00'),
        cpf: '111.111.111-11',
        cref: '123456-G/CE',
        email: 'carlos.oliveira@escola.com',
        phone: '(85) 98888-8888',
    },
]
