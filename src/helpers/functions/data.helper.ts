// dateUtils.ts

const BRAZIL_TZ_OFFSET = 0; // O offset de fuso horário para BRT (UTC-3)

function getBrazilTime(date: Date): Date {
  // Obtém o offset atual do fuso horário local em horas
  const localOffset = date.getTimezoneOffset() / 60;

  // Calcula a diferença entre o fuso horário local e o horário de Brasília
  const brazilOffset = BRAZIL_TZ_OFFSET;

  // Calcula a diferença de horas para ajustar a data
  const timeDifference = (brazilOffset - localOffset) * 60 * 60 * 1000;

  // Ajusta a data para o horário de Brasília
  return new Date(date.getTime() + timeDifference);
}

// Função que cria e retorna a data atual ajustada para o horário do Brasil
export function getCurrentDateInBrazil(): Date {
  const now = new Date();
  return getBrazilTime(now);
}

// Função que cria e retorna uma data com base em uma string, ajustada para o horário do Brasil
export function getDateFromStringInBrazil(dateString: string): Date {
  const date = new Date(dateString);
  return getBrazilTime(date);
}
