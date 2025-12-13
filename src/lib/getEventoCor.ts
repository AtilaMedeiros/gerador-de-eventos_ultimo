type StatusData =
  | 'PREPARACAO'
  | 'ABERTO_INSCRICAO'
  | 'INSCRICOES_ENCERRADAS'
  | 'EM_ANDAMENTO'
  | 'ENCERRADO'
  | string;

type StatusAdmin =
  | 'RASCUNHO'
  | 'PUBLICADO'
  | 'DESATIVADO'
  | 'ARQUIVADO'
  | string;

export function getEventoCor(statusData: StatusData, statusAdmin: StatusAdmin): string {
  const sd = (statusData || '').toString().toUpperCase();
  const sa = (statusAdmin || '').toString().toUpperCase();

  // Mapeamento consolidado: (statusData + statusAdministrativo) -> hex
  if (sd === 'AGENDADO' && sa === 'RASCUNHO') return '#9CA3AF'; // Cinza
  if (sd === 'AGENDADO' && sa === 'PUBLICADO') return '#3B82F6'; // Azul

  if (sd === 'ATIVO' && sa === 'PUBLICADO') return '#22C55E'; // Verde

  if (sd === 'ENCERRADO' && sa === 'PUBLICADO') return '#6B7280'; // Cinza escuro
  if (sd === 'ENCERRADO' && sa === 'DESATIVADO') return '#EF4444'; // Vermelho

  // Fallbacks por criticidade (em ordem): DESATIVADO, ENCERRADO(REABERTO), SUSPENSO, ATIVO, AGENDADO
  if (sa === 'DESATIVADO') return '#EF4444';
  if (sd === 'EM_ANDAMENTO' || sd === 'ATIVO') return '#22C55E';

  // Default neutro
  return '#9CA3AF';
}

export default getEventoCor;
