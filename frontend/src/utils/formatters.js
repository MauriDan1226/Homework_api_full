// La fecha limite es una fecha de calendario, no un instante: se guarda como
// medianoche UTC. Por eso todo se formatea y se compara en UTC; si se dejara
// al huso local, un usuario en UTC-5 veria siempre el dia anterior.
const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(value) {
  if (!value) return 'Sin fecha limite';
  return dateFormatter.format(new Date(value));
}

// Para los inputs type="date", que esperan siempre yyyy-mm-dd
export function toInputDate(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

// Dia de calendario de la fecha guardada, como marca de tiempo comparable
function toCalendarDay(value) {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

// El "hoy" del usuario es su dia local, llevado a la misma escala
function today() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysUntil(value) {
  if (!value) return null;
  return Math.round((toCalendarDay(value) - today()) / 86400000);
}

export function getDueLabel(value) {
  const diff = daysUntil(value);

  if (diff === null) return { text: 'Sin fecha limite', tone: 'neutral' };
  if (diff < -1) return { text: `Vencida hace ${Math.abs(diff)} dias`, tone: 'overdue' };
  if (diff === -1) return { text: 'Vencio ayer', tone: 'overdue' };
  if (diff === 0) return { text: 'Vence hoy', tone: 'today' };
  if (diff === 1) return { text: 'Vence manana', tone: 'soon' };
  if (diff <= 3) return { text: `Vence en ${diff} dias`, tone: 'soon' };

  return { text: formatDate(value), tone: 'neutral' };
}
