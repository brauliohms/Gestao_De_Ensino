import type { UseCase } from '../../../common/domain/providers/UseCase.interface'
import { AUTH_ERROR_MESSAGES } from '../../domain/constants/messages'
import type { AuthService } from '../../domain/providers/AuthService.interface'

export class LogoutUseCase implements UseCase<void, void> {
  constructor(private readonly authService: AuthService) {}

  async execute(): Promise<void> {
    try {
      await this.authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
      throw new Error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED)
    }
  }
}
