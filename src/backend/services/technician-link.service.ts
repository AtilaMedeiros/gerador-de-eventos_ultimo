

export interface SchoolTechnician {
    id: string
    schoolId: string
    userId: string
    allowedModalityIds: string[]
    createdAt: Date
    // Helper fields for UI display (populated if needed, optionally)
    userName?: string
    userEmail?: string
}

const STORAGE_KEY = 'ge_school_technicians'

export class TechnicianLinkService {

    static getStoredLinks(): SchoolTechnician[] {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return []
        try {
            return JSON.parse(stored)
        } catch (e) {
            console.error('Failed to parse school technicians', e)
            return []
        }
    }

    private static saveLinks(links: SchoolTechnician[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
    }

    static getTechniciansBySchool(schoolId: string): SchoolTechnician[] {
        const allLinks = this.getStoredLinks()
        return allLinks.filter(link => link.schoolId === schoolId)
    }

    static addTechnician(schoolId: string, userId: string, modalityIds: string[]): SchoolTechnician {
        this.validateModalities(schoolId, modalityIds)

        const allLinks = this.getStoredLinks()

        // Validation: Check if user is already a technician for this school
        const existing = allLinks.find(link => link.schoolId === schoolId && link.userId === userId)
        if (existing) {
            throw new Error('Usuário já é técnico desta escola.')
        }

        const newLink: SchoolTechnician = {
            id: crypto.randomUUID(),
            schoolId,
            userId,
            allowedModalityIds: modalityIds,
            createdAt: new Date()
        }

        allLinks.push(newLink)
        this.saveLinks(allLinks)
        return newLink
    }

    private static validateModalities(schoolId: string, modalityIds: string[]) {
        if (modalityIds.length === 0) return

        // 1. Get School to find linked events
        const schools = JSON.parse(localStorage.getItem('ge_schools_list') || '[]')
        const school = schools.find((s: any) => s.id === schoolId)
        if (!school) throw new Error('Escola não encontrada para validação.')

        // Normalize linked events
        let linkedEventIds: string[] = Array.isArray(school.eventIds) ? school.eventIds : []
        if (school.eventId && !linkedEventIds.includes(school.eventId)) {
            linkedEventIds.push(school.eventId)
        }

        if (linkedEventIds.length === 0) {
            throw new Error('A escola não possui eventos vinculados para atribuir modalidades.')
        }

        // 2. Get All Allowed Modalities for these events
        const eventModalitiesMap = JSON.parse(localStorage.getItem('ge_event_modalities') || '{}')
        const allowedModalityIds = new Set<string>()

        linkedEventIds.forEach(eventId => {
            const mods = eventModalitiesMap[eventId]
            if (Array.isArray(mods)) {
                mods.forEach(m => allowedModalityIds.add(m))
            }
        })

        // 3. Check validity
        const invalidIds = modalityIds.filter(id => !allowedModalityIds.has(id))

        if (invalidIds.length > 0) {
            throw new Error(`As seguintes modalidades não são permitidas para esta escola (não vinculadas aos eventos ativos): ${invalidIds.join(', ')}`)
        }
    }

    static updateTechnicianPermissions(linkId: string, modalityIds: string[]) {
        const allLinks = this.getStoredLinks()
        const index = allLinks.findIndex(l => l.id === linkId)

        if (index === -1) {
            throw new Error('Vínculo não encontrado')
        }

        allLinks[index].allowedModalityIds = modalityIds
        this.saveLinks(allLinks)
    }

    static removeTechnician(linkId: string) {
        const allLinks = this.getStoredLinks()
        const filtered = allLinks.filter(l => l.id !== linkId)
        this.saveLinks(filtered)
    }
}
