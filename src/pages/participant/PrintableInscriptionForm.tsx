import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useParticipant } from '@/contexts/ParticipantContext'
import { useEvent } from '@/contexts/EventContext'
import { useModality } from '@/contexts/ModalityContext'
import { format } from 'date-fns'

export default function PrintableInscriptionForm() {
  const { eventId, modalityId } = useParams()
  const { school, inscriptions, athletes, technicians } = useParticipant()
  const { getEventById } = useEvent()
  const { getModalityById } = useModality()

  const event = eventId ? getEventById(eventId) : null
  const modality = modalityId ? getModalityById(modalityId) : null

  // Auto print
  useEffect(() => {
    setTimeout(() => {
      window.print()
    }, 1000)
  }, [])

  if (!school || !event || !modality) return <div>Carregando dados...</div>

  // Get athletes enrolled in this specific modality and event
  const enrolledAthletesIds = inscriptions
    .filter((i) => i.eventId === eventId && i.modalityId === modalityId)
    .map((i) => i.athleteId)

  const enrolledAthletes = athletes.filter((a) =>
    enrolledAthletesIds.includes(a.id),
  )

  return (
    <div className="bg-white text-black p-8 max-w-[210mm] mx-auto print:p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Placeholder Logo */}
          <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center border border-gray-400">
            Logo
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase">{event.name}</h1>
            <p className="text-sm">Ficha de Inscrição Oficial</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">Edição {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* School Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 border border-black p-2 text-sm">
        <div>
          <span className="font-bold block">ESCOLA:</span> {school.name}
        </div>
        <div>
          <span className="font-bold block">CÓD. INEP:</span> {school.inep}
        </div>
        <div>
          <span className="font-bold block">MUNICÍPIO:</span>{' '}
          {school.municipality}
        </div>
        <div>
          <span className="font-bold block">BAIRRO:</span> {school.neighborhood}
        </div>
      </div>

      {/* Modality Info */}
      <div className="bg-gray-100 border border-black p-2 mb-6 text-center">
        <h2 className="font-bold text-lg uppercase">
          {modality.name} - {modality.gender}
        </h2>
        <p className="text-sm">
          Categoria: {modality.minAge} a {modality.maxAge} anos ({modality.type}
          )
        </p>
      </div>

      {/* Athletes Table */}
      <div className="mb-6">
        <h3 className="font-bold mb-2 border-b border-black inline-block">
          INFORMAÇÕES DO ATLETA
        </h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-center w-10">#</th>
              <th className="border border-black p-1 text-left">
                NOME COMPLETO
              </th>
              <th className="border border-black p-1 text-center">RG</th>
              <th className="border border-black p-1 text-center">CPF</th>
              <th className="border border-black p-1 text-center">
                NASCIMENTO
              </th>
            </tr>
          </thead>
          <tbody>
            {enrolledAthletes.map((athlete, index) => (
              <tr key={athlete.id}>
                <td className="border border-black p-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-black p-1">{athlete.name}</td>
                <td className="border border-black p-1 text-center">
                  {athlete.rg}
                </td>
                <td className="border border-black p-1 text-center">
                  {athlete.cpf}
                </td>
                <td className="border border-black p-1 text-center">
                  {format(athlete.dob, 'dd/MM/yyyy')}
                </td>
              </tr>
            ))}
            {/* Empty rows filler if needed */}
            {Array.from({
              length: Math.max(0, 12 - enrolledAthletes.length),
            }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border border-black p-1 text-center">
                  {enrolledAthletes.length + i + 1}
                </td>
                <td className="border border-black p-1">&nbsp;</td>
                <td className="border border-black p-1">&nbsp;</td>
                <td className="border border-black p-1">&nbsp;</td>
                <td className="border border-black p-1">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Technicians Table */}
      <div className="mb-8">
        <h3 className="font-bold mb-2 border-b border-black inline-block">
          INFORMAÇÕES DA COMISSÃO TÉCNICA
        </h3>
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-left">NOME</th>
              <th className="border border-black p-1 text-center">FUNÇÃO</th>
              <th className="border border-black p-1 text-center">CREF</th>
              <th className="border border-black p-1 text-center">CELULAR</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((tech) => (
              <tr key={tech.id}>
                <td className="border border-black p-1">{tech.name}</td>
                <td className="border border-black p-1 text-center">Técnico</td>
                <td className="border border-black p-1 text-center">
                  {tech.cref}
                </td>
                <td className="border border-black p-1 text-center">
                  {tech.phone}
                </td>
              </tr>
            ))}
            {/* Empty row if no technicians */}
            {technicians.length === 0 && (
              <tr>
                <td className="border border-black p-1">&nbsp;</td>
                <td className="border border-black p-1">&nbsp;</td>
                <td className="border border-black p-1">&nbsp;</td>
                <td className="border border-black p-1">&nbsp;</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Disclaimer & Signature */}
      <div className="mt-12">
        <p className="text-xs text-justify mb-8">
          Declaramos que os atletas acima relacionados são alunos regularmente
          matriculados nesta instituição de ensino e estão aptos a participar
          deste evento esportivo. Nos responsabilizamos pela veracidade das
          informações aqui prestadas.
        </p>

        <div className="flex justify-center mt-16">
          <div className="text-center border-t border-black px-12 pt-2">
            <p className="font-bold">{school.directorName}</p>
            <p className="text-sm">Diretor(a) da Instituição</p>
          </div>
        </div>
      </div>
    </div>
  )
}
