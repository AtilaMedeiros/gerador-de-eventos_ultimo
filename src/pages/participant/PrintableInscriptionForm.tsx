import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useParticipant, type School, type Athlete, type Technician } from '@/contexts/ParticipantContext'
import { useEvent, type Event } from '@/contexts/EventContext'
import { useModality, type Modality } from '@/contexts/ModalityContext'
import { format } from 'date-fns'
import { MOCK_PREVIEW_EVENT } from '@/banco/eventos'
import { MOCK_PREVIEW_SCHOOL } from '@/banco/escolas'
import { MOCK_PREVIEW_MODALITIES } from '@/banco/modalidades'
import { MOCK_PREVIEW_ATHLETES } from '@/banco/atletas'
import { MOCK_PREVIEW_TECHNICIANS } from '@/banco/tecnicos'

export default function PrintableInscriptionForm() {
  const { eventId, modalityId } = useParams()
  const { school, inscriptions, athletes, technicians } = useParticipant()
  const { getEventById } = useEvent()
  const { getModalityById } = useModality()

  // ----------------------------------------------------------------------
  // MOCK LOGIC
  // ----------------------------------------------------------------------
  const isMock = modalityId?.startsWith('mock')

  // Import from banco
  const mockEvent = MOCK_PREVIEW_EVENT as unknown as Event
  const mockSchool = MOCK_PREVIEW_SCHOOL as unknown as School
  const mockModalities = MOCK_PREVIEW_MODALITIES as unknown as Record<string, Partial<Modality>>
  const mockAthletes = MOCK_PREVIEW_ATHLETES as unknown as Athlete[]
  const mockTechnicians = MOCK_PREVIEW_TECHNICIANS as unknown as Technician[]

  // ----------------------------------------------------------------------
  // DATA RESOLUTION
  // ----------------------------------------------------------------------

  let currentEvent: any = eventId ? getEventById(eventId) : null
  let currentModality: any = modalityId ? getModalityById(modalityId) : null
  let currentSchool: any = school
  let currentAthletes: Athlete[] = []
  let currentTechnicians: Technician[] = technicians

  if (isMock) {
    currentEvent = mockEvent
    currentModality = mockModalities[modalityId!] || mockModalities['mock1']
    currentSchool = mockSchool
    currentAthletes = mockAthletes
    currentTechnicians = mockTechnicians
  } else {
    if (eventId && modalityId) {
      const enrolledAthletesIds = inscriptions
        .filter((i) => i.eventId === eventId && i.modalityId === modalityId)
        .map((i) => i.athleteId)

      currentAthletes = athletes.filter((a) =>
        enrolledAthletesIds.includes(a.id),
      )
    }
  }

  // Auto print
  useEffect(() => {
    // Wait a bit for render
    const timer = setTimeout(() => {
      window.print()
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (!currentEvent || !currentModality || !currentSchool) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Dados não encontrados</h2>
          <p className="text-muted-foreground">Verifique se o evento e a modalidade existem.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-black p-8 max-w-[210mm] min-h-[297mm] mx-auto print:p-0 print:w-full print:max-w-none shadow-xl print:shadow-none my-8 print:my-0">

      {/* HEADER */}
      <header className="flex gap-6 border-b-2 border-black pb-6 mb-6">
        <div className="flex-shrink-0">
          {/* Logo Placeholder */}
          <div className="w-24 h-24 border border-gray-300 bg-gray-50 flex items-center justify-center rounded-lg">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider text-center">Logo<br />Evento</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">
            {currentEvent.name}
          </h1>
          <p className="text-gray-600 font-medium text-sm border-l-4 border-primary pl-3 my-1 uppercase tracking-wide">
            Ficha de Inscrição Oficial por Modalidade
          </p>
        </div>
        <div className="flex flex-col items-end justify-center">
          <div className="text-right">
            <span className="block text-xs text-gray-500 uppercase font-bold">Edição</span>
            <span className="text-3xl font-black text-gray-900 leading-none">{new Date(currentEvent.start_date || new Date()).getFullYear()}</span>
          </div>
        </div>
      </header>

      {/* MODALITY IDENTIFICATION BAR */}
      <div className="bg-gray-900 text-white p-3 mb-6 flex items-center justify-between rounded-sm print:bg-gray-200 print:text-black print:border-y-2 print:border-black">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest print:border print:border-black print:text-black">
            Modalidade
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight">
            {currentModality.name}
          </h2>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="opacity-70 font-normal">Naipe:</span>
            <span className="uppercase font-bold">{currentModality.gender}</span>
          </div>
          <div className="h-4 w-px bg-white/30 print:bg-black"></div>
          <div className="flex items-center gap-2">
            <span className="opacity-70 font-normal">Categoria:</span>
            <span className="uppercase font-bold text-yellow-400 print:text-black">
              {currentModality.minAge} a {currentModality.maxAge} anos
            </span>
          </div>
        </div>
      </div>

      {/* SCHOOL INFO GRID */}
      <section className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
          Dados da Instituição de Ensino
        </h3>
        <div className="grid grid-cols-12 gap-y-3 gap-x-4 border border-gray-300 rounded p-4 bg-gray-50/50 print:bg-transparent print:border-black">
          <div className="col-span-8">
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Nome da Escola</label>
            <div className="font-bold text-sm uppercase truncate border-b border-gray-300 pb-0.5">{currentSchool.name}</div>
          </div>
          <div className="col-span-4">
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Código INEP</label>
            <div className="font-mono text-sm border-b border-gray-300 pb-0.5">{currentSchool.inep}</div>
          </div>

          <div className="col-span-5">
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Município</label>
            <div className="text-sm uppercase truncate border-b border-gray-300 pb-0.5">{currentSchool.municipality}</div>
          </div>
          <div className="col-span-4">
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Bairro</label>
            <div className="text-sm uppercase truncate border-b border-gray-300 pb-0.5">{currentSchool.neighborhood}</div>
          </div>
          <div className="col-span-3">
            <label className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Rede</label>
            <div className="text-sm uppercase truncate border-b border-gray-300 pb-0.5">{currentSchool.type} / {currentSchool.sphere}</div>
          </div>
        </div>
      </section>

      {/* ATHLETES TABLE */}
      <section className="mb-8">
        <div className="flex items-end justify-between mb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-1">
            Relação Nominal de Atletas
          </h3>
          <span className="text-[10px] text-gray-400 print:text-black">
            Total: {currentAthletes.length} atletas
          </span>
        </div>

        <table className="w-full border-collapse text-xs print:text-[11px]">
          <thead>
            <tr className="bg-gray-100 border-y-2 border-black print:bg-gray-200">
              <th className="py-2 px-2 text-center w-8 font-bold border-r border-gray-300 print:border-black">#</th>
              <th className="py-2 px-2 text-left font-bold border-r border-gray-300 print:border-black">Nome Completo do Atleta</th>
              <th className="py-2 px-2 text-center w-24 font-bold border-r border-gray-300 print:border-black">RG</th>
              <th className="py-2 px-2 text-center w-28 font-bold border-r border-gray-300 print:border-black">CPF</th>
              <th className="py-2 px-2 text-center w-24 font-bold">Nascimento</th>
            </tr>
          </thead>
          <tbody>
            {currentAthletes.map((athlete, index) => (
              <tr key={athlete.id} className="border-b border-gray-300 print:border-gray-400">
                <td className="py-2 px-2 text-center font-bold border-r border-gray-200 print:border-black bg-gray-50 print:bg-transparent">{index + 1}</td>
                <td className="py-2 px-2 uppercase font-medium border-r border-gray-200 print:border-black truncate max-w-[200px]">{athlete.name}</td>
                <td className="py-2 px-2 text-center font-mono text-gray-600 print:text-black border-r border-gray-200 print:border-black">{athlete.rg || '-'}</td>
                <td className="py-2 px-2 text-center font-mono text-gray-600 print:text-black border-r border-gray-200 print:border-black">{athlete.cpf}</td>
                <td className="py-2 px-2 text-center font-mono">
                  {athlete.dob ? format(new Date(athlete.dob), 'dd/MM/yyyy') : '-'}
                </td>
              </tr>
            ))}
            {/* Filler Rows for aesthetics (up to 12) */}
            {Array.from({ length: Math.max(0, 12 - currentAthletes.length) }).map((_, i) => (
              <tr key={`fill-${i}`} className="border-b border-gray-200 print:border-gray-400 h-8">
                <td className="py-1 px-2 text-center text-gray-300 border-r border-gray-200 print:border-black">{currentAthletes.length + i + 1}</td>
                <td className="py-1 px-2 border-r border-gray-200 print:border-black"></td>
                <td className="py-1 px-2 border-r border-gray-200 print:border-black"></td>
                <td className="py-1 px-2 border-r border-gray-200 print:border-black"></td>
                <td className="py-1 px-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* COMMISSION TABLE */}
      <section className="mb-10 page-break-inside-avoid">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-200 pb-1">
          Comissão Técnica Responsável
        </h3>
        <table className="w-full border-collapse text-xs print:text-[11px]">
          <thead>
            <tr className="bg-gray-100 border-y-2 border-black print:bg-gray-200">
              <th className="py-2 px-2 text-left font-bold border-r border-gray-300 print:border-black w-2/5">Nome</th>
              <th className="py-2 px-2 text-center font-bold border-r border-gray-300 print:border-black w-1/5">Função</th>
              <th className="py-2 px-2 text-center font-bold border-r border-gray-300 print:border-black w-1/5">CREF/RG</th>
              <th className="py-2 px-2 text-center font-bold w-1/5">Contato</th>
            </tr>
          </thead>
          <tbody>
            {currentTechnicians.map((tech) => (
              <tr key={tech.id} className="border-b border-gray-300 print:border-gray-400">
                <td className="py-2 px-2 uppercase font-medium border-r border-gray-200 print:border-black">{tech.name}</td>
                <td className="py-2 px-2 text-center uppercase text-gray-600 print:text-black border-r border-gray-200 print:border-black">Técnico(a)</td>
                <td className="py-2 px-2 text-center font-mono border-r border-gray-200 print:border-black">{tech.cref || tech.cpf}</td>
                <td className="py-2 px-2 text-center font-mono">{tech.phone}</td>
              </tr>
            ))}
            {currentTechnicians.length === 0 && (
              <tr className="border-b border-gray-200 print:border-gray-400 h-8">
                <td className="py-2 px-2 border-r border-gray-200 print:border-black">&nbsp;</td>
                <td className="py-2 px-2 border-r border-gray-200 print:border-black">&nbsp;</td>
                <td className="py-2 px-2 border-r border-gray-200 print:border-black">&nbsp;</td>
                <td className="py-2 px-2">&nbsp;</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* FOOTER & SIGNATURES */}
      <footer className="mt-auto pt-8 page-break-inside-avoid">
        <div className="border-2 border-black p-4 bg-gray-50 print:bg-transparent rounded-sm text-center mb-8">
          <p className="text-[10px] text-gray-600 print:text-black uppercase tracking-wide leading-relaxed text-justify px-4">
            Declaramos, para os devidos fins, que os atletas relacionados nesta ficha de inscrição são alunos regularmente matriculados nesta instituição de ensino e estão aptos a praticar atividades físicas e participar deste evento esportivo, conforme atestados médicos arquivados na secretaria da escola. Nos responsabilizamos integralmente pela veracidade de todas as informações aqui prestadas.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16 mt-16 px-12">
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-bold text-sm uppercase">{currentSchool.directorName}</p>
              <p className="text-xs text-gray-500 uppercase">Diretor(a) / Gestor(a)</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black pt-2">
              <p className="font-bold text-sm uppercase">Carimbo da Escola</p>
              <p className="text-xs text-gray-500 uppercase">Assinatura</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 text-[9px] text-gray-400 print:text-gray-500 uppercase">
          Documento gerado eletronicamente em {format(new Date(), 'dd/MM/yyyy HH:mm')} pelo sistema Gerador de Eventos v2.0
        </div>
      </footer>

      {/* Print Styles Injection */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background: white;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
