export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Senha ou email inválidos',
  USER_NOT_FOUND: 'Usuário não encontrado',
  USER_ALREADY_EXISTS: 'Usuário já existe',
  INVALID_TOKEN: 'Token inválido',
  EXPIRED_TOKEN: 'Token expirado',
  INVALID_REFRESH_TOKEN: 'Refresh token inválido',
  TOKENS_NOT_REFRESHABLE: 'Refresh token ou Access token não pode ser renovado',
  LOGOUT_FAILED: 'Erro ao realizar logout',
  UNAUTHORIZED: 'Usuário não autorizado',
  FORBIDDEN: 'Acesso negado',
  ACCOUNT_LOCKED: 'Conta bloqueada',
} as const
export type AuthErrorMessages = (typeof AUTH_ERROR_MESSAGES)[keyof typeof AUTH_ERROR_MESSAGES]
