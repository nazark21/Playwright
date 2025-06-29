import { test, expect } from "@playwright/test";
import { takeScreenshot, takeScreenshotAroundAction, takeElementScreenshot } from "./utils/screenshot-helper.js";

test.describe('Login Page TestScript', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('https://prod.testrunz.com/');
    await page.waitForLoadState("networkidle");
    
    // Take screenshot of initial page load
    await takeScreenshot(page, 'page_loaded', testInfo.title);
  });

  test('Check content', async ({ page }, testInfo) => {
    // Screenshot: Initial page state
    await takeScreenshot(page, 'initial_state', testInfo.title);
    
    // Check main content
    await expect(page.getByText('Log in to your Test Runs account')).toBeVisible();
    await takeScreenshot(page, 'main_content_verified', testInfo.title);
    
    await expect(page.getByText('Welcome to')).toBeVisible();
    await expect(page.locator('.test-runz')).toHaveText('Test Runs');
    await takeScreenshot(page, 'header_content_verified', testInfo.title);

    // Social login section
    await expect(page.getByText('Sign In via')).toBeVisible();
    await takeScreenshot(page, 'social_login_section', testInfo.title);

    // Google Sign-In
    const googleBtn = page.getByRole('button', { name: /Sign In with Google/i });
    await expect(googleBtn).toBeVisible();
    await takeElementScreenshot(page, googleBtn, 'google_button', testInfo.title);

    await takeScreenshotAroundAction(page, 'google_popup_open', testInfo.title, async () => {
      const [googlePopup] = await Promise.all([
        page.waitForEvent('popup', { timeout: 10000 }),
        googleBtn.click(),
      ]);

      await googlePopup.waitForLoadState('load');
      await expect(googlePopup).toHaveURL(/providerId=google\.com/);
      
      // Take screenshot of Google popup
      await googlePopup.screenshot({ path: `screenshots/${testInfo.title}_google_popup.png` });
      await googlePopup.close();
    });

    // Microsoft Sign-In
    const msBtn = page.getByRole('button', { name: /Sign In with Microsoft/i });
    await expect(msBtn).toBeVisible();
    await takeElementScreenshot(page, msBtn, 'microsoft_button', testInfo.title);

    await takeScreenshotAroundAction(page, 'microsoft_popup_open', testInfo.title, async () => {
      const [msPopup] = await Promise.all([
        page.waitForEvent('popup', { timeout: 10000 }),
        msBtn.click(),
      ]);
      await msPopup.waitForLoadState('load');
      await expect(msPopup).toHaveURL(/providerId=microsoft\.com/);
      
      // Take screenshot of Microsoft popup
      await msPopup.screenshot({ path: `screenshots/${testInfo.title}_microsoft_popup.png` });
      await msPopup.close();
    });

    // Footer links
    await expect(page.getByRole('link', { name: 'Help' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await takeScreenshot(page, 'footer_links_verified', testInfo.title);
    
    await expect(page.getByText(/version/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'E-mail' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeVisible();
    await takeScreenshot(page, 'form_fields_verified', testInfo.title);
  });

  test('Empty login form validation messages', async ({ page }, testInfo) => {
    // Screenshot: Form before clicking login
    await takeScreenshot(page, 'form_before_validation', testInfo.title);
    
    await takeScreenshotAroundAction(page, 'click_login_button', testInfo.title, async () => {
      await page.getByRole('button', { name: 'Log In' }).click();
    });
    
    await page.getByText('Email is required');
    await page.getByText('Password is required');
    await takeScreenshot(page, 'validation_messages_displayed', testInfo.title);
  });

  test('Navigate from login to signup page', async ({ page }, testInfo) => {
    // Screenshot: Login page before navigation
    await takeScreenshot(page, 'login_page_before_navigation', testInfo.title);
    
    await takeScreenshotAroundAction(page, 'click_signup_link', testInfo.title, async () => {
      await page.getByText('Click here to Sign up!').click();
    });
    
    await expect(page).toHaveURL('https://prod.testrunz.com/signup/');
    await takeScreenshot(page, 'signup_page_loaded', testInfo.title);
  });

  test('Login with invalid password', async ({ page }, testInfo) => {
    // Screenshot: Form before filling
    await takeScreenshot(page, 'form_before_invalid_password', testInfo.title);
    
    await takeScreenshotAroundAction(page, 'fill_invalid_password', testInfo.title, async () => {
      await page.fill('#email', 'mixergrinder445@gmail.com');
      await page.fill('#password', 'Test@23');
    });
    
    await takeScreenshotAroundAction(page, 'submit_invalid_password', testInfo.title, async () => {
      await page.getByRole('button', { name: 'Log in' }).click();
    });
    
    await page.getByText('Invalid credential');
    await takeScreenshot(page, 'invalid_password_error', testInfo.title);
  });

  test('Login with invalid emailID', async ({ page }, testInfo) => {
    // Screenshot: Form before filling
    await takeScreenshot(page, 'form_before_invalid_email', testInfo.title);
    
    await takeScreenshotAroundAction(page, 'fill_invalid_email', testInfo.title, async () => {
      await page.fill('#email', 'mixergrinder45@gmail.com');
      await page.fill('#password', 'Test@123');
    });
    
    await takeScreenshotAroundAction(page, 'submit_invalid_email', testInfo.title, async () => {
      await page.getByRole('button', { name: 'Log in' }).click();
    });
    
    await page.getByText('Invalid credential');
    await takeScreenshot(page, 'invalid_email_error', testInfo.title);
  });

  test('Login with correct credentials', async ({ page }, testInfo) => {
    // Screenshot: Form before filling correct credentials
    await takeScreenshot(page, 'form_before_correct_credentials', testInfo.title);
    
    await takeScreenshotAroundAction(page, 'fill_correct_credentials', testInfo.title, async () => {
      await page.getByRole('textbox', { name: 'E-mail' }).fill('mixergrinder445@gmail.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('Test@123');
    });
    
    await takeScreenshotAroundAction(page, 'submit_correct_credentials', testInfo.title, async () => {
      await page.getByRole('button', { name: /log in/i }).click();
    });
    
    await page.waitForLoadState('networkidle');
    console.log('Current URL after login:', await page.url());
    await takeScreenshot(page, 'after_successful_login', testInfo.title);
    
    await page.goto('http://prod.testrunz.com/mypage/');
    await takeScreenshot(page, 'mypage_loaded', testInfo.title);
  });
});