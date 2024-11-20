import { test, request, APIRequestContext, expect } from '@playwright/test';
let apiContext: APIRequestContext;

test.beforeAll('Setup api context', async () =>
{
	apiContext = await request.newContext({
		baseURL: 'https://test-379574553568.us-central1.run.app',
		extraHTTPHeaders: {
			'api_key': 'apikey2',
			'content-type': 'application/json'
		}
	});
});

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

test('Create student then delete', async () =>
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
	//expect(responseGetJson.age).toBe(student.age);

	// delete user
	const responseDelete = await apiContext.delete(`/student/${studentId}`);
	const responseDeleteJson = await responseDelete.json();
	console.log(await responseDelete.json());

	expect(responseDeleteJson.message).toBe(`Deleted student: ${studentId}`)

	// get deleted student
	const responseGetDeleted = await apiContext.get(`/student/${studentId}`);
	const responseGetDeletedJson = await responseGetDeleted.json();

	// Verify student that is created has the expected age
	console.log(responseGetDeletedJson);
	expect(responseGetDeletedJson.message).toBe(`No student found with id: ${studentId}`);


});

