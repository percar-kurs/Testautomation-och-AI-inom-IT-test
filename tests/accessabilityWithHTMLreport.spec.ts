import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";


test.describe('Accessability test', () =>
{

	test('Accessability test for http://hoff.is/login - with HTML-report', async ({ page }, testInfo) =>
	{

		await page.goto('http://hoff.is/login');
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		const { violations } = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wdag2aa"])
			.analyze();

		const reportHTML = createHtmlReport({
			results: accessibilityScanResults,
			options: {
				projectKey: "PlaywrightHomepage"
			},
		});

		// attach html report
		await testInfo.attach('accessibility-login-html-report', {
			body: reportHTML,
			contentType: 'text/html',
		});

		expect(accessibilityScanResults.violations).toEqual([]);

	});

	test('Accessability test for http://hoff.is/store- with HTML-report', async ({ page }, testInfo) =>
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


		// Do acc test
		const header = await storePage.header.textContent();
		expect(header).toBe("Store");
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		const { violations } = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wdag2aa"])
			.analyze();

		const reportHTML = createHtmlReport({
			results: accessibilityScanResults,
			options: {
				projectKey: "PlaywrightHomepage"
			},
		});

		// attach html report
		await testInfo.attach('accessibility-store-html-report', {
			body: reportHTML,
			contentType: 'text/html',
		});

		expect(accessibilityScanResults.violations).toEqual([]);

	});

});