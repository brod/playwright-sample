import { test, expect } from '@playwright/test';
import { loginAsUser } from '../login/page-login';
import { createLeadPage } from './page-lead-gen';
import { TestData } from '../../testdata';

const leadPageUrl = `${TestData.baseUrl}/dashboards/lead-pages`
const testLeadName = `automated_duplicate`

let page, pageUrl

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(leadPageUrl);
  await loginAsUser(page, TestData.username, TestData.password);
});

test.describe('Lead Generation - Create Leads', () => {
  test('create lead page', async () => {
    await createLeadPage(page, testLeadName);
    await page.locator('.select-template-option').first().click();
    await page.locator('#save-and-exit-button').click();
    await page.locator('#save-and-exit-button').click();

    pageUrl = await page.locator('#copy-page-url').inputValue();
    expect(pageUrl).toContain(leadPageUrl)
  });
});