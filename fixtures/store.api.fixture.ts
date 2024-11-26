import { APIRequestContext, test as base, expect, request } from '@playwright/test';

type ApiFixtures = {
	apiContext: APIRequestContext;
}

// Extend the base test with the `apiContext` fixture
export const test = base.extend<ApiFixtures>({
	apiContext: async ({ }, use) =>
	{
		const apiContext = await request.newContext(
			{
				baseURL: 'https://hoff.is/store2/api/v1/',
				extraHTTPHeaders: {
					'content-type': 'application/octet-stream'
				}
			});

		await use(apiContext);

		await apiContext.dispose();
	}
});

export { expect };

