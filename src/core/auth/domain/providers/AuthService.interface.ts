import type { User } from '../entities/User'
import type { LoginCredentials } from '../types/LoginCredentials.interface'
import type { Tokens } from '../types/Tokens.interface'

// A interface define o "contrato" que a camada de infraestrutura deve seguir.
export interface AuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: Tokens }>
  logout(): Promise<void>
  refreshToken(): Promise<Tokens>
  getMe(): Promise<User>
}
