export interface Modality {
    id: string
    name: string
    category?: string // Esporte principal ex: Futebol (agora opcional)
    gender: 'Masculino' | 'Feminino' | string
    type?: string // 'Coletivo' | 'Individual'
    proof?: string // Especificação da Prova ex: 100m Rasos
    minAge?: number
    maxAge?: number
    minAthletes?: number
    maxAthletes?: number
    maxTeams?: number
    maxEventsPerAthlete?: number
}
