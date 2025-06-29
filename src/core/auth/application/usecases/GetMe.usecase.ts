import type { UseCase } from '../../../common/domain/providers/UseCase.interface'
import { AUTH_ERROR_MESSAGES } from '../../domain/constants/messages'
import type { User } from '../../domain/entities/User'
import type { AuthService } from '../../domain/providers/AuthService.interface'

export class GetMeUseCase implements UseCase<void, User> {
  constructor(private readonly authService: AuthService) {}

  async execute(): Promise<User> {
    const user = await this.authService.getMe()
    if (!user) {
      throw new Error(AUTH_ERROR_MESSAGES.USER_NOT_FOUND)
    }
    return user
  }
}
