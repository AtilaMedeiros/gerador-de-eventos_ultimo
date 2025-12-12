export const MOCK_ATHLETES_SEED = [
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
    {
        id: '3',
        name: 'Gabriel Almeida',
        sex: 'Masculino',
        dob: new Date('2005-01-10T12:00:00'),
        cpf: '111.222.333-44',
        schoolId: 'school-1',
        motherName: 'Carla Almeida',
        motherCpf: '555.666.777-88',
        rg: '11223344'
    },
    {
        id: '4',
        name: 'Mariana Silva',
        sex: 'Feminino',
        dob: new Date('2008-11-05T12:00:00'),
        cpf: '555.666.777-88',
        schoolId: 'school-1',
        motherName: 'Joana Silva',
        motherCpf: '999.888.777-66',
        rg: '12345678'
    },
    {
        id: '5',
        name: 'João Pedro',
        sex: 'Masculino',
        dob: new Date('2012-03-25T12:00:00'),
        cpf: '999.888.777-66',
        schoolId: 'school-1',
        motherName: 'Pedro Santos',
        motherCpf: '222.333.444-55',
        rg: '55667788'
    }
]

export const MOCK_PREVIEW_ATHLETES = Array.from({ length: 12 }).map((_, i) => ({
    id: `athlete-${i}`,
    name: `Atleta Exemplo ${i + 1}`,
    sex: 'Masculino',
    dob: new Date(2010, 5, 15),
    rg: `12.345.67${i}-X`,
    cpf: `123.456.789-0${i}`,
    schoolId: 'school-mock',
    motherName: 'Mãe Exemplo',
    motherCpf: '000.000.000-00'
}))
