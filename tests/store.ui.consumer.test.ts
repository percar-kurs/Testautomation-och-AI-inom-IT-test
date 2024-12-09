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
	const totalSum = quantity * product.price;
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


		// add product to cart
		await storePage.addProductToCart(product.name, quantity);
		const productInCart = page.locator(`[data-testid="${product.name}-receipt-name"]`);
		await expect(productInCart).toHaveCount(1);

		// verify cart total sum
		await expect.soft(storePage.totalSum, 'Should cart total be correct').toContainText(String(totalSum));
		await expect.soft(storePage.totalVAT, 'Should cart total VAT be correct').toContainText(String(totalVAT));
		await expect.soft(storePage.grandTotal, 'Should cart grand Total be correct').toContainText(String(grandTotal));

		// cart Checkout
		await storePage.cartCheckout();
		await expect(storePage.finalizePurchaseHeading, 'Should modal for customer input be visible').toBeVisible();

		// add customer information
		await storePage.addCustomerInformation(customer);
		await expect(storePage.purchaseModalLabel, 'Should modal finalize purchase be visible').toContainText('Finalize Purchase');
		
		// vverify receipt contains expeced message
		await expect.soft(storePage.purchaseModalLabel, 'Should modal finalize purchase be visible').toContainText('Finalize Purchase');
		await expect.soft(storePage.receiptSubTitle, 'Should modal subtitle be receipt').toContainText('Receipt');
		await expect.soft(storePage.receiptItems, 'Should receipt items include selected product').toContainText(`${quantity} x ${product.name} - $${grandTotal}`);
		await expect.soft(storePage.receiptName, 'Should a thank you message with customer name be displayd').toContainText(`Thank you for your purchase, ${customer.name}`);
		await expect.soft(storePage.receiptAddress, 'Should customers shipping address be displayed').toContainText(`It will be shipped to: ${customer.address}`);
		await expect.soft(storePage.receiptTotal, 'Should receipt total be correct').toContainText(String('$' + grandTotal));
		await expect.soft(storePage.receiptVAT, 'Should receipt VAT be correct').toContainText(String('$' + totalVAT));
		await expect.soft(storePage.receiptGrandTotal, 'Should receipt grand total be Correct').toContainText('$' + String(grandTotal));

		await storePage.closeReceipt();

		// should result in empty cart and an updated balance
		const updatedMonyBalance = await storePage.moneyBalance.textContent();
		await expect(storePage.totalSum, 'Should be no ongoing purchase, cart is emtpy').toContainText('0');
		await expect(updatedMonyBalance, 'Should new moneybalance after purchase be updated').toEqual(Number(initialMonyBalance) - Number(grandTotal));

	});
}