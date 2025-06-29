import type { User } from '../../domain/entities/User'
import type { AuthAPIDataSource } from '../../domain/providers/AuthAPIDataSource.interface'
import type { LoginCredentials } from '../../domain/types/LoginCredentials.interface'
import type { Tokens } from '../../domain/types/Tokens.interface'

export class AuthAPIDataSourceMock implements AuthAPIDataSource {
  private user: User = {
    id: '1',
    name: 'Usuario Teste',
    email: 'usuario@email.com',
    imageUrl:
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    roles: ['user'],
  }

  private tokenStorageDataSource = import.meta.env.VITE_TOKEN_STORAGE_STRATEGY

  private fakeApiDelay = (ms: number) => {
    return new Promise<void>((resolve) => setTimeout(resolve, ms))
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: Tokens }> {
    await this.fakeApiDelay(1000)
    if (credentials.email === 'usuario@email.com' && credentials.password === '123456') {
      const user = this.user
      const tokens = {
        accessToken: 'abc123-access-token',
        refreshToken: this.tokenStorageDataSource === 'localstorage' ? 'abc123-refresh-token' : '',
      }
      return { user, tokens }
    }
    throw new Error('E-mail ou senha inválidos')
  }

  async logout(refreshToken: string | null): Promise<void> {
    console.log(`Mock logout called with refreshToken: ${refreshToken ?? 'cookie'}`)
    await this.fakeApiDelay(1000)
  }

  async refreshToken(refreshToken: string | null): Promise<Tokens> {
    // Se um refresh token for passado (estratégia localStorage), envie-o no corpo.
    // Se for nulo (estratégia de cookie), não envie corpo, pois o navegador anexa o cookie.
    const payload = refreshToken ? { refreshToken } : {}
    console.log(`Mock refreshtoken called with refreshToken: ${payload ?? 'cookie'}`)
    await this.fakeApiDelay(1000)
    if (refreshToken) {
      console.log('tem refresh')
      if (!refreshToken.endsWith('refresh-token')) throw new Error('Refresh token inválido')
      return {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      }
    }
    console.log('não tem refresh')
    return {
      accessToken: 'new-access-token',
      refreshToken: '',
    }
  }

  async getMe(): Promise<User> {
    try {
      // const response = await apiClient.get<User>('/auth/me');
      await this.fakeApiDelay(1000)
      return this.user
    } catch (error) {
      console.error('Falha ao buscar dados do usuário:', error)
      throw new Error('Não foi possível obter os dados do usuário.')
    }
  }
}
