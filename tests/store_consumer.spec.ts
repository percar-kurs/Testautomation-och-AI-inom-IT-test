import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";

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
	await page.waitForTimeout(2000); // wait for page to be loaded

	const header = await storePage.header;
	expect(header).toBeVisible();

	// back on login page
	expect(loginPage.usernameInput).toBeVisible();


});