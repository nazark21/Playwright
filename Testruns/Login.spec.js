import { test, expect } from "@playwright/test";

test.describe('Login Validation', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('https://prod.testrunz.com/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Check content', async ({ page }) => {
    await expect(page.getByText('Log in to your Test Runs account')).toBeVisible();
    await expect(page.getByText('Welcome to')).toBeVisible();
    await expect(page.locator('.test-runz')).toHaveText('Test Runs');
    await expect(page.getByText('Sign In via')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Help' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.getByText(/version/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'E-mail' })).toBeVisible();
  });

  test('Empty login form validation messages', async ({ page }) => {
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.getByText('Email is required');
    await page.getByText('Password is required');

  });

  test('Navigation from Login Page to Signup Page', async ({ page }) => {
    await page.locator('text=Click here to Sign up!').click();
    console.log("\nStatus: Sign Up Button Clicked \n")
  });


  test('Login with invalid password', async ({ page }) => {
    await page.fill('#email', 'mixergrinder445@gmail.com');
    await page.fill('#password', 'Test@23');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByText('Invalid credential');
  });

  test('Login with invalid emailID', async ({ page }) => {
    await page.fill('#email', 'mixergrinder45@gmail.com');
    await page.fill('#password', 'Test@123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByText('Invalid credential');
  });

  test('Login with correct credentials', async ({ page }) => {
    await page.goto('https://prod.testrunz.com/');

    await page.getByRole('textbox', { name: 'E-mail' }).fill('mixergrinder445@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test@123');
    await page.getByRole('button', { name: /log in/i }).click();
    await page.waitForLoadState('networkidle');

    console.log('Current URL after login:', await page.url());
    await page.goto('http://prod.testrunz.com/mypage/');
  });
});
