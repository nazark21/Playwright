import { test, expect } from "@playwright/test";
import { takeScreenshot, takeScreenshotAroundAction, takeElementScreenshot } from "./utils/screenshot-helper.js";

test.describe("SignUp Page TestScript ", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
    await page.goto("https://prod.testrunz.com/signup");
    await page.waitForLoadState("networkidle");
    
    // Take screenshot of initial page load
    await takeScreenshot(page, 'page_loaded', testInfo.title);
  });

  test("Check Static contents and Sign up via Functionality", async ({ page }, testInfo) => {
    // Screenshot: Initial page state
    await takeScreenshot(page, 'initial_state', testInfo.title);
    
    await expect(
      page.getByText("Sign up for a free Test Runs account")
    ).toBeVisible();
    await expect(page.getByText("Welcome to")).toBeVisible();
    await expect(page.locator(".test-runz")).toHaveText("Test Runs");
    await takeScreenshot(page, 'header_content_verified', testInfo.title);

    // Sign up via Google
    await expect(page.getByText("Sign up via")).toBeVisible();
    const googleBtn = page.getByRole("button", {
      name: /Sign up with Google/i,
    });
    await expect(googleBtn).toBeVisible();
    await takeElementScreenshot(page, googleBtn, 'google_signup_button', testInfo.title);

    await takeScreenshotAroundAction(page, 'google_popup_open', testInfo.title, async () => {
      const [googlePopup] = await Promise.all([
        page.waitForEvent("popup", { timeout: 10000 }),
        googleBtn.click(),
      ]);

      await expect(googlePopup).toHaveURL(/providerId=google\.com/);
      
      // Take screenshot of Google popup
      await googlePopup.screenshot({ path: `screenshots/${testInfo.title}_google_popup.png` });
      await googlePopup.close();
    });
    
    // Sign up via Microsoft
    const msBtn = page.getByRole("button", { name: /Sign up with Microsoft/i });
    await expect(msBtn).toBeVisible();
    await takeElementScreenshot(page, msBtn, 'microsoft_signup_button', testInfo.title);

    await takeScreenshotAroundAction(page, 'microsoft_popup_open', testInfo.title, async () => {
      const [msPopup] = await Promise.all([
        page.waitForEvent("popup", { timeout: 10000 }),
        msBtn.click(),
      ]);
      await expect(msPopup).toHaveURL(/providerId=microsoft.com/);
      
      // Take screenshot of Microsoft popup
      await msPopup.screenshot({ path: `screenshots/${testInfo.title}_microsoft_popup.png` });
      await msPopup.close();
    });

    // Footer links
    await expect(page.getByRole("link", { name: "Help" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Terms" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Privacy" })).toBeVisible();
    await takeScreenshot(page, 'footer_links_verified', testInfo.title);
    
    // Form fields
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
    await takeScreenshot(page, 'form_fields_verified', testInfo.title);
  });

  test("Empty Sign-Up form validation messages", async ({ page }, testInfo) => {
    // Screenshot: Form before validation
    await takeScreenshot(page, 'form_before_validation', testInfo.title);
    
    const blurTextbox = async (label, options = {}) => {
      const input = page.getByRole("textbox", { name: label, ...options });
      await input.click();
      await input.press("Tab");
    };

    //Textbox labels
    await blurTextbox("First name");
    await takeScreenshot(page, 'after_firstname_blur', testInfo.title);
    
    await blurTextbox("Last name");
    await takeScreenshot(page, 'after_lastname_blur', testInfo.title);
    
    await blurTextbox("E-mail");
    await takeScreenshot(page, 'after_email_blur', testInfo.title);
    
    await blurTextbox("Password", { exact: true });
    await takeScreenshot(page, 'after_password_blur', testInfo.title);
    
    await blurTextbox("Confirm Password");
    await takeScreenshot(page, 'after_confirm_password_blur', testInfo.title);

    //Validation messages
    await expect(page.getByText("First name is required")).toBeVisible();
    await expect(page.getByText("Last name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(
      page.getByText("Password is required", { exact: true })
    ).toBeVisible();
    await expect(page.getByText("Confirm password is required")).toBeVisible();
    await takeScreenshot(page, 'all_validation_messages_displayed', testInfo.title);
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

test("SignUp with random valid credentials and see success toast + redirect", async ({ page }, testInfo) => {
  const { firstName, lastName, email, password } = generateValidUser();

  // Screenshot: Form before filling
  await takeScreenshot(page, 'form_before_filling_valid_data', testInfo.title);

  const fillAndBlur = async (name, value) => {
    const field = page.locator(`input[name="${name}"]`);
    await field.click();
    await field.fill(value);
    await field.press("Tab");
  };

  // Fill form with valid data
  await takeScreenshotAroundAction(page, 'fill_firstname', testInfo.title, async () => {
    await fillAndBlur("firstName", firstName);
  });
  
  await takeScreenshotAroundAction(page, 'fill_lastname', testInfo.title, async () => {
    await fillAndBlur("lastName", lastName);
  });
  
  await takeScreenshotAroundAction(page, 'fill_email', testInfo.title, async () => {
    await fillAndBlur("email", email);
  });
  
  await takeScreenshotAroundAction(page, 'fill_password', testInfo.title, async () => {
    await fillAndBlur("password", password);
  });
  
  await takeScreenshotAroundAction(page, 'fill_confirm_password', testInfo.title, async () => {
    await fillAndBlur("confirm_password", password);
  });

  const rememberMe = page.locator('input[type="checkbox"][value="remember"]');
  const terms = page.locator('input[name="termsAndConditions"]');

  await takeScreenshotAroundAction(page, 'check_remember_me', testInfo.title, async () => {
    if (!(await rememberMe.isChecked())) {
      await rememberMe.click();
    }
  });

  await takeScreenshotAroundAction(page, 'check_terms', testInfo.title, async () => {
    if (!(await terms.isChecked())) {
      await terms.click();
    }
  });

  await page.waitForTimeout(1000);
  await takeScreenshot(page, 'form_completed_before_submit', testInfo.title);

  const signUpButton = page.getByRole("button", { name: /signup for free/i });
  await expect(signUpButton).toBeEnabled({ timeout: 5000 });
  
  await takeScreenshotAroundAction(page, 'click_signup_button', testInfo.title, async () => {
    await signUpButton.click();
  });

  // ✅ Expect success toast
  const successToast = page.locator("text=Welcome to Testruns! You've signed up successfully! Please verify your email.");
  await expect(successToast).toBeVisible({ timeout: 15000 });
  await takeScreenshot(page, 'success_toast_displayed', testInfo.title);

  // ✅ Expect redirect to /mypage
  await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  await takeScreenshot(page, 'redirected_to_login_page', testInfo.title);

  console.log(`🟢 Test passed for user: ${email}`);
  });

  test("SignIn with already existing user credentials shows error toast", async ({
    page,
  }, testInfo) => {
    // Screenshot: Form before filling
    await takeScreenshot(page, 'form_before_filling_existing_user', testInfo.title);
    
    // Helper to fill and blur input fields
    const fillAndBlur = async (name, value) => {
      const field = page.locator(`input[name="${name}"]`);
      await field.click();
      await field.fill(value, { timeout: 3000 });
      await field.press("Tab");
    };

    // Fill out form fields
    await takeScreenshotAroundAction(page, 'fill_existing_firstname', testInfo.title, async () => {
      await fillAndBlur("firstName", "Mixer");
    });
    
    await takeScreenshotAroundAction(page, 'fill_existing_lastname', testInfo.title, async () => {
      await fillAndBlur("lastName", "Grinder");
    });
    
    await takeScreenshotAroundAction(page, 'fill_existing_email', testInfo.title, async () => {
      await fillAndBlur("email", "mixergrinder445@gmail.com");
    });
    
    await takeScreenshotAroundAction(page, 'fill_existing_password', testInfo.title, async () => {
      await fillAndBlur("password", "Test@123");
    });
    
    await takeScreenshotAroundAction(page, 'fill_existing_confirm_password', testInfo.title, async () => {
      await fillAndBlur("confirm_password", "Test@123");
    });

    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'form_filled_with_existing_user', testInfo.title);

    const rememberMe = page.locator('input[type="checkbox"][value="remember"]');
    const terms = page.locator('input[name="termsAndConditions"]');

    await takeScreenshotAroundAction(page, 'check_remember_me_existing', testInfo.title, async () => {
      if (!(await rememberMe.isChecked())) {
        await rememberMe.click();
      }
    });

    await takeScreenshotAroundAction(page, 'check_terms_existing', testInfo.title, async () => {
      if (!(await terms.isChecked())) {
        await terms.click();
      }
    });
    
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'form_completed_existing_user', testInfo.title);
    
    const signUpButton = page.getByRole("button", { name: /signup for free/i });

    if (await signUpButton.isEnabled()) {
      await takeScreenshotAroundAction(page, 'submit_existing_user', testInfo.title, async () => {
        await signUpButton.click();
      });

      const toast = page.locator("text=Email already Exists!");
      await expect(toast).toBeVisible({ timeout: 5000 });
      await takeScreenshot(page, 'email_exists_error_toast', testInfo.title);
    } else {
      await page.screenshot({ path: "signup-debug.png", fullPage: true });
      throw new Error(
        "Sign-up button was never enabled. Validation may have failed."
      );
    }
  });

  test("Navigate from login to signup page", async ({ page }, testInfo) => {
    // Screenshot: Signup page before navigation
    await takeScreenshot(page, 'signup_page_before_navigation', testInfo.title);
    
    await takeScreenshotAroundAction(page, 'click_login_link', testInfo.title, async () => {
      await page.getByText("Click here to log in.").click();
    });
    
    await expect(page).toHaveURL("https://prod.testrunz.com/login/");
    await takeScreenshot(page, 'login_page_loaded', testInfo.title);
  });
  
});
