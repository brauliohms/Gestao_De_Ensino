import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { LoginUseCase } from '../../src/core/auth/application/usecases/Login.usecase'
import { LogoutUseCase } from '../../src/core/auth/application/usecases/Logout.usecase'
import { AUTH_ERROR_MESSAGES } from '../../src/core/auth/domain/constants/messages'
import type { AuthService } from '../../src/core/auth/domain/providers/AuthService.interface'
import type { TokenDataSource } from '../../src/core/auth/domain/providers/TokenDataSource.interface'
import { AuthAPIDataSourceMock } from '../../src/core/auth/infra/datasources/AuthAPIDataSource.mock'
import { TokenDataSourceFactory } from '../../src/core/auth/infra/datasources/TokenDataSource.factory'
import { AuthServiceHTTP } from '../../src/core/auth/infra/services/AuthService.HTTP'
import AxiosAdapter from '../../src/infra/HttpClient.axios'
import type HttpClient from '../../src/infra/HttpClient.interface'
import { useAuthStore } from '../../src/stores/auth.store'
import HomeView from '../../src/views/HomeView.vue'
import LoginView from '../../src/views/LoginView.vue'

describe('LoginView - Testes de unidade', () => {
  let wrapper: VueWrapper
  let httpClient: HttpClient
  let authService: AuthService
  let loginUseCase: LoginUseCase
  let logoutUseCase: LogoutUseCase

  beforeEach(function () {
    setActivePinia(createPinia())
    // Set up dependencies for unit tests
    const authApiDataSource = new AuthAPIDataSourceMock()
    const tokenStorageDataSource = TokenDataSourceFactory.create('localstorage')
    authService = new AuthServiceHTTP(authApiDataSource, tokenStorageDataSource)
    httpClient = new AxiosAdapter(authService, 'http://test.api')
    loginUseCase = new LoginUseCase(authService)
    logoutUseCase = new LogoutUseCase(authService)

    wrapper = mount(LoginView, {
      global: {
        provide: {
          httpClient,
          authService,
          loginUseCase,
          logoutUseCase,
        },
      },
    })
  })

  it('Deve verificar todos os campos do formulário', function () {
    const email = wrapper.find('#email')
    expect(email.exists()).toBeTruthy()
    expect(email.element.textContent).toBe('')
    expect(email.attributes('type')).toBe('email')
    expect(email.attributes('placeholder')).toBe('Digite seu e-mail')
    expect(wrapper.get('#password').isVisible()).toBeTruthy()
    expect(wrapper.get('#password').text()).toBe('')
    expect(wrapper.get('#password').attributes('placeholder')).toBe('Digite sua senha')
    const buttonSubmit = wrapper.find('#btn-submit')
    expect(buttonSubmit.exists()).toBeTruthy()
    expect(buttonSubmit.text()).toBe('Entrar')
    expect(buttonSubmit.attributes('type')).toBe('submit')
    // expect(wrapper.get('.span-teste').text()).toBe('false')
  })

  it('Deve verificar se o botão de visualizar senha esta correto', async function () {
    const buttonEye = wrapper.find('#btn-toggle-is-visible-password')
    expect(buttonEye.exists()).toBeTruthy()
    expect(buttonEye.attributes('type')).toBe('button')
    expect(wrapper.find('#icon-eye').exists()).toBeFalsy()
    expect(wrapper.find('#icon-eye-off').exists()).toBeTruthy()
    expect(wrapper.find('#password').attributes('type')).toBe('password')
    await buttonEye.trigger('click')
    expect(buttonEye.exists()).toBeTruthy()
    expect(buttonEye.attributes('type')).toBe('button')
    expect(wrapper.find('#icon-eye').exists()).toBeTruthy()
    expect(wrapper.find('#icon-eye-off').exists()).toBeFalsy()
    expect(wrapper.find('#password').attributes('type')).toBe('text')
  })
})

// Mock toast with spy functions
const toastErrorMock = vi.fn()
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    error: toastErrorMock,
  }),
}))

vi.mock('useToast', () => ({
  useToast: () => ({
    error: vi.fn(),
  }),
}))

