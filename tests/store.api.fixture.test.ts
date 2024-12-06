import { test, expect } from '../fixtures/store.api.fixture';

// loop through products in api:products/list , for each product data in api:price, validate data types
// https://hoff.is/store2/api/v1/product/list
// https://hoff.is/store2/api/v1/price
// type ProductType = { id: number; name: string; price: number; vat: number }

test('Get products list, validate that each products data match product Type', async ({ apiContext }) => {
    const responseProductList = await apiContext.get(`product/list`);
    expect(responseProductList.status(), 'Should return status 200 for product list').toBe(200);
    expect(responseProductList.headers()['content-type'], 'Content-Type should be application/json').toBe('application/octet-stream');
    const productList = await responseProductList.json();
    // console.log(productList);

	// Get each product and
    for (const product of productList.products) {
        const responseProductData = await apiContext.get(`price/${product.id}`);
        expect(responseProductData.status(), `Should return status 200 for price of product ID ${product.id}`).toBe(200);
        expect(responseProductData.headers()['content-type'], 'Content-Type should be application/json').toBe('application/octet-stream');

        const productDataJson = await responseProductData.json();
        // console.log(productDataJson);

		// validate valid productType
		expect(productDataJson).toHaveProperty('id', expect.any(Number));
		expect(productDataJson).toHaveProperty('price', expect.any(Number));
		expect(productDataJson).toHaveProperty('vat', expect.any(Number));
		expect(productDataJson).toHaveProperty('name', expect.any(String));
    }
});