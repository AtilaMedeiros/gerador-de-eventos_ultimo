import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

// Types for Communication Data
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
  categoryName: string
  champion: string
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

interface CommunicationContextType {
  notices: Notice[]
  bulletins: Bulletin[]
  results: Result[]
  regulations: Regulation[]
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void
  deleteNotice: (id: string) => void
  addBulletin: (bulletin: Omit<Bulletin, 'id' | 'createdAt'>) => void
  deleteBulletin: (id: string) => void
  addResult: (result: Omit<Result, 'id'>) => void
  updateResult: (id: string, result: Partial<Result>) => void
  deleteResult: (id: string) => void
  addRegulation: (regulation: Omit<Regulation, 'id' | 'createdAt'>) => void
  deleteRegulation: (id: string) => void
}

const CommunicationContext = createContext<
  CommunicationContextType | undefined
>(undefined)

const MOCK_NOTICES: Notice[] = [
  {
    id: '1',
    eventId: '2',
    title: 'Mudança de Horário - Finais',
    category: 'Urgente',
    description: 'Atenção a todos os participantes: As finais do futsal foram adiantadas para as 14h devido à previsão de chuva.',
    date: new Date('2024-03-15'),
    time: '10:00',
    author: 'Organização',
    createdAt: new Date('2024-03-15T10:00:00'),
  },
  {
    id: '2',
    eventId: '2',
    title: 'Estacionamento Liberado',
    category: 'Informativo',
    description: 'O estacionamento do complexo esportivo estará liberado gratuitamente para todos os atletas e comissão técnica.',
    date: new Date('2024-03-14'),
    time: '09:30',
    author: 'Staff',
    createdAt: new Date('2024-03-14T09:30:00'),
  },
  {
    id: '3',
    eventId: '2',
    title: 'Entrega de Kits',
    category: 'Plantão',
    description: 'A entrega dos kits será realizada no ginásio principal até às 18h de hoje.',
    date: new Date('2024-03-13'),
    time: '08:00',
    author: 'Coordenação',
    createdAt: new Date('2024-03-13T08:00:00'),
  },
  {
    id: '4',
    eventId: '2',
    title: 'Reunião Técnica',
    category: 'Últimas Notícias',
    description: 'Reunião técnica obrigatória para todos os representantes de equipe hoje às 19h.',
    date: new Date('2024-03-12'),
    time: '18:00',
    author: 'Direção Técnica',
    createdAt: new Date('2024-03-12T18:00:00'),
  },
  {
    id: '5',
    eventId: '2',
    title: 'Achados e Perdidos',
    category: 'Informativo',
    description: 'Um par de tênis Nike foi encontrado na quadra 2. Retirar na secretaria do evento.',
    date: new Date('2024-03-16'),
    time: '11:00',
    author: 'Secretaria',
    createdAt: new Date('2024-03-16T11:00:00'),
  },
  {
    id: '6',
    eventId: '2',
    title: 'Festa de Encerramento',
    category: 'Últimas Notícias',
    description: 'A festa de encerramento contará com música ao vivo e premiações especiais. Não percam!',
    date: new Date('2024-03-20'),
    time: '20:00',
    author: 'Marketing',
    createdAt: new Date('2024-03-20T20:00:00'),
  }
]

const MOCK_BULLETINS: Bulletin[] = [
  {
    id: '1',
    eventId: '2',
    title: 'Boletim 01 - Programação Geral',
    category: 'Programação',
    description: 'Confira a programação completa dos jogos da primeira fase.',
    date: new Date('2024-03-10'),
    time: '08:00',
    author: 'Direção Técnica',
    fileName: 'boletim_01.pdf',
    createdAt: new Date('2024-03-10T08:00:00'),
  },
  {
    id: '2',
    eventId: '2',
    title: 'Boletim 02 - Resultados Dia 1',
    category: 'Resultados Oficiais',
    description: 'Resultados de todas as partidas realizadas no primeiro dia de competição.',
    date: new Date('2024-03-11'),
    time: '22:00',
    author: 'Arbitragem',
    fileName: 'resultados_dia_1.pdf',
    createdAt: new Date('2024-03-11T22:00:00'),
  },
  {
    id: '3',
    eventId: '2',
    title: 'Boletim 03 - Alteração de Tabela',
    category: 'Nota Oficial',
    description: 'Nota oficial sobre a alteração na tabela de jogos do vôlei feminino.',
    date: new Date('2024-03-12'),
    time: '14:00',
    author: 'Coordenação',
    fileName: 'nota_oficial_01.pdf',
    createdAt: new Date('2024-03-12T14:00:00'),
  },
  {
    id: '4',
    eventId: '2',
    title: 'Boletim 04 - Classificação Parcial',
    category: 'Resultados Oficiais',
    description: 'Classificação atualizada de todos os grupos após a segunda rodada.',
    date: new Date('2024-03-13'),
    time: '10:00',
    author: 'Técnica',
    fileName: 'classificacao_parcial.pdf',
    createdAt: new Date('2024-03-13T10:00:00'),
  },
  {
    id: '5',
    eventId: '2',
    title: 'Boletim 05 - Programação Finais',
    category: 'Programação',
    description: 'Horários e locais definidos para as grandes finais.',
    date: new Date('2024-03-14'),
    time: '16:00',
    author: 'Organização',
    fileName: 'finais.pdf',
    createdAt: new Date('2024-03-14T16:00:00'),
  },
  {
    id: '6',
    eventId: '2',
    title: 'Boletim 06 - Encerramento',
    category: 'Boletim Diário',
    description: 'Informações sobre a cerimônia de encerramento e premiação.',
    date: new Date('2024-03-15'),
    time: '09:00',
    author: 'Cerimonial',
    fileName: 'cerimonia.pdf',
    createdAt: new Date('2024-03-15T09:00:00'),
  }
]

