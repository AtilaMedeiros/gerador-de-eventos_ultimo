export interface Activity {
    id: number
    text: string
    time: Date
    type: 'registration' | 'info' | 'alert'
}

export const mockActivities: Activity[] = [
    {
        id: 1,
        text: 'Escola Municipal do Saber finalizou a inscrição da equipe de Futsal.',
        time: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
        type: 'registration',
    },
    {
        id: 2,
        text: 'Novo boletim técnico nº 03 publicado na área de comunicação.',
        time: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
        type: 'info',
    },
    {
        id: 3,
        text: 'Prazo de inscrição individual estendido por 24 horas.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        type: 'alert',
    },
    {
        id: 4,
        text: 'Colégio Avançar cadastrou 15 novos atletas no sistema.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        type: 'registration',
    },
    {
        id: 5,
        text: 'Tabela de jogos da fase classificatória disponível.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        type: 'info',
    },
]
