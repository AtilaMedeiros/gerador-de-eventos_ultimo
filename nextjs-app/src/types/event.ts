export interface Event {
    id: string
    name: string
    slug?: string // Optional in original but used in next app
    startDate: string | Date // Flexible to handle string from JSON
    endDate: string | Date
    location: string
    registrations?: number
    capacity?: number
    status?: 'published' | 'draft' | 'closed' | string

    // Form fields details
    description?: string
    producerName?: string
    producerDescription?: string

    // Visual Identity
    themeId?: string
    coverImage?: string
    logo?: string

    // Registration dates
    registrationCollectiveStart?: Date | string
    registrationCollectiveEnd?: Date | string
    registrationIndividualStart?: Date | string
    registrationIndividualEnd?: Date | string

    // Partner Logos
    realizerLogos?: string[]
    supporterLogos?: string[]

    // Times
    startTime?: string
    endTime?: string
}
