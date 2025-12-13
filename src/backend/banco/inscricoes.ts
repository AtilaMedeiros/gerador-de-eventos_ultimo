export const MOCK_INSCRIPTIONS_SEED = [
    // Futsal (Coletiva, Masculino, 14-17)
    // Lucas (17y), Gabriel (19y - older, but let's assume valid for mock), João (13y - too young)
    {
        id: 'insc-1',
        schoolId: 'school-1',
        athleteId: '1', // Lucas
        eventId: '1', // Default Event
        modalityId: '1', // Futsal
        status: 'Confirmada',
    },
    {
        id: 'insc-2',
        schoolId: 'school-1',
        athleteId: '3', // Gabriel
        eventId: '1',
        modalityId: '1', // Futsal
        status: 'Confirmada',
    },
    // Natação (Individual, Feminino, 10-99)
    // Beatriz (15y), Mariana (17y)
    {
        id: 'insc-3',
        schoolId: 'school-1',
        athleteId: '2', // Beatriz
        eventId: '1',
        modalityId: '2', // Natação
        status: 'Confirmada',
    },
    {
        id: 'insc-4',
        schoolId: 'school-1',
        athleteId: '4', // Mariana
        eventId: '1',
        modalityId: '2', // Natação
        status: 'Confirmada',
    },
    {
        id: 'insc-5',
        schoolId: 'school-1',
        athleteId: '5', // João Pedro
        eventId: '1', // Default Event
        modalityId: '4', // Atletismo
        status: 'Confirmada',
    },
]
