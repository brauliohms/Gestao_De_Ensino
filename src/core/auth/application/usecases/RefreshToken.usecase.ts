import type { UseCase } from '../../../common/domain/providers/UseCase.interface'
import { AUTH_ERROR_MESSAGES } from '../../domain/constants/messages'
import type { AuthService } from '../../domain/providers/AuthService.interface'
import type { Tokens } from '../../domain/types/Tokens.interface'

export class RefreshTokenUseCase implements UseCase<void, Tokens> {
  constructor(private readonly authService: AuthService) {}

  async execute(): Promise<Tokens> {
    const tokens = await this.authService.refreshToken()
    if (!tokens) {
      throw new Error(AUTH_ERROR_MESSAGES.TOKENS_NOT_REFRESHABLE)
    }
    return tokens
  }
}
