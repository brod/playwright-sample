import { Page } from '@playwright/test';

const enum locators {
  emailField = '#email',
  passwordField = '#password',
  loginButton = '.login__btn',
}

export async function loginAsUser(page: Page, user: string, password: string) {
    await page.locator(locators.emailField).fill(user);
    await page.locator(locators.passwordField).fill(password);
    await page.locator(locators.loginButton).click();
}
  