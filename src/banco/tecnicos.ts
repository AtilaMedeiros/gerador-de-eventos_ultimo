export const MOCK_TECHNICIANS_SEED = [
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
    {
        id: 'tech-2',
        schoolId: 'school-1',
        name: 'Fernanda Santos',
        sex: 'Feminino',
        dob: new Date('1990-08-15T12:00:00'),
        cpf: '222.222.222-22',
        cref: '654321-G/CE',
        email: 'fernanda.santos@escola.com',
        phone: '(85) 97777-7777',
    }
]

export const MOCK_PREVIEW_TECHNICIANS = [
    { id: 't1', name: 'Técnico Responsável', sex: 'Masculino', dob: new Date(1980, 0, 1), cpf: '000.000.000-00', cref: '123456-G/SP', email: 'tec@teste.com', phone: '(11) 99999-8888', schoolId: 'school-mock' }
]
