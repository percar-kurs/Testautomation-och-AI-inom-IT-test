import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';


test('Accessability - json report attached', async ({ page }, testInfo) =>
{
	// Navigate to the page
	await page.goto('http://hoff.is/login');

	const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
	await testInfo.attach('accessibility-scan-results', {
		body: JSON.stringify(accessibilityScanResults, null, 2),
		contentType: 'application/json',
	});

	// Assert no accessibility violations
	expect(accessibilityScanResults.violations).toEqual([]);
});
