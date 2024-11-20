import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';


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
		await testInfo.attach('accessibility-html-report', {
			body: reportHTML,
			contentType: 'text/html',
		});

		expect(accessibilityScanResults.violations).toEqual([]);

	});

});