import { GetMeUseCase } from '@/core/auth/application/usecases/GetMe.usecase'
import { RefreshTokenUseCase } from '@/core/auth/application/usecases/RefreshToken.usecase'
import type { AuthService } from '@/core/auth/domain/providers/AuthService.interface'
import type { TokenDataSource } from '@/core/auth/domain/providers/TokenDataSource.interface'
import { useAuthStore } from '@/stores/auth.store'
import { inject } from 'vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()
  // 1. Se o usuário já está autenticado no estado do Pinia, tudo certo, permite o acesso.
  if (authStore.isAuthenticated) {
    return next()
  }
  // 2. Se não, verifica se há um refresh token para tentar revalidar a sessão.
  const tokenStorage = inject<TokenDataSource>('tokenDataSource') as TokenDataSource
  if (!tokenStorage.hasToken()) {
    // Se não há refresh token, não há sessão para restaurar. Vá para o login.
    return next({ name: 'login' })
  }
  // 3. Tenta o fluxo de "login silencioso".
  // Se não está autenticado, mas existe um refresh token no storage, tenta um login silencioso.
  // Isso acontece no F5 ou ao abrir uma nova aba.
  const authService = inject<AuthService>('authService') as AuthService
  const refreshTokenUseCase = new RefreshTokenUseCase(authService)
  try {
    // Passo A: Obter novos tokens usando o refresh token.
    const tokens = await refreshTokenUseCase.execute()

    // Passo B: Com o novo access token (que já foi setado no httpClient dentro do authService
    // pelo interceptor ou manualmente), buscar os dados do usuário.
    // const getMeUseCase = inject<GetMeUseCase>('getMeUseCase') as GetMeUseCase
    const getMeUseCase = new GetMeUseCase(authService)
    const user = await getMeUseCase.execute()
    // const user = await authService.getMe()

    // Passo C: Atualizar o store do Pinia com todos os dados da sessão restaurada.
    authStore.setSuccessfulLogin({ userInfo: user, tokens })

    next()
  } catch (error) {
    // Se qualquer parte do fluxo de refresh falhar (refresh token inválido, API offline, etc.),
    // a sessão é considerada inválida. Limpa o storage e redireciona para o login.
    console.error('Falha na restauração da sessão:', error instanceof Error ? error.message : error)
    tokenStorage.remove()
    authStore.resetState()
    // Se o refresh falhar, redireciona para o login.
    next({ name: 'login' })
  }
}

export async function redirectIfAuthenticated(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()
  if (authStore.isAuthenticated) {
    return next({ name: from.name === 'login' ? 'home' : from.name })
  }
  const tokenStorage = inject<TokenDataSource>('tokenDataSource') as TokenDataSource
  if (!tokenStorage.hasToken()) {
    return next()
  }
  const authService = inject<AuthService>('authService') as AuthService
  const refreshTokenUseCase = new RefreshTokenUseCase(authService)
  try {
    const tokens = await refreshTokenUseCase.execute()
    const getMeUseCase = new GetMeUseCase(authService)
    const user = await getMeUseCase.execute()
    authStore.setSuccessfulLogin({ userInfo: user, tokens })
    next({ name: from.name === 'login' ? 'home' : from.name })
  } catch (error) {
    console.error('Falha na restauração da sessão:', error instanceof Error ? error.message : error)
    tokenStorage.remove()
    authStore.resetState()
    next()
  }
  next()
}
