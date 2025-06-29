import { RefreshTokenUseCase } from '@/core/auth/application/usecases/RefreshToken.usecase'
import type { AuthService } from '@/core/auth/domain/providers/AuthService.interface'
import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'
import type HttpClient from './HttpClient.interface'

export default class AxiosAdapter implements HttpClient {
  private apiClient = axios.create()
  private isRefreshing = false
  /**
   * Construtor da classe AxiosAdapter
   * @param baseURL URL base para as requisições
   */
  constructor(
    private authService: AuthService,
    baseURL?: string,
  ) {
    // Configuração base do axios
    this.apiClient.defaults.baseURL = baseURL
    this.apiClient.defaults.withCredentials = true // Permite cookies e autenticação cross-site
    // Interceptor para requisições
    // Interceptor para adicionar o Access Token em cada requisição
    this.apiClient.interceptors.request.use(
      (config) => {
        const { origin } = new URL(config.url || '')
        const authStore = useAuthStore()
        if (authStore.accessToken && origin === import.meta.env.VITE_ALLOWED_ORIGINS) {
          config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
    // Interceptor para lidar com 401 (token expirado) e tentar o refresh
    this.apiClient.interceptors.response.use(
      // Caso não tenha erro, retorna a resposta
      (response) => response,
      // Caso tenha erro, tenta atualizar o token
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Se já está fazendo refresh, espera a promessa resolver
            // Lógica para enfileirar requisições...
            return
          }
          originalRequest._retry = true
          this.isRefreshing = true
          const authStore = useAuthStore()
          try {
            // Usa o caso de uso de refresh token
            const refreshTokenUseCase = new RefreshTokenUseCase(this.authService)
            const newTokens = await refreshTokenUseCase.execute()
            authStore.setTokens(newTokens)
            this.apiClient.defaults.headers.common['Authorization'] =
              'Bearer ' + newTokens.accessToken
            this.isRefreshing = false
            return this.apiClient(originalRequest) // Tenta a requisição original novamente com o novo token
          } catch (refreshError) {
            this.isRefreshing = false
            authStore.logout() // Logout se o refresh falhar
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      },
    )
  }

  setAuthorizationHeader(token: string | null) {
    if (token) {
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.apiClient.defaults.headers.common['Authorization']
    }
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.apiClient<T>({
      url,
      method: 'get',
    })
    return response.data
  }

  async post<TIn, TOut>(url: string, data: TIn): Promise<TOut> {
    const response = await this.apiClient<TOut>({
      url,
      method: 'post',
      data,
    })
    return response.data
  }

  async put<TIn, TOut>(url: string, data: TIn): Promise<TOut> {
    const response = await this.apiClient<TOut>({
      url,
      method: 'put',
      data,
    })
    return response.data
  }

  async delete(url: string): Promise<void> {
    await this.apiClient({
      url,
      method: 'delete',
    })
  }
}
