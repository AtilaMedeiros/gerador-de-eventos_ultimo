import { MOCK_ATHLETES_SEED } from '@/backend/banco/atletas'

export interface Athlete {
    id: string
    name: string
    sex: string
    dob: Date
    cpf: string
    schoolId: string
    motherName: string
    motherCpf: string
    rg: string
}

export class AthleteService {
    /**
     * Validates if an athlete is eligible for a specific category based on age.
     */
    static validateCategory(athleteDob: Date, minAge: number, maxAge: number): boolean {
        const today = new Date()
        const birthDate = new Date(athleteDob)

        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        // Rule: Age must be within range [minAge, maxAge]
        return age >= minAge && age <= maxAge
    }

    /**
     * Retrieves athletes for a specific school.
     */
    static getAthletesBySchool(schoolId: string): Athlete[] {
        // Mock Implementation: specific seed + generic generator if needed
        // For now just return seed filtered
        return MOCK_ATHLETES_SEED.filter(a => a.schoolId === schoolId).map(a => ({
            ...a,
            dob: new Date(a.dob) // Ensure Date object
        }))
    }
}
