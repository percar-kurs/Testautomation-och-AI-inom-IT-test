import { test, expect } from '../fixtures/store.api.fixture';


type productType = { id: number; price: number; vat: number; name: string }
// loopa igenom alla produkter och kolla av typen
// https://hoff.is/store2/api/v1/product/list

type productListType = {
	product: productType;
}


test('store_api', async ({apiContext}) =>
{


	const apple: productType = { "id": 1, "price": 15, "vat": 3, "name": "Apple" };
	
	const response = await apiContext.get(`price/${apple.id}`);

	expect(response.status(),' Should response status ' ).toBe(200)
	expect(response.headers()['content-type'], 'Should Content-Type ').toBe('application/octet-stream');


	const responseJson = await response.json();

	// const productId = responseJson.product.id
	//	console.log(apple);
	//	console.log(responseJson);
	expect(responseJson.id, 'Should productid ').toBe(apple.id);
	expect(responseJson, 'Should product response equal  ').toStrictEqual(apple);
});
