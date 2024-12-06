import { test, expect, request } from "@playwright/test";
import { StorePage } from "../pages/storepage";

type CustomerType = { name: string; address: string }
type ProductType = { id: number; price: number; vat: number; name: string; }

const customer: CustomerType = { name: 'Cest moi', address: 'Les Champs-Elysees' };
const quantity: number = 1;

// test with data from store UI-data
const productListUI: ProductType[] = [
	{ id: 1, price: 15, vat: 3, name: 'Apple' },
	{ id: 2, price: 23, vat: 4.7, name: 'Banana' },
	{ id: 3, price: 34, vat: 8.5, name: 'Orange' },
	{ id: 4, price: 4, vat: 0.8, name: 'Grape' },
	{ id: 5, price: 999, vat: 199.8, name: 'Bicycle' },
	{ id: 6, price: 4999, vat: 999.8, name: 'Samsung S5' },
	{ id: 7, price: 399, vat: 79, name: 'Toy train' },
	{ id: 8, price: 29, vat: 5.8, name: 'Cup of Coffee' },
	{ id: 9, price: 299, vat: 59.8, name: 'Chair' },
	{ id: 10, price: 9500, vat: 1900, name: 'TV' }

];

for(const product of productListUI)
{
	// Calculate prices and VAT by %
	const totalSum = quantity * product.price;
	const VATpercentage: number = product.vat / product.price;
	const VATpercentageRounded = parseFloat(VATpercentage.toFixed(1));
	const totalVAT = product.vat * quantity;
	const grandTotal = quantity * product.price;

	test(`Customer: '${customer.name}' adds product: '${product.name}' to cart and fullfills purchase`, async ({ page }) =>
	{
		const storePage = new StorePage(page);

		await page.goto(`https://hoff.is/store2/?username=${customer.name}&role=consumer`);

		const username = await storePage.usernameText.textContent();
		await expect(username, 'Should username be set').toContain(`${customer.name}`);
		const initialMonyBalance = await storePage.moneyBalance.textContent();
		await expect(initialMonyBalance, 'Should inital moneybalance be 10000').toBe('10000');

		await storePage.verifyProductExistsInProductSelect(product.name);
		await storePage.verifyProductAndPriceInProductList(product.name, product.price);
		await storePage.addProductToCart(product.name, quantity);
		await storePage.verifyProductInCart(product.name, product.price, quantity);
		await storePage.verifyCartTotalSum(totalSum, totalVAT, grandTotal);
		await storePage.cartCheckout();
		await storePage.addCustomerInformation(customer);
		await storePage.verifyCustomerReceipt(customer, product, grandTotal, totalVAT, quantity);
		await storePage.closeReceipt();

		// cart empty and new balance
		const updatedMonyBalance = await storePage.moneyBalance.textContent();
		await expect(storePage.totalSum, 'Should be no ongoing purchase, cart is emtpy').toContainText('0');
		await expect.soft(updatedMonyBalance, 'Should new moneybalance after purchase be updated').toBe(String(Number(initialMonyBalance) - Number(grandTotal)));

	});
}