import type { TokenDataSource } from '../../domain/providers/TokenDataSource.interface'
// Abstrai onde o refresh token é guardado.
// TODO: trocar para um cookie seguro no futuro.
export class TokenDataSourceLocalStorage implements TokenDataSource {
  private REFRESH_TOKEN_KEY = 'token'

  save(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  get(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  remove(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  hasToken(): boolean {
    const token = this.get()
    return !!token
  }
}
