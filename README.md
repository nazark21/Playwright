# Playwright Test Automation Suite

This project contains automated tests for the Test Runs application using Playwright. The test suite covers login, signup, and forgot password functionality with **comprehensive screenshot capture at every step**.

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

This will install the required browser binaries (Chromium, Firefox, WebKit).

## 🧪 Running Tests

### Run All Tests

```bash
npm run test
```

### Run Specific Test Files

```bash
# Run only login tests
npx playwright test Testruns/Login.spec.js

# Run only signup tests
npx playwright test Testruns/SignUp.spec.js

# Run only forgot password tests
npx playwright test Testruns/ForgetPassword.spec.js
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

This opens Playwright's interactive UI where you can:
- See test results in real-time
- Debug tests step by step
- View screenshots and traces
- Re-run failed tests

### Run Tests in Headed Mode (Visible Browser)

```bash
npx playwright test --headed
```

### Run Tests with Debug Mode

```bash
npx playwright test --debug
```

### Run Tests in Specific Browser

```bash
# Run in Chromium (default)
npx playwright test --project=chromium

# Run in Firefox
npx playwright test --project=firefox

# Run in WebKit (Safari)
npx playwright test --project=webkit
```

## 📸 Screenshot Features

### Automatic Screenshots

This test suite automatically captures screenshots at every step:

- **Page Load**: Screenshot when each page loads
- **Before/After Actions**: Screenshots before and after each user action
- **Element Screenshots**: Individual screenshots of important elements
- **Validation States**: Screenshots showing validation messages
- **Popup Windows**: Screenshots of social login popups
- **Error States**: Screenshots when errors occur

### Screenshot Locations

Screenshots are saved in the `screenshots/` directory with descriptive names:

```
screenshots/
├── Check_content_initial_state_2024-01-15T10-30-45-123Z.png
├── Check_content_main_content_verified_2024-01-15T10-30-46-456Z.png
├── Check_content_google_button_2024-01-15T10-30-47-789Z.png
└── ...
```

### Screenshot Naming Convention

- `{TestName}_{StepName}_{Timestamp}.png`
- Example: `Check_content_initial_state_2024-01-15T10-30-45-123Z.png`

### Viewing Screenshots

1. **After Test Run**: Check the `screenshots/` directory
2. **In HTML Report**: Screenshots are embedded in the HTML report
3. **Console Output**: Screenshot names are logged to console

### Screenshot Helper Functions

The project includes utility functions for taking screenshots:

- `takeScreenshot()` - Take a full page screenshot
- `takeScreenshotAroundAction()` - Take before/after screenshots of an action
- `takeElementScreenshot()` - Take screenshot of a specific element

## 📊 Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens a detailed HTML report with:
- Test results and status
- Screenshots for every step
- Video recordings
- Console logs
- Network traces

### Generate Report

```bash
npx playwright test --reporter=html
```

## 🧩 Test Structure

### Test Files

1. **`Testruns/Login.spec.js`** - Login page functionality tests
2. **`Testruns/SignUp.spec.js`** - Signup page functionality tests  
3. **`Testruns/ForgetPassword.spec.js`** - Forgot password page tests

### Test Categories

#### Login Tests (`Login.spec.js`)
- ✅ Content verification (headers, buttons, links)
- ✅ Social login (Google, Microsoft)
- ✅ Form validation (empty fields)
- ✅ Navigation to signup page
- ✅ Invalid credentials testing
- ✅ Successful login flow

#### Signup Tests (`SignUp.spec.js`)
- ✅ Content verification (headers, form fields)
- ✅ Social signup (Google, Microsoft)
- ✅ Form validation (empty fields, required validations)
- ✅ Random user registration with success flow
- ✅ Duplicate email handling
- ✅ Navigation to login page

#### Forgot Password Tests (`ForgetPassword.spec.js`)
- ✅ Page content verification
- ✅ Form field validation
- ✅ Required field validation

## ⚙️ Configuration

The project uses `playwright.config.js` with the following settings:

- **Test Directory**: `./Testruns`
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Reporter**: HTML
- **Browser**: Chromium (default)
- **Trace**: Enabled on retry
- **Screenshots**: Enabled on every action
- **Video**: Enabled on retry

## 🔧 Available Scripts

Add these scripts to your `package.json` for convenience:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "test:install": "playwright install"
  }
}
```

Then you can run:
```bash
npm run test
npm run test:ui
npm run test:headed
npm run test:debug
npm run test:report
```

## 🐛 Debugging

### Debug Failed Tests

1. Run tests with debug flag:
   ```bash
   npx playwright test --debug
   ```

2. Use UI mode for interactive debugging:
   ```bash
   npx playwright test --ui
   ```

3. View traces for failed tests:
   ```bash
   npx playwright show-trace trace.zip
   ```

4. Check screenshots for visual debugging:
   ```bash
   # View screenshots directory
   ls screenshots/
   ```

### Common Issues

1. **Browser not found**: Run `npx playwright install`
2. **Tests failing**: Check if the target website is accessible
3. **Timeout issues**: Increase timeout in config or test files
4. **Screenshot errors**: Ensure screenshots directory exists

## 📱 Test Environment

- **Base URL**: https://prod.testrunz.com/
- **Test Credentials**: 
  - Email: `mixergrinder445@gmail.com`
  - Password: `Test@123`

## 🏗️ Project Structure

```
Playwright/
├── package.json
├── package-lock.json
├── playwright.config.js
├── README.md
├── .gitignore
├── screenshots/          # Generated screenshots
├── Testruns/
│   ├── utils/
│   │   └── screenshot-helper.js
│   ├── Login.spec.js
│   ├── SignUp.spec.js
│   └── ForgetPassword.spec.js
└── test-results/         # Test artifacts
```

## 📝 Notes

- Tests are designed to run against the production environment
- Some tests use real credentials - consider using environment variables for sensitive data
- Social login tests open popup windows and verify URLs
- Random user generation is used for signup tests to avoid conflicts
- Tests include proper cleanup and error handling
- **Screenshots are captured at every step for comprehensive visual debugging**

## 🤝 Contributing

1. Follow the existing test structure
2. Add proper assertions and error handling
3. Use descriptive test names
4. Include comments for complex test logic
5. Run tests locally before committing
6. **Add screenshots for new test steps**

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Configuration](https://playwright.dev/docs/test-configuration)
- [Playwright Screenshots](https://playwright.dev/docs/screenshots) 