export interface School {
    id: string
    name: string
    inep: string
    cnpj: string
    municipality: string
    address: string
    neighborhood: string
    cep: string
    type: 'Publica' | 'Privada'
    sphere: 'Municipal' | 'Estadual' | 'Federal'
    directorName: string
    landline: string
    mobile: string
    email: string
    // Responsible person (might be different from director)
    responsibleName?: string
    // Event specific
    eventId?: string
}

export interface Athlete {
    id: string
    schoolId: string
    name: string
    sex: 'Feminino' | 'Masculino'
    dob: Date
    rg?: string
    cpf: string
    nis?: string
    motherName: string
    motherCpf: string
}

export interface Technician {
    id: string
    schoolId: string
    name: string
    sex: 'Feminino' | 'Masculino'
    dob: Date
    cpf: string
    cref?: string
    email: string
    phone: string
}

export interface Inscription {
    id: string
    schoolId: string
    athleteId: string
    eventId: string
    modalityId: string
    categoryId?: string
    status: 'Pendente' | 'Confirmada'
}
