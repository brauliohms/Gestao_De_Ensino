import type { LoginCredentials } from '@/core/auth/domain/types/LoginCredentials.interface'
import type { UseCase } from '../../../common/domain/providers/UseCase.interface'
import { AUTH_ERROR_MESSAGES } from '../../domain/constants/messages'
import type { User } from '../../domain/entities/User'
import type { AuthService } from '../../domain/providers/AuthService.interface'
import type { Tokens } from '../../domain/types/Tokens.interface'

export class LoginUseCase implements UseCase<LoginCredentials, { user: User; tokens: Tokens }> {
  constructor(private readonly authService: AuthService) {}

  async execute(credentials: LoginCredentials) {
    const { tokens, user } = await this.authService.login(credentials)
    if (!user || !tokens) throw new Error(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS)
    return { user, tokens }
  }
}
