import { test, expect } from '@playwright/test'

test('acessa a home page', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Home Page')
})
