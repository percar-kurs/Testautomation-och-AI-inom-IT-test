import { test, expect } from '../fixtures/store.api.fixture';

// loop through products in api:products/list , for each product data in api:price, validate data types
// https://hoff.is/store2/api/v1/product/list
// https://hoff.is/store2/api/v1/price
// type ProductType = { id: number; name: string; price: number; vat: number }

test('When requesting products list, for each products data, validate properties', async ({ apiContext }) =>
{
	const responseProductList = await apiContext.get(`product/list`);
	expect(responseProductList.status(), 'Should return status 200 for product list').toBe(200);
	expect(responseProductList.headers()['content-type'], 'Content-Type should be application/json').toBe('application/octet-stream');
	const productList = await responseProductList.json();
	// console.log(productList);

	// Get each product and
	for(const product of productList.products)
	{
		const responseProductData = await apiContext.get(`price/${product.id}`);
		expect(responseProductData.status(), `Should return status 200 for product ID ${product.id}`).toBe(200);
		expect(responseProductData.headers()['content-type'], 'Content-Type should be application/json').toBe('application/octet-stream');

		const productDataJson = await responseProductData.json();
		// console.log(productDataJson);

		// validate valid productType
		
		expect(productDataJson, `Should ${productDataJson.name}: id be a number`).toHaveProperty('id', expect.any(Number));
		expect(productDataJson, `Should ${productDataJson.name}: price be a number`).toHaveProperty('price', expect.any(Number));
		expect(productDataJson, `Should ${productDataJson.name}: vat be a number`).toHaveProperty('vat', expect.any(Number));
		expect(productDataJson, `Should ${productDataJson.name}: name  be a string`).toHaveProperty('name', expect.any(String));
	}
});