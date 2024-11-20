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
	validPassword = 'sup3rs3cr3t';

	await page.goto("http://hoff.is/login");
	await loginPage.login("Markus", validPassword, "consumer");
	await page.waitForTimeout(1000); // wait for page to be loaded

	const header = await storePage.header.textContent();
	expect(header).toBe("Store");

	const username = await storePage.usernameText.textContent();
	expect(username).toContain("Markus");

	const logoutButton = await storePage.logoutButton;
	await storePage.logoutButton.click();


	// back on login page
	await page.waitForTimeout(1000); // wait for page to be loaded
	const pageTitle = await loginPage.pageTitle.textContent();
	expect(pageTitle).toBe('Login Page');

});

