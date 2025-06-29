import type { LoginUseCase } from '@/core/auth/application/usecases/Login.usecase'
import type { LogoutUseCase } from '@/core/auth/application/usecases/Logout.usecase'
import type { User } from '@/core/auth/domain/entities/User'
import type { LoginCredentials } from '@/core/auth/domain/types/LoginCredentials.interface'
import type { Tokens } from '@/core/auth/domain/types/Tokens.interface'
import type HttpClient from '@/infra/HttpClient.interface'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

const authChannel = new BroadcastChannel('auth')

export const useAuthStore = defineStore('auth', () => {
  const httpClient = inject<HttpClient>('httpClient') as HttpClient
  const loginUseCase = inject<LoginUseCase>('loginUseCase') as LoginUseCase
  const logoutUseCase = inject<LogoutUseCase>('logoutUseCase') as LogoutUseCase
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

  function setSuccessfulLogin({ userInfo, tokens }: { userInfo: User; tokens: Tokens }) {
    user.value = userInfo
    accessToken.value = tokens.accessToken
    isAuthenticated.value = true
    status.value = 'success'
    // Configura o interceptor do httpClient(Axios ou Fetch) para usar o novo token
    httpClient.setAuthorizationHeader(tokens.accessToken)
  }

  async function login(credentials: LoginCredentials) {
    status.value = 'loading'
    try {
      const { user: userInfo, tokens } = await loginUseCase.execute(credentials)
      setSuccessfulLogin({ userInfo, tokens })
      // router.push({ name: 'home' }) // Redireciona para a página inicial
    } catch (error) {
      status.value = 'error'
      resetState()
      throw error // Propaga o erro para o componente UI tratar
    }
  }

  async function logout(): Promise<void> {
    await logoutUseCase.execute()
    resetState()
    httpClient.setAuthorizationHeader(null) // Remove o token do Axios
    authChannel.postMessage('logout') // Notifica outras abas
    // router.push({ name: 'login' })
  }

  // Método para ouvir as mensagens
  function listenForChanges() {
    authChannel.onmessage = (event) => {
      if (event.data === 'logout' && isAuthenticated) {
        console.info('Logout recebido de outra aba. Limpando estado.')
        resetState()
        // Opcional: recarregar a página ou redirecionar
        window.location.reload()
      }
    }
  }

  // Chamado pelo interceptor ou pelo guard
  function setTokens(tokens: Tokens) {
    accessToken.value = tokens.accessToken
    isAuthenticated.value = true
    httpClient.setAuthorizationHeader(tokens.accessToken)
  }

  function resetState(): void {
    user.value = null
    accessToken.value = null
    isAuthenticated.value = false
    status.value = 'idle'
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    listenForChanges,
    login,
    logout,
    resetState,
    setSuccessfulLogin,
    setTokens,
  }
})
