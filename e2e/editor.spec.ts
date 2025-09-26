import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

/*
* Playwright e2e tests that test the frontend with mocked backend requests
*/

test.beforeEach(async ({ page }) => {
  // This simply fakes the backend - it does not answer so far but its enough to let the frontend to be used inside tests
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  await page.routeWebSocket(/backend/, () => {});
  page.on('console', msg => console.log(msg.text()));
});

test('creates a document and changes the location', async ({ page }) => {
  const documentId = randomUUID()
  const modificationSecret = randomUUID()
  await page.route(/backend\/documents/, async route => {
    const json = {
      id: documentId,
      modificationSecret: modificationSecret,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date()
    }
    await route.fulfill({ json });
  });

  await page.goto('/');
  await page.getByText('New document').click()
  await page.waitForURL(`/document/${documentId}#${modificationSecret}`)
  await expect(page.locator('.tiptap')).toBeVisible()
});

test('loads the editor and inserts bold text', async ({page}) => {
  await page.goto(`/document/${randomUUID()}#${randomUUID()}`);
  await page.waitForSelector('.tiptap')
  await page.click('button.btn-editor[title="Bold"]')
  await page.locator('.tiptap').click()
  await page.locator('.tiptap').fill("test")
  await expect(page.locator('strong:has-text("test")')).toBeVisible()
})

test('loads the editor, inserts and moves a comment', async ({page}) => {
  await page.goto(`/document/${randomUUID()}#${randomUUID()}`);
  await page.waitForSelector('.tiptap')
  await page.locator('.tiptap').click()
  await page.locator('.tiptap').fill("test")
  await page.locator('.tiptap').selectText()
  await page.click('button.btn-editor[title="Comment"]')
  await page.locator('.comment-card textarea').fill("test comment")
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.locator('.comment-card-content div').filter({ hasText: /^test comment$/ }).first()).toBeVisible()
  const pos = await page.locator('.comment-card-content').boundingBox({ timeout: 500 })
  await page.locator('.tiptap').press('Home')
  await page.locator('.tiptap').press('Enter')
  const newPos = await page.locator('.comment-card-content', {}).boundingBox({ timeout: 500 })
  expect(newPos && pos && newPos?.y > pos?.y)
})

test('loads the editor, inserts and accepts a proposal', async ({page}) => {
  await page.goto(`/document/${randomUUID()}#${randomUUID()}`);
  await page.waitForSelector('.tiptap')
  await page.locator('.tiptap').click()
  await page.locator('.tiptap').fill("test")
  await page.locator('.tiptap').selectText()
  await page.click('button.btn-editor[title="Suggestion"]')
  await page.locator('.comment-card textarea').fill("something new")
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.locator('.comment-card-content div').filter({ hasText: /^something new$/ }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Accept proposal' }).click()
  await expect(page.locator('.tiptap p').filter({ hasText: /^something new$/ }).first()).toBeVisible()
  await expect(page.locator('.comment-card')).not.toBeVisible()
})

test('loads the editor, uploads and shows an image', async ({page}) => {
  const documentId = randomUUID()
  const modificationSecret = randomUUID()
  const imageId = randomUUID()

  const fakeImageFile = {
    name: 'test.jpg',
    mimeType: 'image/jpg',
    buffer: Buffer.from('Test image')
  };

  await page.route(/backend\/documents/, async route => {
    if(route.request().method() === 'POST') {
      const json = {
        imageUrl: `images/${imageId}`
      }
      await route.fulfill({ json });
    }
  });

  await page.route(/backend\/images/, async route => {
    await route.fulfill({body: Buffer.from('Test image')});
  });

  await page.goto(`/document/${documentId}#${modificationSecret}`);
  await page.waitForSelector('.tiptap')
  
  await page.setInputFiles('input[id="file-input-upload"]', fakeImageFile);
  await expect(page.locator(`.tiptap img[src*="${imageId}"]`)).toBeVisible()
})