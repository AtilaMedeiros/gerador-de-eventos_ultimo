import { MOCK_SCHOOL, INITIAL_SCHOOLS } from '@/backend/banco/escolas'
import { getStoredUsers } from '@/backend/banco/usuarios'

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
    responsibleId?: string // Link to User.id
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

    /**
     * Expands the list of schools so that a school appears once for each event it is linked to.
     * This implements the business rule that a school linked to N events should appear as N rows.
     */
    static expandSchoolsByEvents(schools: School[], allEvents: any[] = []): any[] {
        const expanded: any[] = []
        const storedUsers = getStoredUsers()

        if (!schools) return []

        schools.forEach(school => {
            // Resolve Responsible Name from Users DB
            let responsibleName = school.responsibleName || 'N/A'

            // Priority 1: Direct Link via responsibleId
            if (school.responsibleId) {
                const user = storedUsers.find(u => u.id === school.responsibleId)
                if (user) responsibleName = user.name
            }
            // Priority 2: Fallback logic (find any school_admin linked to this school)
            else {
                const user = storedUsers.find(u => u.schoolId === school.id && (u.role === 'participant' || (u as any).role === 'school_admin'))
                if (user) responsibleName = user.name
            }

            // Normalize event IDs (prefer eventIds, fallback to eventId)
            let rawIds: string[] = Array.isArray(school.eventIds) ? [...school.eventIds] : []
            if (school.eventId) rawIds.push(school.eventId)
            // Deduplicate
            const linkedIds = Array.from(new Set(rawIds))

            if (linkedIds.length === 0) {
                // No linked events: show once
                expanded.push({
                    ...school,
                    _uniqueKey: school.id,
                    event: 'Evento não vinculado',
                    adminStatus: '',
                    computedTimeStatus: '',
                    // Map display fields
                    director: school.directorName,
                    phone: school.landline,
                    whatsapp: school.mobile,
                    responsible: responsibleName
                })
            } else {
                // Multiple linked events: expand rows
                linkedIds.forEach(eventId => {
                    const event = allEvents.find(e => e.id === eventId)
                    expanded.push({
                        ...school,
                        _uniqueKey: `${school.id}-${eventId}`,
                        event: event ? event.name : 'Evento Desconhecido',
                        adminStatus: event ? event.adminStatus : 'DESATIVADO',
                        computedTimeStatus: event ? event.computedTimeStatus : 'ENCERRADO',
                        // Map display fields
                        director: school.directorName,
                        phone: school.landline,
                        whatsapp: school.mobile,
                        responsible: responsibleName
                    })
                })
            }
        })
        return expanded
    }
}