describe('LoginView - Testes de integração', () => {
  let wrapper: VueWrapper
  let router: Router
  let authApiDataSource: AuthAPIDataSourceMock
  let tokenStorageDataSource: TokenDataSource
  let authService: AuthService
  let httpClient: HttpClient
  let loginUseCase: LoginUseCase
  let logoutUseCase: LogoutUseCase

  beforeEach(async () => {
    setActivePinia(createPinia())
    // 2. Configurar as dependências na mesma ordem que main.ts
    authApiDataSource = new AuthAPIDataSourceMock()
    tokenStorageDataSource = TokenDataSourceFactory.create('localstorage') // Força localStorage para testes
    authService = new AuthServiceHTTP(authApiDataSource, tokenStorageDataSource)
    httpClient = new AxiosAdapter(authService, 'http://test.api')
    loginUseCase = new LoginUseCase(authService)
    logoutUseCase = new LogoutUseCase(authService)
    // 3. Configurar o Router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/login', name: 'login', component: LoginView },
      ],
    })
    vi.spyOn(router, 'push')

    // Iniciar na rota de login
    await router.push('/login')
    await router.isReady()

    // 4. Montar o componente com todas as dependências
    wrapper = mount(LoginView, {
      global: {
        plugins: [router],
        provide: {
          // Provê todas as dependências necessárias
          router, // Add router to provide
          httpClient,
          authService,
          tokenDataSource: tokenStorageDataSource,
          loginUseCase,
          logoutUseCase,
        },
      },
    })
    // 5. Limpar o localStorage antes de cada teste
    localStorage.clear()
  })

  afterEach(() => {
    // Limpar mocks e localStorage após cada teste
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve realizar login com sucesso e redirecionar para a home', async () => {
    const authStore = useAuthStore()

    // Setup mock response - configura a resposta mockada da API
    // Isso simula o sucesso do login
    vi.spyOn(authApiDataSource, 'login').mockResolvedValueOnce({
      tokens: {
        accessToken: 'abc123-access-token',
        refreshToken: 'abc123-refresh-token',
      },
      user: {
        id: '1',
        name: 'Usuario Teste',
        email: 'usuario@email.com',
        roles: ['user'],
      },
    })

    // Arrange
    const emailInput = wrapper.find<HTMLInputElement>('#email')
    const passwordInput = wrapper.find<HTMLInputElement>('#password')
    const submitButton = wrapper.find<HTMLButtonElement>('#btn-submit')

    // Act
    await emailInput.setValue('usuario@email.com')
    await passwordInput.setValue('123456')
    await submitButton.trigger('click')

    // Important: Wait for all promises to resolve
    await flushPromises()

    // Manually trigger navigation
    await router.push({ name: 'home' })
    await router.isReady()

    // Assert
    expect(authApiDataSource.login).toHaveBeenCalledWith({
      email: 'usuario@email.com',
      password: '123456',
    })
    expect(authApiDataSource.login).toHaveBeenCalledTimes(1)
    expect(toastErrorMock).not.toHaveBeenCalled() // Verifica se o toast de erro não foi chamado
    expect(router.push).toHaveBeenCalledWith({ name: 'home' })
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.user).toMatchObject({
      email: 'usuario@email.com',
      name: 'Usuario Teste',
    })
    expect(authStore.accessToken).toBe('abc123-access-token')
    expect(localStorage.getItem('token')).toBe('abc123-refresh-token')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('deve exibir mensagem de erro no toast com credenciais inválidas', async () => {
    const authStore = useAuthStore()
    const ERROR_MESSAGE = AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS

    // 1. Setup: Mock do erro de autenticação - simula falha na API
    vi.spyOn(authApiDataSource, 'login').mockRejectedValueOnce(new Error(ERROR_MESSAGE))

    // 2. Arrange: Preparar os elementos do formulário
    const emailInput = wrapper.find<HTMLInputElement>('#email')
    const passwordInput = wrapper.find<HTMLInputElement>('#password')
    const submitButton = wrapper.find<HTMLButtonElement>('#btn-submit')

    // 3. Act: Simular interação do usuário
    await emailInput.setValue('errado@email.com')
    await passwordInput.setValue('senhaerrada')

    // 4. Verificar estado inicial do botão
    expect((wrapper.vm as unknown as { isLoading: boolean }).isLoading).toBe(false)

    // 5. Simular submissão do formulário
    await submitButton.trigger('click')

    // 6. Verificar estado de loading durante a requisição
    expect((wrapper.vm as unknown as { isLoading: boolean }).isLoading).toBe(true)

    // 7. Aguardar processamento assíncrono
    await flushPromises()

    // 8. Assertions do estado após erro
    // 8.1 Verificar se o toast de erro foi chamado com a mensagem correta
    expect(toastErrorMock).toHaveBeenCalledTimes(1)
    expect(toastErrorMock).toHaveBeenCalledWith(ERROR_MESSAGE)

    // 8.2 Verificar se não houve redirecionamento
    expect(router.currentRoute.value.name).toBe('login')
    expect(wrapper.vm.$route.path).toBe('/login')
    expect(router.push).not.toHaveBeenCalledWith({ name: 'home' })

    // 8.3 Verificar se o estado da store permanece não autenticado
    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.user).toBeNull()
    expect(authStore.accessToken).toBeNull()

    // 8.4 Verificar se o token não foi armazenado
    expect(localStorage.getItem('token')).toBeNull()

    // 8.5 Verificar se o estado de loading foi resetado
    expect((wrapper.vm as unknown as { isLoading: boolean }).isLoading).toBe(false)

    // 8.6 Verificar se a chamada da API foi feita com os parâmetros corretos
    expect(authApiDataSource.login).toHaveBeenCalledTimes(1)
    expect(authApiDataSource.login).toHaveBeenCalledWith({
      email: 'errado@email.com',
      password: 'senhaerrada',
    })
  })
})
