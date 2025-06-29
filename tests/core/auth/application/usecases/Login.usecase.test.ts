import { describe, expect, it, vi } from 'vitest'
import { LoginUseCase } from '../../../../../src/core/auth/application/usecases/Login.usecase'
import { AUTH_ERROR_MESSAGES } from '../../../../../src/core/auth/domain/constants/messages'
import type { User } from '../../../../../src/core/auth/domain/entities/User'
import type { AuthService } from '../../../../../src/core/auth/domain/providers/AuthService.interface'
import type { Tokens } from '../../../../../src/core/auth/domain/types/Tokens.interface'

// Mock do AuthService
const mockAuthService: AuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  getMe: vi.fn(),
}

describe('LoginUseCase', () => {
  it('deve chamar authService.login com as credenciais corretas e retornar o usuário e tokens', async () => {
    // Arrange (Organizar)
    const loginUseCase = new LoginUseCase(mockAuthService)
    const credentials = { email: 'test@example.com', password: 'password123' }
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roles: ['user'],
    }
    const mockTokens: Tokens = { accessToken: 'access', refreshToken: 'refresh' }

    // Mockando a resposta do serviço
    vi.mocked(mockAuthService.login).mockResolvedValue({ user: mockUser, tokens: mockTokens })

    // Act (Agir)
    const result = await loginUseCase.execute(credentials)

    // Assert (Verificar)
    expect(mockAuthService.login).toHaveBeenCalledWith(credentials)
    expect(result.user).toEqual(mockUser)
    expect(result.tokens).toEqual(mockTokens)
  })

  it('deve lançar um erro se o serviço de autenticação falhar', async () => {
    // Arrange
    const loginUseCase = new LoginUseCase(mockAuthService)
    const credentials = { email: 'test@example.com', password: 'wrongpassword' }
    const errorMessage = AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS

    vi.mocked(mockAuthService.login).mockRejectedValue(new Error(errorMessage))

    // Act & Assert
    await expect(loginUseCase.execute(credentials)).rejects.toThrow(errorMessage)
  })
})
