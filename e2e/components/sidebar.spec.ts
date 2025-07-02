import { test, expect } from '@playwright/test'

// Teste E2E para a sidebar

test.describe('Sidebar E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Realiza login antes de cada teste
    await page.goto('/login')
    await page.locator('#email').fill('usuario@email.com')
    await page.locator('#password').fill('123456')
    await page.locator('#btn-submit').click()
    // Aguarda redirecionamento para a home e presença de elemento característico
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toHaveText(/home page/i)
  })

  test('deve abrir e fechar a sidebar no mobile', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 })
    // Após login, já está em /, não precisa navegar de novo
    // Sidebar deve estar oculta
    await expect(page.locator('aside[role="complementary"]')).toBeHidden()
    // Abre a sidebar
    await page.getByLabel('Abrir menu').click()
    await expect(page.locator('aside[role="complementary"]')).toBeVisible()
    // Fecha a sidebar
    await page.getByLabel('Fechar menu').click()
    await expect(page.locator('aside[role="complementary"]')).toBeHidden()
  })

  test('deve manter a sidebar visível no desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 })
    // Após login, já está em /, não precisa navegar de novo
    await expect(page.locator('aside[role="complementary"]')).toBeVisible()
  })

  test('deve renderizar os links do menu', async ({ page }) => {
    // Após login, já está em /, não precisa navegar de novo
    const sidebar = page.locator('aside[role="complementary"]')
    await expect(sidebar.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Usuários' })).toBeVisible()
  })

  test('deve exibir título, links e rodapé corretamente na sidebar (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 900 })
    // Sidebar deve estar oculta inicialmente
    await expect(page.locator('aside[role="complementary"]')).toBeHidden()
    // Abre a sidebar
    await page.getByLabel('Abrir menu').click()
    const sidebar = page.locator('aside[role="complementary"]')
    await expect(sidebar).toBeVisible()
    // Título
    await expect(sidebar.locator('div.text-2xl.font-bold')).toHaveText('Gestão de Ensino')
    // Links
    await expect(sidebar.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Usuários' })).toBeVisible()
    // Rodapé
    await expect(sidebar.getByAltText('User avatar')).toBeVisible()
    await expect(sidebar.locator('p.text-sm.font-medium')).toHaveText('Aluno João')
    await expect(sidebar.getByRole('link', { name: 'Configurações' })).toBeVisible()
    // Fecha a sidebar
    await page.getByLabel('Fechar menu').click()
    await expect(sidebar).toBeHidden()
  })

  test('deve exibir título, links e rodapé corretamente na sidebar (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 })
    const sidebar = page.locator('aside[role="complementary"]')
    await expect(sidebar).toBeVisible()
    // Título
    await expect(sidebar.locator('div.text-2xl.font-bold')).toHaveText('Gestão de Ensino')
    // Links
    await expect(sidebar.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Usuários' })).toBeVisible()
    // Rodapé
    await expect(sidebar.getByAltText('User avatar')).toBeVisible()
    await expect(sidebar.locator('p.text-sm.font-medium')).toHaveText('Aluno João')
    await expect(sidebar.getByRole('link', { name: 'Configurações' })).toBeVisible()
  })
})
