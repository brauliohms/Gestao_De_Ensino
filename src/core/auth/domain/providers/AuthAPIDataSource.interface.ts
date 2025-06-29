import type { User } from '../entities/User'
import type { LoginCredentials } from '../types/LoginCredentials.interface'
import type { Tokens } from '../types/Tokens.interface'

export interface AuthAPIDataSource {
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: Tokens }>
  logout(refreshToken: string | null): Promise<void>
  refreshToken(refreshToken: string | null): Promise<Tokens>
  getMe(): Promise<User>
  // updateUserProfile(user: User): Promise<User>;
  // changePassword(currentPassword: string, newPassword: string): Promise<void>;
  // requestPasswordReset(email: string): Promise<void>;
  // resetPassword(token: string, newPassword: string): Promise<void>;
  // verifyEmail(token: string): Promise<void>;
}
