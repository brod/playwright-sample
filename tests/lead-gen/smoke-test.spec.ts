import { test, expect } from '@playwright/test';
import { loginAsUser } from '../login/page-login';
import { createLeadPage, addNewLead } from '../lead-gen/page-lead-gen';
import { TestData } from '../../testdata';
import { v4 as uuidv4 } from 'uuid';
import * as faker from 'faker';

const leadPageUrl = `${TestData.baseUrl}/dashboards/lead-pages`
let testLeadName = `automated${uuidv4()}`

const lead: LeadUser = {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  phone_number: faker.phone.phoneNumber('###-###-####'),
  email: faker.internet.email()
}

let page, pageUrl
test.use({ launchOptions: { slowMo: 1000 } })

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(leadPageUrl);
  await loginAsUser(page, TestData.username, TestData.password);
});

test.describe('Lead Generation - Smoke Test', () => {
  test('create lead page should take user to template builder', async () => {
    await createLeadPage(page, testLeadName);
       // Test Template Builder contains sidebar
       expect(await page.locator('.sidebar-title-text > text=Select Your Template')).toBeTruthy();

       expect(await page.locator(`.select-template-option > text=Simple`)).toBeTruthy();
       expect(await page.locator(`.select-template-option > text=Modern`)).toBeTruthy();
       
       await page.locator('.select-template-option').first().click();
   
       // Test Select first template
       await page.locator('#save-and-exit-button').click();
   
       // Test Tab should exist
       await expect(await page.locator('#sidebar-primary-tabs > li')).toHaveCount(3);
   
       // Test Content should have all sidebar contents
       const sideBarItems = [
         'Section',
         'Headline',
         'Text',
         'Divider',
         'Bullet',
         'Button',
         'Image',
         'Video',
         'Icon',
         'Progress Bar',
         'Countdown',
         'Guarantee',
         'Testimonial',
         'FAQ',
         'Tabs',
         'Media Grid',
         'Custom HTML',
       ]
   
       sideBarItems.forEach(async (item) => {
         expect(await page.locator(`.sidebar-content > .sidebar-items > text=${item}`)).toBeTruthy()
       })

       // Test Collections should have all sidebar contents
       await page.locator('//button[text()="Collections"]').click();

       const collectionSection = [
         'header area',
         'feature area',
         'call to action',
         'guarantees'
       ];
       
       collectionSection.forEach(async (collection) => {
        await page.locator(`#collectionList >> .collection-title >> text=${collection}`).click();
        test.slow();
        await page.locator('.sidebar-title-back:visible').first().click();
       })
   
       // Test Settings should have all sidebar contents
       await page.locator('//button[text()="Settings"]').click();
       await page.locator('#collectionList >> text=Fonts').click();
       await page.locator('.sidebar-title-back:visible').first().click();
   
       // Test created lead page added to lead page list
       await page.locator('#save-and-exit-button').click();
  });

  test('edit lead page', async () => {
    await page.locator('.nav-item >> text=Pages').click();
    await page.locator('.search-settings-text').type(testLeadName);
    const pageList = await page.locator('.page-name').allTextContents();
    expect(pageList).toContain(testLeadName);

    // Test user able to go to edit lead page
    await page.locator(`text=${testLeadName}`).click();
    expect(await page.locator('data-testid=save-lead-page-changes')).toBeTruthy();

    // Test clicking Page Settings
    await page.locator('//a[text()="Page Settings"]').click()
    expect(await page.locator('.general-settings-pane .section-heading').first().textContent()).toContain('Page Details');

    // Test clicking Collected Leads
    await page.locator('//a[text()="Collected Leads"]').click()
    expect(await page.locator('.collected-leads-pane')).toBeTruthy();

    // Test clicking Email Delivery
    await page.locator('//a[text()="Email Delivery"]').click()
    expect(await page.locator('.general-settings-pane .section-heading h2').first().textContent()).toContain('Send Email to Leads');

    // Test clicking Integrations
    await page.locator('//a[text()="Integrations"]').click()
    expect(await page.locator('.integration-settings-pane')).toBeTruthy();
  });

  test('successfully edit lead name', async () => {
    // Test changing existing lead name 
    testLeadName = `Edited ${testLeadName}`;
    await page.locator('.edit-page-headline > button').click();
    
    await page.locator('.editable-text-input').fill(testLeadName)
    await page.locator('.icon-button.checkmark-icon').click();
    await page.locator('data-testid=save-lead-page-changes').click();
    expect(await page.locator('.samcart-alert-title').textContent()).toContain('Saved Changes');
  });

  test.describe('Collected leads', async () => {
    test('succesfully submit a lead', async() => {
      await page.locator('//a[text()="Page Settings"]').click()
      pageUrl = await page.locator('#copy-page-url').inputValue();
      await page.goto(pageUrl);
      test.slow()
      await addNewLead(page, lead)
    });

    test('lead successfully display in collected leads page', async () => {
      await page.goto(leadPageUrl);
      await page.locator('.nav-item >> text=Pages').click();
      await page.locator('.search-settings-text').type(testLeadName);

      // Test user able to go to edit lead page
      await page.locator(`text=${testLeadName}`).click();
      await page.locator('//a[text()="Collected Leads"]').click()

      const addedLead = await page.locator('.tables-content-footer').innerText();
      expect(addedLead).toContain(lead.email);
      expect(addedLead).toContain(lead.first_name);
      expect(addedLead).toContain(lead.last_name);
      expect(addedLead).toContain(lead.phone_number);
    });
  });
});

