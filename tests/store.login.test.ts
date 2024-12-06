import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";

test('When Login with Markus, Then store opens and Username is Markus', async ({ page }) =>
{
	const loginPage = new LoginPage(page);
	const storePage = new StorePage(page);

	let validPassword;
	if(process.env.PASSWORD !== undefined)
	{
		validPassword = process.env.PASSWORD;
	}

	const userName = "Namnet";

	await page.goto("http://hoff.is/login");
	await loginPage.login(userName, validPassword, "consumer");
	await page.waitForTimeout(1000); // wait for page to be loaded

	const header = await storePage.header.textContent();
	expect(header, 'Should Store header be displayed').toBe("Store");

	const username = await storePage.usernameText.textContent();
	expect(username, 'Should username be displayed').toContain(userName);
});


test('When login with faulty password,  Then fail with error message', async ({ page }) =>
{
	const loginPage = new LoginPage(page);

	await page.goto("http://hoff.is/login");
	await loginPage.login("asdf", "asdf", "consumer");

	const errorMessage = await loginPage.errorMessage.textContent();
	expect(errorMessage, 'Expected errormessage: ' + errorMessage).toBe('Incorrect password');

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

	const userName = "Namnet";

	await page.goto("http://hoff.is/login");
	await loginPage.login(userName, validPassword, "consumer");
	await page.waitForTimeout(1000); // wait for page to be loaded

	const header = await storePage.header.textContent();
	expect(header, 'Should User be logged in and store header be displayed').toBe("Store");

	const username = await storePage.usernameText.textContent();
	expect(username, 'Should username be displayed').toContain(userName);

	const logoutButton = await storePage.logoutButton;
	await storePage.logoutButton.click();

	// back on login page
	await page.waitForTimeout(1000); // wait for page to be loaded
	const pageTitle = await loginPage.pageTitle.textContent();
	expect(pageTitle, 'Should user be on logged in page').toBe('Login Page');

});

