import { describe, expect, it, vi } from 'vitest'
import { LogoutUseCase } from '../../../../../src/core/auth/application/usecases/Logout.usecase'
import { AUTH_ERROR_MESSAGES } from '../../../../../src/core/auth/domain/constants/messages'
import type { AuthService } from '../../../../../src/core/auth/domain/providers/AuthService.interface'

// Mock do AuthService
const mockAuthService: AuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  getMe: vi.fn(),
}

describe('LogoutUseCase', () => {
  it('deve chamar authService.logout e completar sem erros', async () => {
    // Arrange
    const logoutUseCase = new LogoutUseCase(mockAuthService)
    vi.mocked(mockAuthService.logout).mockResolvedValue(undefined)

    // Act & Assert
    await expect(logoutUseCase.execute()).resolves.not.toThrow()
    expect(mockAuthService.logout).toHaveBeenCalledTimes(1)
  })

  it('deve lançar um erro se o serviço de logout falhar', async () => {
    // Arrange
    const logoutUseCase = new LogoutUseCase(mockAuthService)
    vi.mocked(mockAuthService.logout).mockRejectedValue(new Error('API Error'))

    // Act & Assert
    await expect(logoutUseCase.execute()).rejects.toThrow(AUTH_ERROR_MESSAGES.LOGOUT_FAILED)
  })
})
