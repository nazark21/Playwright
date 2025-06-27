import { test, expect } from "@playwright/test";

test.describe("SignUp Page TestScript ", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto("https://prod.testrunz.com/signup");
    await page.waitForLoadState("networkidle");
  });

  test("Check Static contents and Sign up via Functionality", async ({ page }) => {
    await expect(
      page.getByText("Sign up for a free Test Runs account")
    ).toBeVisible();
    await expect(page.getByText("Welcome to")).toBeVisible();
    await expect(page.locator(".test-runz")).toHaveText("Test Runs");

    // Sign up via Google
    await expect(page.getByText("Sign up via")).toBeVisible();
    const googleBtn = page.getByRole("button", {
      name: /Sign up with Google/i,
    });
    await expect(googleBtn).toBeVisible();

    const [googlePopup] = await Promise.all([
      page.waitForEvent("popup", { timeout: 10000 }),
      googleBtn.click(),
    ]);

    await expect(googlePopup).toHaveURL(/providerId=google\.com/);
    await googlePopup.close();
    // Sign up via Microsoft
    const msBtn = page.getByRole("button", { name: /Sign up with Microsoft/i });
    await expect(msBtn).toBeVisible();

    const [msPopup] = await Promise.all([
      page.waitForEvent("popup", { timeout: 10000 }),
      msBtn.click(),
    ]);
    await expect(msPopup).toHaveURL(/providerId=microsoft.com/);
    await msPopup.close();

    await expect(page.getByRole("link", { name: "Help" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Terms" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "First name" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Last name" })
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: "E-mail" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Password", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Confirm Password" })
    ).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "Remember me" })
    ).toBeVisible();
    await expect(
      page.getByRole("checkbox", {
        name: "I have read and understood and agree with terms of service and Privacy policy of Test Runs",
      })
    ).toBeVisible();
  });

  test("Empty Sign-Up form validation messages", async ({ page }) => {
    const blurTextbox = async (label, options = {}) => {
      const input = page.getByRole("textbox", { name: label, ...options });
      await input.click();
      await input.press("Tab");
    };

    //Textbox labels
    await blurTextbox("First name");
    await blurTextbox("Last name");
    await blurTextbox("E-mail");
    await blurTextbox("Password", { exact: true });
    await blurTextbox("Confirm Password");

    //Validation messages
    await expect(page.getByText("First name is required")).toBeVisible();
    await expect(page.getByText("Last name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(
      page.getByText("Password is required", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("Confirm password is required")).toBeVisible();
  });


const generateValidUser = () => {
  const randomString = (len = 6) =>
    Array.from({ length: len }, () =>
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ).join("");

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const firstName = capitalize(randomString());
  const lastName = capitalize(randomString());
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}+${Date.now()}@example.com`;

  // Valid password: uppercase, lowercase, number, special char, min 8 chars
  const password = `Aa1@${randomString(5)}`;

  return { firstName, lastName, email, password };
};

test("SignUp with random valid credentials and see success toast + redirect", async ({ page }) => {
  const { firstName, lastName, email, password } = generateValidUser();

  const fillAndBlur = async (name, value) => {
    const field = page.locator(`input[name="${name}"]`);
    await field.click();
    await field.fill(value);
    await field.press("Tab");
  };

  // Fill form with valid data
  await fillAndBlur("firstName", firstName);
  await fillAndBlur("lastName", lastName);
  await fillAndBlur("email", email);
  await fillAndBlur("password", password);
  await fillAndBlur("confirm_password", password);

  const rememberMe = page.locator('input[type="checkbox"][value="remember"]');
  const terms = page.locator('input[name="termsAndConditions"]');

  if (!(await rememberMe.isChecked())) {
    await rememberMe.click();
  }

  if (!(await terms.isChecked())) {
    await terms.click();
  }

  await page.waitForTimeout(1000);

  const signUpButton = page.getByRole("button", { name: /signup for free/i });
  await expect(signUpButton).toBeEnabled({ timeout: 5000 });
  await signUpButton.click();

  // ✅ Expect success toast
  const successToast = page.locator("text=Welcome to Testruns! You've signed up successfully! Please verify your email.");
  await expect(successToast).toBeVisible({ timeout: 15000 });

  // ✅ Expect redirect to /mypage
  await expect(page).toHaveURL(/\/login/, { timeout: 8000 });

  console.log(`🟢 Test passed for user: ${email}`);

  });

  test("SignIn with already existing user credentials shows error toast", async ({
    page,
  }) => {
    // Helper to fill and blur input fields
    const fillAndBlur = async (name, value) => {
      const field = page.locator(`input[name="${name}"]`);
      await field.click();
      await field.fill(value, { timeout: 3000 });
      await field.press("Tab");
    };

    // Fill out form fields
    await fillAndBlur("firstName", "Mixer");
    await fillAndBlur("lastName", "Grinder");
    await fillAndBlur("email", "mixergrinder445@gmail.com");
    await fillAndBlur("password", "Test@123");
    await fillAndBlur("confirm_password", "Test@123");

    await page.waitForTimeout(1000);

    const rememberMe = page.locator('input[type="checkbox"][value="remember"]');
    const terms = page.locator('input[name="termsAndConditions"]');

    if (!(await rememberMe.isChecked())) {
      await rememberMe.click();
    }

    if (!(await terms.isChecked())) {
      await terms.click();
    }
    await page.waitForTimeout(1000);
    const signUpButton = page.getByRole("button", { name: /signup for free/i });

    if (await signUpButton.isEnabled()) {
      await signUpButton.click();

      const toast = page.locator("text=Email already Exists!");
      await expect(toast).toBeVisible({ timeout: 5000 });
    } else {
      await page.screenshot({ path: "signup-debug.png", fullPage: true });
      throw new Error(
        "Sign-up button was never enabled. Validation may have failed."
      );
    }
  });

  test("Navigate from login to signup page", async ({ page }) => {
    await page.getByText("Click here to log in.").click();
    await expect(page).toHaveURL("https://prod.testrunz.com/login/");
  });
  
});
