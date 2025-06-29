import { expect, test } from '@playwright/test'

test('acessa a home page', async ({ page }) => {
  await page.goto('/')
  // await expect(page.locator('h1')).toHaveText('Home Page')
  await expect(page).toHaveURL('/login') // Verifica que não é a Home Page e continua no Login
})
