import { test, expect } from "@playwright/test";
import { takeScreenshot, takeScreenshotAroundAction, takeElementScreenshot } from "./utils/screenshot-helper.js";

test.describe('Forgot Password Page Validation', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        console.log(`Running ${testInfo.title}`);
        await page.goto('https://prod.testrunz.com/forgot-password/');
        await page.waitForLoadState('domcontentloaded');
        
        // Take screenshot of initial page load
        await takeScreenshot(page, 'page_loaded', testInfo.title);
    });

    test('Check Page Contents', async ({ page }, testInfo) => {
        // Screenshot: Initial page state
        await takeScreenshot(page, 'initial_state', testInfo.title);
        
        await expect(page.getByText('Forgot Password')).toBeVisible();
        await takeScreenshot(page, 'forgot_password_header', testInfo.title);
        
        await expect(page.getByRole('heading', { name: "Don't worry we got you" })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Covered' })).toBeVisible();
        await takeScreenshot(page, 'sub_headers_verified', testInfo.title);
        
        await expect(page.getByRole('link', { name: 'Help' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
        await takeScreenshot(page, 'footer_links_verified', testInfo.title);
        
        await expect(page.getByText('We will send you an reset link on your registered email-ID.')).toBeVisible();
        await takeScreenshot(page, 'description_text_verified', testInfo.title);
    });

    test('Check Page Input Fields and Buttons', async ({ page }, testInfo) => {
        // Screenshot: Form elements
        await takeScreenshot(page, 'form_elements_overview', testInfo.title);
        
        await expect(page.getByText('Registered email-id', { exact: true })).toBeVisible();
        await expect(page.getByText('Enter captcha', { exact: true })).toBeVisible();
        await takeScreenshot(page, 'form_labels_verified', testInfo.title);
        
        const emailInput = page.getByPlaceholder('E-Mail');
        const captchaInput = page.getByPlaceholder('Captcha');
        const nextButton = page.getByRole('button', { name: 'Next' });
        
        await expect(emailInput).toBeVisible();
        await expect(captchaInput).toBeVisible();
        await expect(nextButton).toBeVisible();
        
        // Take screenshots of individual elements
        await takeElementScreenshot(page, emailInput, 'email_input_field', testInfo.title);
        await takeElementScreenshot(page, captchaInput, 'captcha_input_field', testInfo.title);
        await takeElementScreenshot(page, nextButton, 'next_button', testInfo.title);
        
        await takeScreenshot(page, 'all_form_elements_verified', testInfo.title);
    });

    test('Forget Password Verification', async ({ page }, testInfo) => {
        // Screenshot: Form before clicking Next
        await takeScreenshot(page, 'form_before_validation', testInfo.title);
        
        await takeScreenshotAroundAction(page, 'click_next_button', testInfo.title, async () => {
            await page.getByRole('button', { name: 'Next' }).click();
        });
        
        await page.getByText('Email is required');
        await page.getByText('Captcha is not required');
        await takeScreenshot(page, 'validation_messages_displayed', testInfo.title);
    });
});


