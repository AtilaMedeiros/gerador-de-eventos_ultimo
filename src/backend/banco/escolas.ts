export const MOCK_SCHOOL = {
    id: 'school-1',
    name: 'Escola Municipal Exemplo',
    inep: '12345678',
    cnpj: '00.000.000/0000-00',
    municipality: 'Fortaleza',
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    cep: '60000-000',
    type: 'Publica',
    sphere: 'Municipal',
    directorName: 'Maria Diretora',
    landline: '(85) 3222-2222',
    mobile: '(85) 99999-9999',
    email: 'escola@exemplo.com',
}

export const MOCK_PREVIEW_SCHOOL = {
    id: 'school-mock',
    name: 'Escola Modelo de Teste',
    inep: '12345678',
    cnpj: '00.000.000/0000-00',
    municipality: 'São Paulo',
    address: 'Av. Paulista, 1000',
    neighborhood: 'Bela Vista',
    cep: '01310-100',
    type: 'Privada',
    sphere: 'Estadual',
    directorName: 'Carlos Silva',
    landline: '(11) 3000-0000',
    mobile: '(11) 99999-9999',
    email: 'contato@escolamodelo.com.br'
}
// ... existing exports ...

export const INITIAL_SCHOOLS = [
    {
        id: '1',
        name: 'Escola Municipal de Esportes',
        type: 'Publica', // Normalized to match type definition
        directorName: 'Carlos Muniz', // Normalized property name
        landline: '(11) 3344-5566', // Normalized property name
        mobile: '(11) 99887-7665', // Normalized property name
        email: 'contato@esportes.sp.gov.br',
        responsibleName: 'João Silva', // Added for consistency
        eventId: '1', // Linked to 'Tech Summit 2025' (ID 1)
        eventName: 'Tech Summit 2025', // Denormalized for easy display if needed, but ID is better
        inep: '11223344',
        municipality: 'São Paulo', // Added required field
        address: 'Rua do Esporte, 100', // Added required field
        neighborhood: 'Centro', // Added required field
        cep: '01000-000', // Added required field
        sphere: 'Municipal', // Added required field
        cnpj: '00.000.000/0001-00'
    },
    {
        id: '2',
        name: 'Colégio Estadual do Saber',
        type: 'Publica',
        directorName: 'Ana Paula',
        landline: '(21) 3322-1100',
        mobile: '(21) 98765-4321',
        email: 'direcao@saber.rj.gov.br',
        responsibleName: 'Maria Santos',
        eventId: '3', // Linked to 'Torneio de Robótica' (ID 3 - closed)
        eventName: 'Torneio de Robótica',
        inep: '55667788',
        municipality: 'Rio de Janeiro',
        address: 'Av. do Saber, 200',
        neighborhood: 'Botafogo',
        cep: '22000-000',
        sphere: 'Estadual',
        cnpj: '00.000.000/0002-00'
    },
    {
        id: '3',
        name: 'Instituto Atlético',
        type: 'Privada',
        directorName: 'Roberto Campos',
        landline: '(31) 3214-5678',
        mobile: '(31) 99112-2334',
        email: 'admin@institutoatletico.com.br',
        responsibleName: 'Pedro Costa',
        eventId: '1', // Linked to 'Tech Summit 2025'
        eventName: 'Tech Summit 2025',
        inep: '99001122',
        municipality: 'Belo Horizonte',
        address: 'Rua da Montanha, 300',
        neighborhood: 'Savassi',
        cep: '30000-000',
        sphere: 'Federal', // Just for variety
        cnpj: '00.000.000/0003-00'
    },
]
