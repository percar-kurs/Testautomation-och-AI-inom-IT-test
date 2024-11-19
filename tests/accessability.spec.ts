import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/loginpage";
import { StorePage } from "../pages/storepage";
import AxeBuilder from '@axe-core/playwright';




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


