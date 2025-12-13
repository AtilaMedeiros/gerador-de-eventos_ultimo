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
  | 'REABERTO'
  | 'SUSPENSO'
  | 'CANCELADO'
  | 'ARQUIVADO'
  | string;

export function getEventoCor(statusData: StatusData, statusAdmin: StatusAdmin): string {
  const sd = (statusData || '').toString().toUpperCase();
  const sa = (statusAdmin || '').toString().toUpperCase();

  // Mapeamento consolidado: (statusData + statusAdministrativo) -> hex
  if (sd === 'AGENDADO' && sa === 'RASCUNHO') return '#9CA3AF'; // Cinza
  if (sd === 'AGENDADO' && sa === 'PUBLICADO') return '#3B82F6'; // Azul

  if (sd === 'ATIVO' && sa === 'PUBLICADO') return '#22C55E'; // Verde
  if (sd === 'ATIVO' && sa === 'SUSPENSO') return '#FB923C'; // Laranja

  if (sd === 'ENCERRADO' && sa === 'PUBLICADO') return '#6B7280'; // Cinza escuro
  if (sd === 'ENCERRADO' && sa === 'REABERTO') return '#F59E0B'; // Amarelo
  if (sd === 'ENCERRADO' && sa === 'CANCELADO') return '#EF4444'; // Vermelho

  // Fallbacks por criticidade (em ordem): CANCELADO, ENCERRADO(REABERTO), SUSPENSO, ATIVO, AGENDADO
  if (sa === 'CANCELADO') return '#EF4444';
  if (sa === 'REABERTO') return '#F59E0B';
  if (sa === 'SUSPENSO') return '#FB923C';
  if (sd === 'EM_ANDAMENTO' || sd === 'ATIVO') return '#22C55E';

  // Default neutro
  return '#9CA3AF';
}

export default getEventoCor;
