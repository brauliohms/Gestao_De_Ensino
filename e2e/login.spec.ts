import { expect, test } from '@playwright/test'

test('faz login com credenciais válidas e redireciona para a home', async ({ page }) => {
  await page.goto('/login')

  // Preenche o email e senha
  await page.locator('#email').fill('usuario@email.com')
  await page.locator('#password').fill('123456')

  // Clica no botão "Entrar"
  await page.locator('#btn-submit').click()

  // Em vez de esperar por um 'dialog', esperamos que a URL mude para a da home
  // ou que um elemento específico da home apareça.
  await expect(page).toHaveURL('/')
  await expect(page.locator('h1')).toHaveText('Home Page')
})

test('mostra erro no toast com credenciais inválidas', async ({ page }) => {
  await page.goto('/login')

  await page.locator('#email').fill('errado@email.com')
  await page.locator('#password').fill('senhaerrada')

  await page.locator('#btn-submit').click()

  // Esperamos que o elemento do toast de erro apareça e tenha o texto correto.
  const errorToast = page.locator('.Vue-Toastification__toast--error')
  await expect(errorToast).toBeVisible()
  const msg = await errorToast.textContent()
  expect(msg).toContain('E-mail ou senha inválidos') // Verifica se a mensagem de erro está correta

  // Verifica que a página não redirecionou
  await expect(page).toHaveURL('/login')
})
