import { test, expect } from '@playwright/test';

test('[COPS-941] Zephyr POC', async ({ page }) => {
    await page.goto('https://www.google.com');

});
