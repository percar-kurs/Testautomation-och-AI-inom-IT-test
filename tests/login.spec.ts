import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";


test('Login with Markus, get header', async ({ page }) =>
	{
		const loginPage = new LoginPage(page);
		const storePage = new StorePage(page);
	
		let validPassword;
		if (process.env.PASSWORD !== undefined){
			 validPassword =  process.env.PASSWORD;
		}
		
		await page.goto("http://hoff.is/login");
		await loginPage.login("Markus", 'sup3rs3cr3t', "consumer");
	
		await page.waitForTimeout(5000); // wait for page to be loaded
		
		const h1 = await page.locator('h1');
		await expect(h1).toBeVisible();
		const h1Text = await h1.textContent();

		await page.waitForTimeout(20000); // wait for page to be loaded
		expect(h1Text).toBe('Store');

	});



test('Login with Markus, valid pw', async ({ page }) =>
{
	const loginPage = new LoginPage(page);
	const storePage = new StorePage(page);


	let validPassword;
	if (process.env.PASSWORD !== undefined){
		 validPassword =  process.env.PASSWORD;
	}

	
	await page.goto("http://hoff.is/login");
	await loginPage.login("Markus", 'sup3rs3cr3t', "consumer");
	await page.waitForTimeout(2000); // wait for page to be loaded

	const header = await storePage.header.textContent();
	expect(header).toBe("Store");

	const username = await storePage.usernameText.textContent();
	expect(username).toContain("Markus");
	
	
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

