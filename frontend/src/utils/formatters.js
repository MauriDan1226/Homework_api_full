const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
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

// Dias que faltan (o que han pasado) hasta la fecha limite, comparando
// siempre a medianoche para que "hoy" no dependa de la hora actual.
export function daysUntil(value) {
  if (!value) return null;

  const target = new Date(value);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round((target - today) / 86400000);
}

export function getDueLabel(value) {
  const diff = daysUntil(value);

  if (diff === null) return { text: 'Sin fecha limite', tone: 'neutral' };
  if (diff < 0) return { text: `Vencida hace ${Math.abs(diff)} d.`, tone: 'overdue' };
  if (diff === 0) return { text: 'Vence hoy', tone: 'today' };
  if (diff === 1) return { text: 'Vence manana', tone: 'soon' };
  if (diff <= 3) return { text: `Vence en ${diff} dias`, tone: 'soon' };

  return { text: formatDate(value), tone: 'neutral' };
}