const MOCK_REGULATIONS: Regulation[] = [
  {
    id: '1',
    eventId: '2',
    title: 'Regulamento Geral Jogos 2024',
    category: 'Geral',
    description: 'Documento completo com todas as normas e diretrizes dos jogos deste ano.',
    date: new Date('2024-01-15'),
    time: '08:00',
    author: 'Presidência',
    fileName: 'regulamento_geral_2024.pdf',
    createdAt: new Date('2024-01-15T08:00:00'),
  },
  {
    id: '2',
    eventId: '2',
    title: 'Regulamento Específico - Futsal',
    category: 'Específico',
    description: 'Regras específicas para a modalidade de Futsal.',
    date: new Date('2024-01-20'),
    time: '09:00',
    author: 'Coord. Futsal',
    fileName: 'reg_futsal.pdf',
    createdAt: new Date('2024-01-20T09:00:00'),
  },
  {
    id: '3',
    eventId: '2',
    title: 'Código de Justiça Desportiva',
    category: 'Código de Justiça',
    description: 'Código disciplinar aplicável a todas as infrações durante o evento.',
    date: new Date('2024-01-10'),
    time: '10:00',
    author: 'Jurídico',
    fileName: 'cjd_2024.pdf',
    createdAt: new Date('2024-01-10T10:00:00'),
  },
  {
    id: '4',
    eventId: '2',
    title: 'Norma Complementar 01 - Uniformes',
    category: 'Norma Complementar',
    description: 'Esclarecimentos sobre a padronização e uso de uniformes.',
    date: new Date('2024-02-01'),
    time: '14:00',
    author: 'Técnica',
    fileName: 'nc_01_uniformes.pdf',
    createdAt: new Date('2024-02-01T14:00:00'),
  },
  {
    id: '5',
    eventId: '2',
    title: 'Regulamento Específico - Vôlei',
    category: 'Específico',
    description: 'Regras específicas para a modalidade de Voleibol.',
    date: new Date('2024-01-22'),
    time: '09:00',
    author: 'Coord. Vôlei',
    fileName: 'reg_volei.pdf',
    createdAt: new Date('2024-01-22T09:00:00'),
  },
  {
    id: '6',
    eventId: '2',
    title: 'Edital de Convocação',
    category: 'Edital',
    description: 'Convocação para o congresso técnico inicial.',
    date: new Date('2024-02-15'),
    time: '18:00',
    author: 'Diretoria',
    fileName: 'edital_convocacao.pdf',
    createdAt: new Date('2024-02-15T18:00:00'),
  }
]

