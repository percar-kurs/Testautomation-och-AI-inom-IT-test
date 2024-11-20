import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";


import fs from 'fs';
import path from 'path';

// Ensure the screenshots directory exists
const screenshotsDir = 'screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    // Capture a screenshot
    const screenshotPath = path.join(screenshotsDir, `${testInfo.title.replace(/\s+/g, '_')}.png`);
    await page.screenshot({ path: screenshotPath });

    // Attach the screenshot to the report
    testInfo.attachments.push({
      name: 'screenshot',
      path: screenshotPath,
      contentType: 'image/png',
    });

    console.log(`Screenshot saved: ${screenshotPath}`);
  }
});

test.beforeEach(async ({ page, context }) => {
  // Enable tracing for each test
  await context.tracing.start({ screenshots: true, snapshots: true });
});

test.afterAll(async ({ context }, testInfo) => {
  // Save the trace after all tests are done
  const tracePath = `traces/${testInfo.title.replace(/\s+/g, '_')}.zip`;
  await context.tracing.stop({ path: tracePath });

  // Attach the trace to the report
  testInfo.attachments.push({
    name: 'trace',
    path: tracePath,
    contentType: 'application/zip',
  });

  console.log(`Trace saved: ${tracePath}`);
});

// ********************************************

test('When Login with Markus, Then store opens and Username is Markus', async ({ page }) =>
{
	const loginPage = new LoginPage(page);
	const storePage = new StorePage(page);

	let validPassword;
	if(process.env.PASSWORD !== undefined)
	{
		validPassword = process.env.PASSWORD;
	}

	await page.goto("http://hoff.is/login");
	await loginPage.login("Markus", validPassword, "consumer");
	await page.waitForTimeout(1000); // wait for page to be loaded

	const header = await storePage.header.textContent();
	expect(header).toBe("Store");

	const username = await storePage.usernameText.textContent();
	expect(username).toContain("Markus");
});


test('When login with faulty password,  Then fail with error message', async ({ page }) =>
{
	const loginPage = new LoginPage(page);
	const storePage = new StorePage(page);

	await page.goto("http://hoff.is/login");
	await loginPage.login("asdf", "asdf", "consumer");

	const errorMessage = await loginPage.errorMessage.textContent();
	expect(errorMessage).toBe('Incorrect password');

});



test('When Login with valid password and logout, Then user is back on login page', async ({ page }) =>
{
	const loginPage = new LoginPage(page);
	const storePage = new StorePage(page);

	let validPassword;
	if(process.env.PASSWORD !== undefined)
	{
		validPassword = process.env.PASSWORD;
	}

	await page.goto("http://hoff.is/login");
	await loginPage.login("Markus", validPassword, "consumer");
	await page.waitForTimeout(1000); // wait for page to be loaded

	const header = await storePage.header.textContent();
	expect(header).toBe("Store");

	const username = await storePage.usernameText.textContent();
	expect(username).toContain("Markus");

	const logoutButton = await storePage.logoutButton;
	await storePage.logoutButton.click();


	await page.waitForLoadState('networkidle'); // Wait for network activity to stabilize

	// back on login page
	await page.waitForTimeout(1000); // wait for page to be loaded
	const usernameInput = await loginPage.usernameInput

	expect(usernameInput).toBeEditable();

});

