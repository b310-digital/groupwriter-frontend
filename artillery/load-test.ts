import { Page } from '@playwright/test';
 
export const config = {
  target: 'http://localhost:5173',
  engines: {
    playwright: {}
  },
  phases: [
    {
      name: 'start',
      duration: 30,
      arrivalCount: 100
    }
  ]
};
 
export const scenarios = [{
  engine: 'playwright',
  testFunction: openDoc
}];
 
async function openDoc(page: Page) {
  await page.goto('/document/A');
  await page.waitForSelector('.tiptap')
  await page.locator('.tiptap').fill("test")
}