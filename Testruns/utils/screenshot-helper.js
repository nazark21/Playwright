/**
 * Screenshot Helper Utility
 * Provides functions to take screenshots at specific steps during test execution
 */

/**
 * Take a screenshot with a descriptive name
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} stepName - Name of the step for the screenshot
 * @param {string} testName - Name of the test
 */
export async function takeScreenshot(page, stepName, testName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${testName}_${stepName}_${timestamp}.png`;
  
  try {
    await page.screenshot({ 
      path: `screenshots/${fileName}`,
      fullPage: true 
    });
    console.log(`📸 Screenshot taken: ${fileName}`);
  } catch (error) {
    console.error(`❌ Failed to take screenshot: ${error.message}`);
  }
}

/**
 * Take a screenshot before and after an action
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} actionName - Name of the action being performed
 * @param {string} testName - Name of the test
 * @param {Function} action - The action to perform
 */
export async function takeScreenshotAroundAction(page, actionName, testName, action) {
  // Take screenshot before action
  await takeScreenshot(page, `before_${actionName}`, testName);
  
  // Perform the action
  await action();
  
  // Wait a bit for any animations or state changes
  await page.waitForTimeout(500);
  
  // Take screenshot after action
  await takeScreenshot(page, `after_${actionName}`, testName);
}

/**
 * Take a screenshot of a specific element
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {import('@playwright/test').Locator} element - Element to screenshot
 * @param {string} elementName - Name of the element
 * @param {string} testName - Name of the test
 */
export async function takeElementScreenshot(page, element, elementName, testName) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${testName}_${elementName}_${timestamp}.png`;
  
  try {
    await element.screenshot({ 
      path: `screenshots/${fileName}` 
    });
    console.log(`📸 Element screenshot taken: ${fileName}`);
  } catch (error) {
    console.error(`❌ Failed to take element screenshot: ${error.message}`);
  }
}

/**
 * Create screenshots directory if it doesn't exist
 * @param {import('@playwright/test').TestInfo} testInfo - Test info object
 */
export async function ensureScreenshotsDirectory(testInfo) {
  const fs = require('fs');
  const path = require('path');
  
  const screenshotsDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Create test-specific directory
  const testDir = path.join(screenshotsDir, testInfo.title.replace(/[^a-zA-Z0-9]/g, '_'));
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  return testDir;
} 