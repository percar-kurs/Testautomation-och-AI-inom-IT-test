import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";
import AxeBuilder from '@axe-core/playwright';

test('Login with Markus, valid pw', async ({ page }) =>
{
	const loginPage = new LoginPage(page);
	const storePage = new StorePage(page);


	let validPassword;
	if (process.env.PASSWORD !== undefined){
		 validPassword =  process.env.PASSWORD;
	}

	
	await page.goto("http://hoff.is/login");
	await loginPage.login("Markus", validPassword, "consumer");
	await page.waitForTimeout(2000); // wait for page to be loaded
	const header = await storePage.header.textContent();
	expect(header).toBe("Store");


	const username = await storePage.usernameText.textContent();
	expect(username).toContain("Markus");
	// expect(storePage.usernameText).toHaveText("Markus");
	
});

test('Login that fails', async ({ page }) =>
{
	const loginPage = new LoginPage(page);
	const storePage = new StorePage(page);

	await page.goto("http://hoff.is/login");
	await loginPage.login("asdf", "asdf", "consumer");

	const errorMessage = await loginPage.errorMessage.textContent();
	expect(errorMessage).toBe('Incorrect password');

});



test('example with attachment', async ({ page }, testInfo) => {
    // Navigate to the page
    await page.goto('http://hoff.is/login');

    // Run Axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Attach the results to the test info for reporting
    await testInfo.attach('accessibility-scan-results', {
        body: JSON.stringify(accessibilityScanResults, null, 2),
        contentType: 'application/json',
    });

    // Assert no accessibility violations
    expect(accessibilityScanResults.violations).toEqual([]);
});


