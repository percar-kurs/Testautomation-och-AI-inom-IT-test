import { test, request, APIRequestContext, expect } from '@playwright/test';
let apiContext: APIRequestContext;

test.beforeAll('Setup api store', async () =>
{
	apiContext = await request.newContext({
		baseURL: 'https://hoff.is/store2/api/v1/',
		extraHTTPHeaders: {
			'content-type': 'application/octet-stream'
		}
	});
});

type productType = { id: number; price: number; vat: number; name: string }
// loopa igenom alla produkter och kolla av typen
// https://hoff.is/store2/api/v1/product/list


test('store_api', async () =>
{
	type productListType = {
		product: productType;
	}

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

/*


const testList = [
	{age: "11", name: "A Name", grade: "A"},
	{age: "22", name: "B Name", grade: "B"},
	{age: "33", name: "C Name", grade: "C"},
	{age: "44", name: "D Name", grade: "D"},
]

testList.forEach(({age, name, grade}) => {

	test('Create student using API with parameters'+name, async () =>
		{
			const student = {
				age: age,
				name: name,
				grade: grade
			};
		
			console.log(student);
			// Create new student using POST
			const response = await apiContext.post("/student", { data: student });
			const responseJson = await response.json();
		
			const studentId = responseJson.student_id;
		
			// GET newly created student by ID
			const responseGet = await apiContext.get(`/student/${studentId}`);
			const responseGetJson = await responseGet.json();
		
			//console.log(responseGetJson);
			// Verify student that is created has the expected age
			expect(responseGetJson.age, 'Age should bmatch').toBe(student.age);
		});
})


test('Create student using API', async () =>
{
	const student = {
		age: "99",
		name: "Markus Hoff",
		grade: "MVG"
	};

	// Create new student using POST
	const response = await apiContext.post("/student", { data: student });
	const responseJson = await response.json();

	const studentId = responseJson.student_id;

	// GET newly created student by ID
	const responseGet = await apiContext.get(`/student/${studentId}`);
	const responseGetJson = await responseGet.json();

	// Verify student that is created has the expected age
	expect(responseGetJson.age).toBe(student.age);
});



test('store_api 2', async () =>
{
	const product = {
		"id": 1,
		"price": 15,
		"vat": 3,
		"name": "Apple"
	};
	const apiRequest = await request.newContext();

	// Make the GET request
	const response = await apiRequest.get(`https://hoff.is/store2/api/v1/price/${product.id}`);

	// Check if the response status is 200
	expect(response.status()).toBe(200)
	expect(response.headers()['content-type'], 'Should Content-Type be octet-stream').toBe('application/octet-stream');


	const responseJson = await response.json();

	// const productId = responseJson.product.id
	console.log(product);
	console.log(responseJson);
	expect(responseJson.id, 'Should match on product id: ').toBe(product.id);
	expect(responseJson, 'Should product match  ').toStrictEqual(product);
});


*/