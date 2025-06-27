import { test, expect } from "@playwright/test";

test.describe('Login Page TestScript', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto('https://prod.testrunz.com/');
    await page.waitForLoadState("networkidle");

  });

  test('Check content', async ({ page }) => {
  await expect(page.getByText('Log in to your Test Runs account')).toBeVisible();
  await expect(page.getByText('Welcome to')).toBeVisible();
  await expect(page.locator('.test-runz')).toHaveText('Test Runs');

  // Social login section
  await expect(page.getByText('Sign In via')).toBeVisible();

  // Google Sign-In
  const googleBtn = page.getByRole('button', { name: /Sign In with Google/i });
  await expect(googleBtn).toBeVisible();

  const [googlePopup] = await Promise.all([
    page.waitForEvent('popup', { timeout: 10000 }),
    googleBtn.click(),
  ]);

  await googlePopup.waitForLoadState('load');
  await expect(googlePopup).toHaveURL(/providerId=google\.com/); 
  await googlePopup.close();

  // Microsoft Sign-In
  const msBtn = page.getByRole('button', { name: /Sign In with Microsoft/i });
  await expect(msBtn).toBeVisible();

  const [msPopup] = await Promise.all([
    page.waitForEvent('popup', { timeout: 10000 }),
    msBtn.click(),
  ]);
  await msPopup.waitForLoadState('load');
  await expect(msPopup).toHaveURL(/providerId=microsoft\.com/); 
  await msPopup.close();

    await expect(page.getByRole('link', { name: 'Help' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.getByText(/version/i)).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'E-mail' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Remember me' })).toBeVisible();


  });

  test('Empty login form validation messages', async ({ page }) => {
    await page.getByRole('button', { name: 'Log In' }).click(); 
    await page.getByText('Email is required');
    await page.getByText('Password is required');

  });

test('Navigate from login to signup page', async ({ page }) => {
await page.getByText('Click here to Sign up!').click();   
await expect(page).toHaveURL('https://prod.testrunz.com/signup/');
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
  await page.getByRole('textbox', { name: 'E-mail' }).fill('mixergrinder445@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test@123');
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForLoadState('networkidle');
  console.log('Current URL after login:', await page.url());
await page.goto('http://prod.testrunz.com/mypage/');});
});