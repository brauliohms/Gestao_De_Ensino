/**
 * Testes unitários do componente SideBar
 *
 * - Garante que os links do menu são renderizados corretamente.
 * - Testa abertura e fechamento da sidebar no mobile simulando clicks e verificando visibilidade via style.display.
 * - Testa se a sidebar permanece visível no desktop.
 * - Mocka a store de autenticação (Pinia) para simular usuário autenticado.
 *
 * Observação: Testes de navegação, integração e responsividade real devem ser feitos em e2e.
 */
import { mount } from '@vue/test-utils'
import SideBar from '@/components/SideBar.vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'
import { describe, it, beforeEach, expect } from 'vitest'
import { createPinia, setActivePinia, defineStore } from 'pinia'

// Mock da store de autenticação
const useAuthStore = defineStore('auth', {
  state: () => ({ isAuthenticated: true }),
  actions: { logout: () => {} },
})

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/usuarios', name: 'usuarios', component: { template: '<div>Usuários</div>' } },
  ],
})

describe('SideBar', () => {
  beforeEach(() => {
    // Ativa Pinia e simula usuário autenticado antes de cada teste
    setActivePinia(createPinia())
    useAuthStore()
    // Simula ambiente mobile antes de cada teste
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))
  })

  it('deve renderizar os links do menu', async () => {
    const wrapper = mount(SideBar, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Usuários')
  })

  it('deve abrir e fechar a sidebar no mobile (unitário)', async () => {
    const wrapper = mount(SideBar, {
      global: { plugins: [router] },
    })
    const aside = wrapper.find('[role="complementary"]')
    expect(aside.exists()).toBe(true)
    expect((aside.element as HTMLElement).style.display).toBe('none')
    await wrapper.find('button[aria-label="Abrir menu"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect((aside.element as HTMLElement).style.display).not.toBe('none')
    await wrapper.find('button[aria-label="Fechar menu"]').trigger('click')
    await wrapper.vm.$nextTick()
    expect((aside.element as HTMLElement).style.display).toBe('none')
  })

  it('deve manter a sidebar visível no desktop (unitário)', async () => {
    window.innerWidth = 1024
    window.dispatchEvent(new Event('resize'))
    const wrapper = mount(SideBar, {
      global: { plugins: [router] },
    })
    const aside = wrapper.find('[role="complementary"]')
    expect(aside.exists()).toBe(true)
    expect((aside.element as HTMLElement).style.display).not.toBe('none')
  })
})
