import { test, expect } from "@playwright/test";

test.describe('Forgot Password Page Validation', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Running ${testInfo.title}`);
        await page.goto('https://prod.testrunz.com/forgot-password/');
        await page.waitForLoadState('domcontentloaded');
    });

    test('Check Page Contents', async ({ page }) => {
        await expect(page.getByText('Forgot Password')).toBeVisible();
        await expect(page.getByRole('heading', { name: "Don't worry we got you" })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Covered' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Help' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
        await expect(page.getByText('We will send you an reset link on your registered email-ID.')).toBeVisible();
    });

    test('Check Page Input Fields and Buttons', async ({ page }) => {
        await expect(page.getByText('Registered email-id', { exact: true })).toBeVisible();
        await expect(page.getByText('Enter captcha', { exact: true })).toBeVisible();
        await expect(page.getByPlaceholder('E-Mail')).toBeVisible();
        await expect(page.getByPlaceholder('Captcha')).toBeVisible();
       await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    });

    test('Forget Password Verification', async ({ page }) => {
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByText('Email is required');
        await page.getByText('Captcha is not required');
    });

});


