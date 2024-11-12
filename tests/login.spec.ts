import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";

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

	const header = await storePage.header.textContent();
	expect(header).toBe("Store");

	const username = await storePage.usernameText.textContent();
	//expect(username).toContain("Markus");
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
