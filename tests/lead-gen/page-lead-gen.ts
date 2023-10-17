import { expect, Page } from '@playwright/test';

export async function createLeadPage(page: Page, name: string) {
    await page.locator('.add-page-button').click();
    await page.locator('.form-control').fill(name);
    await page.locator('.btn-save').click();
}
  
export async function addNewLead(page: Page, lead: LeadUser) {
    await page.locator('#firstName').fill(lead.first_name);
    await page.locator('#lastName').fill(lead.last_name);
    await page.locator('#phoneNumber').fill(lead.phone_number);
    await page.locator('#email').fill(lead.email);
    await page.locator('.sc-form-field__button').click();
    expect(page.locator('.sc-lead-submission-form .submitted')).toBeTruthy();
}
