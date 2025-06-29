import type { User } from '../../domain/entities/User'
import type { AuthAPIDataSource } from '../../domain/providers/AuthAPIDataSource.interface'
import type { AuthService } from '../../domain/providers/AuthService.interface'
import type { TokenDataSource } from '../../domain/providers/TokenDataSource.interface'
import type { LoginCredentials } from '../../domain/types/LoginCredentials.interface'
import type { Tokens } from '../../domain/types/Tokens.interface'

export class AuthServiceHTTP implements AuthService {
  // Inversão de Dependência
  constructor(
    private readonly apiDataSource: AuthAPIDataSource,
    private readonly tokenStorage: TokenDataSource,
  ) {}

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: Tokens }> {
    const { user, tokens } = await this.apiDataSource.login(credentials)
    this.tokenStorage.save(tokens.refreshToken ?? '')
    return { user, tokens }
  }

  async logout(): Promise<void> {
    // Idealmente, notificar a API para invalidar o refresh token
    const currentRefreshToken = this.tokenStorage.get()
    await this.apiDataSource.logout(currentRefreshToken)
    this.tokenStorage.remove()
  }

  async refreshToken(): Promise<Tokens> {
    const currentRefreshToken = this.tokenStorage.get()
    const tokens = await this.apiDataSource.refreshToken(currentRefreshToken)
    this.tokenStorage.save(tokens.refreshToken ?? '') // Token Rotation
    return tokens
  }

  async getMe(): Promise<User> {
    return this.apiDataSource.getMe()
  }
}
