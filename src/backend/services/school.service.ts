import { MOCK_SCHOOL, INITIAL_SCHOOLS } from '@/backend/banco/escolas'

export interface School {
    id: string
    name: string
    inep: string
    cnpj?: string
    municipality: string
    address?: string
    neighborhood?: string
    cep?: string
    type?: 'Publica' | 'Privada'
    sphere?: 'Municipal' | 'Estadual' | 'Federal'
    directorName: string
    landline?: string
    mobile?: string
    email: string
    responsibleName?: string
    eventId?: string // @deprecated use eventIds
    eventIds?: string[] // List of linked event IDs
}

export class SchoolService {
    /**
     * Retrieves the current school session.
     * In a real app, this would fetch from API based on authenticated user.
     * For now, it reads from localStorage 'ge_school_data' or falls back to 'ge_schools_list'.
     */
    static getCurrentSchool(): School | null {
        const stored = localStorage.getItem('ge_school_data')
        if (stored) return JSON.parse(stored)
        return null
    }

    /**
     * Updates school data.
     */
    static updateSchool(schoolId: string, data: Partial<School>): School {
        // 1. Update in "Session"
        const current = this.getCurrentSchool()
        if (current && current.id === schoolId) {
            const updated = { ...current, ...data }
            localStorage.setItem('ge_school_data', JSON.stringify(updated))
        }

        // 2. Update in "Database" (List of all schools)
        const storedList = localStorage.getItem('ge_schools_list')
        let list: School[] = storedList ? JSON.parse(storedList) : [...INITIAL_SCHOOLS]

        const index = list.findIndex(s => s.id === schoolId)
        if (index >= 0) {
            list[index] = { ...list[index], ...data }
            localStorage.setItem('ge_schools_list', JSON.stringify(list))
            return list[index]
        } else {
            // Fallback if not found in list but was requested (edge case)
            throw new Error("School not found in database")
        }
    }

    /**
     * Links a school to a set of events.
     */
    static linkEvents(schoolId: string, eventIds: string[]): School {
        // Just reuse update logic
        return this.updateSchool(schoolId, { eventIds })
    }
}
