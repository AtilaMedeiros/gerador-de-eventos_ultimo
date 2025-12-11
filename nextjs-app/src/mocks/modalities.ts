import { Modality } from '@/types/modality'

export const mockModalities: Modality[] = [
    { id: '1', name: 'Futsal Masculino Sub-14', category: 'Futsal', gender: 'Masculino', type: 'Coletiva', proof: 'Torneio Principal', minAge: 12, maxAge: 14, minAthletes: 5, maxAthletes: 12, maxTeams: 16, maxEventsPerAthlete: 1 },
    { id: '2', name: 'Vôlei Feminino Sub-17', category: 'Voleibol', gender: 'Feminino', type: 'Coletiva', proof: 'Torneio Principal', minAge: 15, maxAge: 17, minAthletes: 6, maxAthletes: 12, maxTeams: 12, maxEventsPerAthlete: 1 },
    { id: '3', name: 'Basquete Masculino Livre', category: 'Basquetebol', gender: 'Masculino', type: 'Coletiva', proof: '3x3', minAge: 16, maxAge: 99, minAthletes: 3, maxAthletes: 5, maxTeams: 8, maxEventsPerAthlete: 1 },
    { id: '4', name: 'Handebol Masculino Escolar', category: 'Handebol', gender: 'Masculino', type: 'Coletiva', proof: 'Torneio Escolar', minAge: 10, maxAge: 12, minAthletes: 7, maxAthletes: 14, maxTeams: 10, maxEventsPerAthlete: 1 },
    { id: '5', name: 'Xadrez Convencional', category: 'Xadrez', gender: 'Masculino', type: 'Individual', proof: 'Torneio Suíço', minAge: 8, maxAge: 18, minAthletes: 1, maxAthletes: 1, maxTeams: 0, maxEventsPerAthlete: 1 },
    { id: '6', name: 'Atletismo 100m', category: 'Atletismo', gender: 'Masculino', type: 'Individual', proof: '100m Rasos', minAge: 13, maxAge: 15, minAthletes: 1, maxAthletes: 1, maxTeams: 0, maxEventsPerAthlete: 3 },
    { id: '7', name: 'Natação 50m Livre', category: 'Natação', gender: 'Feminino', type: 'Individual', proof: '50m Livre', minAge: 15, maxAge: 17, minAthletes: 1, maxAthletes: 1, maxTeams: 0, maxEventsPerAthlete: 4 },
    { id: '8', name: 'Judô Leve', category: 'Judô', gender: 'Masculino', type: 'Individual', proof: 'Peso Leve (-73kg)', minAge: 11, maxAge: 13, minAthletes: 1, maxAthletes: 1, maxTeams: 0, maxEventsPerAthlete: 1 },
    { id: '9', name: 'Tênis de Mesa', category: 'Tênis de Mesa', gender: 'Feminino', type: 'Individual', proof: 'Individual', minAge: 10, maxAge: 18, minAthletes: 1, maxAthletes: 1, maxTeams: 0, maxEventsPerAthlete: 2 },
    { id: '10', name: 'Badminton Duplas', category: 'Badminton', gender: 'Masculino', type: 'Individual', proof: 'Duplas Masculinas', minAge: 12, maxAge: 15, minAthletes: 2, maxAthletes: 2, maxTeams: 0, maxEventsPerAthlete: 2 },
]
