export type UserRole = 'produtor' | 'participante'

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
}
