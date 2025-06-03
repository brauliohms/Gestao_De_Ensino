import { test, expect } from '@playwright/test'

test('faz login com credenciais válidas', async ({ page }) => {
  await page.goto('/login')

  // Preenche o email e senha
  await page.locator('#email').fill('usuario@email.com')
  await page.locator('#password').fill('123456')

  // Clica no botão "Entrar"
  await page.locator('#btn-submit').click()

  // Espera o alert com sucesso
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Autenticado com sucesso')
    await dialog.dismiss() // fecha o alert
  })
})

test('mostra erro com credenciais inválidas', async ({ page }) => {
  await page.goto('/login')

  await page.locator('#email').fill('errado@email.com')
  await page.locator('#password').fill('senhaerrada')

  await page.locator('#btn-submit').click()

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Usuário ou senha incorreto')
    await dialog.dismiss()
  })
})
