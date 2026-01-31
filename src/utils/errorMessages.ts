interface ErrorResponse {
  message?: string;
  error?: string;
  details?: string;
  status?: number;
}

const errorPatterns: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /invalid credentials|wrong password|incorrect password/i, message: 'Email ou senha incorretos' },
  { pattern: /user not found|email not found/i, message: 'Usuário não encontrado' },
  { pattern: /email already exists|email.*already.*registered/i, message: 'Este email já está cadastrado' },
  { pattern: /username already exists|username.*already.*taken/i, message: 'Este nome de usuário já está em uso' },
  { pattern: /invalid email/i, message: 'Email inválido' },
  { pattern: /password.*too short|password.*minimum/i, message: 'A senha deve ter no mínimo 6 caracteres' },
  { pattern: /password.*too weak/i, message: 'A senha é muito fraca. Use letras, números e caracteres especiais' },

  { pattern: /network error|failed to fetch/i, message: 'Erro de conexão. Verifique sua internet e tente novamente' },
  { pattern: /timeout/i, message: 'A requisição demorou muito. Tente novamente' },
  { pattern: /server error|internal server error|500/i, message: 'Erro no servidor. Tente novamente em alguns instantes' },

  { pattern: /required field|field is required/i, message: 'Preencha todos os campos obrigatórios' },
  { pattern: /invalid format/i, message: 'Formato inválido. Verifique os dados digitados' },

  { pattern: /session expired|token expired/i, message: 'Sua sessão expirou. Faça login novamente' },
  { pattern: /unauthorized|not authorized/i, message: 'Não autorizado. Faça login novamente' },

  { pattern: /too many requests|rate limit/i, message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente' },
];


function tryParseJSON(text: string): ErrorResponse | null {
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    return null;
  }
}


function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as ErrorResponse;

    if (err.message) return err.message;
    if (err.error) return err.error;
    if (err.details) return err.details;
  }

  return 'Ocorreu um erro desconhecido';
}

export function formatErrorMessage(error: unknown): string {
  let rawMessage = extractErrorMessage(error);

  if (rawMessage.trim().startsWith('{')) {
    const parsed = tryParseJSON(rawMessage);
    if (parsed) {
      rawMessage = extractErrorMessage(parsed);
    }
  }

  for (const { pattern, message } of errorPatterns) {
    if (pattern.test(rawMessage)) {
      return message;
    }
  }

  const cleanedMessage = rawMessage
    .replace(/^Error:\s*/i, '')
    .replace(/\n.*/s, '')
    .replace(/\{.*\}/g, '')
    .replace(/\[.*\]/g, '')
    .trim();

  if (
    !cleanedMessage ||
    cleanedMessage.length < 3 ||
    cleanedMessage.length > 200 ||
    /^[A-Z_]+$/.test(cleanedMessage)
  ) {
    return 'Ocorreu um erro ao processar sua solicitação. Tente novamente';
  }

  return cleanedMessage;
}

export function formatAuthError(error: unknown): string {
  const formatted = formatErrorMessage(error);

  if (formatted.includes('Email ou senha incorretos')) {
    return `${formatted}. Verifique suas credenciais e tente novamente`;
  }

  if (formatted.includes('já está cadastrado')) {
    return `${formatted}. Tente fazer login ou use outro email`;
  }

  return formatted;
}


export function logErrorDetails(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}] Error details:`, error);
  }
}