export function CommunicationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notices, setNotices] = useState<Notice[]>([])
  const [bulletins, setBulletins] = useState<Bulletin[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [regulations, setRegulations] = useState<Regulation[]>([])

  // Load from local storage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedNotices = localStorage.getItem('ge_comm_notices')
        let initialNotices: Notice[] = []

        if (storedNotices) {
          const parsed = JSON.parse(storedNotices)
          if (Array.isArray(parsed)) {
            initialNotices = parsed.map((n: any) => ({
              ...n,
              date: new Date(n.date),
              createdAt: new Date(n.createdAt),
            }))
          }
        }

        // Merge mocks if Event 2 is missing
        if (!initialNotices.some((n) => n.eventId === '2')) {
          initialNotices = [...initialNotices, ...MOCK_NOTICES]
        }

        setNotices(initialNotices)

        const storedBulletins = localStorage.getItem('ge_comm_bulletins')
        let initialBulletins: Bulletin[] = []

        if (storedBulletins) {
          const parsed = JSON.parse(storedBulletins)
          if (Array.isArray(parsed)) {
            initialBulletins = parsed.map((b: any) => ({
              ...b,
              date: new Date(b.date),
              createdAt: new Date(b.createdAt),
            }))
          }
        }

        // Merge mocks if Event 2 is missing
        if (!initialBulletins.some((b) => b.eventId === '2')) {
          initialBulletins = [...initialBulletins, ...MOCK_BULLETINS]
        }

        setBulletins(initialBulletins)

        const storedResults = localStorage.getItem('ge_comm_results')
        let initialResults: Result[] = []
        if (storedResults) {
          const parsed = JSON.parse(storedResults)
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialResults = parsed
          }
        }
        setResults(initialResults)

        const storedRegulations = localStorage.getItem('ge_comm_regulations')
        let initialRegulations: Regulation[] = []

        if (storedRegulations) {
          const parsed = JSON.parse(storedRegulations)
          if (Array.isArray(parsed)) {
            initialRegulations = parsed.map((r: any) => ({
              ...r,
              date: new Date(r.date),
              createdAt: new Date(r.createdAt),
            }))
          }
        }

        // Merge mocks if Event 2 is missing
        if (!initialRegulations.some((r) => r.eventId === '2')) {
          initialRegulations = [...initialRegulations, ...MOCK_REGULATIONS]
        }

        setRegulations(initialRegulations)

      } catch (e) {
        console.error('Failed to load communication data', e)
        // Fallback to mocks on error
        setNotices(MOCK_NOTICES)
        setBulletins(MOCK_BULLETINS)
        setRegulations(MOCK_REGULATIONS)
      }
    }
    loadData()
  }, [])

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('ge_comm_notices', JSON.stringify(notices))
  }, [notices])

  useEffect(() => {
    localStorage.setItem('ge_comm_bulletins', JSON.stringify(bulletins))
  }, [bulletins])

  useEffect(() => {
    localStorage.setItem('ge_comm_results', JSON.stringify(results))
  }, [results])

  useEffect(() => {
    localStorage.setItem('ge_comm_regulations', JSON.stringify(regulations))
  }, [regulations])

  // Notice Actions
  const addNotice = (data: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setNotices((prev) => [newNotice, ...prev])
    toast.success('Aviso publicado com sucesso!')
  }

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
    toast.success('Aviso removido.')
  }

  // Bulletin Actions
  const addBulletin = (data: Omit<Bulletin, 'id' | 'createdAt'>) => {
    const newBulletin: Bulletin = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setBulletins((prev) => [newBulletin, ...prev])
    toast.success('Boletim publicado com sucesso!')
  }

  const deleteBulletin = (id: string) => {
    setBulletins((prev) => prev.filter((b) => b.id !== id))
    toast.success('Boletim removido.')
  }

  // Result Actions
  const addResult = (data: Omit<Result, 'id'>) => {
    const newResult: Result = {
      ...data,
      id: crypto.randomUUID(),
    }
    setResults((prev) => [...prev, newResult])
    toast.success('Categoria adicionada aos resultados.')
  }

  const updateResult = (id: string, data: Partial<Result>) => {
    setResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)))
    // Toast handled in component typically, or here if generic
  }

  const deleteResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id))
    toast.success('Categoria removida dos resultados.')
  }

  // Regulation Actions
  const addRegulation = (data: Omit<Regulation, 'id' | 'createdAt'>) => {
    const newRegulation: Regulation = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    setRegulations((prev) => [newRegulation, ...prev])
    toast.success('Regulamento publicado com sucesso!')
  }

  const deleteRegulation = (id: string) => {
    setRegulations((prev) => prev.filter((r) => r.id !== id))
    toast.success('Regulamento removido.')
  }

  return React.createElement(
    CommunicationContext.Provider,
    {
      value: {
        notices,
        bulletins,
        results,
        regulations,
        addNotice,
        deleteNotice,
        addBulletin,
        deleteBulletin,
        addResult,
        updateResult,
        deleteResult,
        addRegulation,
        deleteRegulation,
      },
    },
    children,
  )
}

export function useCommunication() {
  const context = useContext(CommunicationContext)
  if (context === undefined) {
    throw new Error(
      'useCommunication must be used within a CommunicationProvider',
    )
  }
  return context
}
