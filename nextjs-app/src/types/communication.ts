export interface Notice {
    id: string
    eventId: string
    title: string
    category: string
    description: string
    date: Date
    time: string
    author: string
    createdAt: Date
}

export interface Bulletin {
    id: string
    eventId: string
    title: string
    category: string
    description: string
    date: Date
    time: string
    author: string
    fileName: string
    createdAt: Date
}

export interface Result {
    id: string
    eventId: string
    title: string
    category: string
    description: string
    author: string
    fileName: string
    createdAt: Date
    date: Date
    time: string
}

export interface Regulation {
    id: string
    eventId: string
    title: string
    category: string
    description: string
    date: Date
    time: string
    author: string
    fileName: string
    createdAt: Date
}
