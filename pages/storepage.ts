import { Locator, Page } from "@playwright/test";
import { expect } from '../fixtures/store.api.fixture';

export class StorePage
{
	readonly page: Page;
	readonly usernameText: Locator;
	readonly header: Locator;
	readonly logoutButton: Locator;
	readonly pageTitle: Locator;
	readonly selectProductDropdown: Locator;
	readonly amountInput: Locator;
	readonly addToCartButton: Locator;
	readonly productList: Locator;
	readonly buyButton: Locator;
	readonly finalizePurchaseHeading: Locator;
	readonly nameInput: Locator;
	readonly addressInput: Locator;
	readonly confirmPurchaseButtonAddress: Locator;
	readonly purchaseModalLabel: Locator;
	readonly receiptSubTitle: Locator;;
	readonly receiptItems: Locator;
	readonly receiptTotal: Locator;
	readonly receiptVAT: Locator;
	readonly receiptGrandTotal: Locator;
	readonly moneyBalance: Locator;
	readonly totalSum: Locator;
	readonly totalVAT: Locator;
	readonly grandTotal: Locator;
	readonly confirmPurchaseButton: Locator;
	readonly receiptAddress: Locator;
	readonly receiptName: Locator;
	readonly buyMessage: Locator;

	constructor(page: Page)
	{
		this.page = page;
		this.pageTitle = page.locator('title');
		this.usernameText = page.getByTestId("username");
		this.header = page.locator("h1")
		this.logoutButton = page.locator('button.btn.btn-danger.btn-sm.mt-2', {
			hasText: 'Log Out',
		});

		this.buyMessage = page.getByTestId('buy-message');
		this.selectProductDropdown = page.getByTestId('select-product');
		this.amountInput = page.getByLabel('Amount');
		this.addToCartButton = page.getByTestId('add-to-cart-button');
		this.productList = page.locator('#productList');
		this.buyButton = page.getByRole('button', { name: 'Buy' });
		this.finalizePurchaseHeading = page.getByRole('heading', { name: 'Finalize Purchase' });
		this.nameInput = page.getByLabel('Name:');
		this.addressInput = page.getByLabel('Address:');
		this.confirmPurchaseButtonAddress = page.getByRole('button', { name: 'Confirm Purchase' });
		this.purchaseModalLabel = page.locator('#purchaseModalLabel');

		this.receiptSubTitle = page.locator('#finalReceipt>h5')
		this.receiptItems = page.locator('#receiptItems');
		this.receiptName = page.locator('#name');
		this.receiptAddress = page.locator('#address');
		this.receiptTotal = page.locator('#receiptTotal');
		this.receiptVAT = page.locator('#receiptVAT');
		this.receiptGrandTotal = page.locator('#receiptGrandTotal');

		this.moneyBalance = page.getByTestId('money');
		this.totalSum = page.locator('#totalSum');
		this.totalVAT = page.locator('#totalVAT');
		this.grandTotal = page.locator('#grandTotal');
		this.confirmPurchaseButton = page.locator('#confirmPurchaseButton');
	}


	async verifyProductExistsInProductSelect(productName: string)
	{
		const selectableProductsOptions = await this.selectProductDropdown.locator('option').allTextContents();
		expect(selectableProductsOptions, 'Product name should exist in the dropdown').toContain(productName);
	}
	async verifyProductAndPriceInProductList(productName: string, price: number)
	{
		const productRow = this.productList.locator('tr', { hasText: productName });
		const productPrice = productRow.locator('td:nth-child(2)');
		expect(productPrice, 'Should product and price exist in product list').toContainText(String(price));
	}

	async addProductToCart(productName: string, quantity: number)
	{
		await this.selectProductDropdown.selectOption({ label: `${productName}` });
		await this.amountInput.fill(`${quantity}`);
		await this.addToCartButton.click();
		await expect(this.buyMessage, 'Should a message be displayed of selected products').toContainText(`Added ${quantity} x ${productName} to cart.`)
	}

	async verifyProductInCart(productName: string, price: number, quantity: number)
	{
		const productNameLocator = this.page.getByTestId(`${productName}-receipt-name`);
		const productAmountLocator = this.page.getByTestId(`${productName}-receipt-quantity`);
		const productPriceLocator = this.page.getByTestId(`${productName}-receipt-price`);

		// ok with expect in POM?
		await expect.soft(productNameLocator, 'Should product name be in cart').toContainText(productName);
		await expect.soft(productAmountLocator, 'Should selected amout be in cart').toContainText(String(quantity));
		await expect.soft(productPriceLocator, 'Should calculated product total price be correct in cart').toContainText(String(price * quantity));
	}


	async verifyCartTotalSum(totalSum: number, totalVAT: number, grandTotal: number)
	{
		await expect.soft(this.totalSum, 'Should cart total be correct').toContainText(String(totalSum));
		await expect.soft(this.totalVAT, 'Should cart total VAT be correct').toContainText(String(totalVAT));
		await expect.soft(this.grandTotal, 'Should cart grand Total be correct').toContainText(String(grandTotal));
	}
	async cartCheckout()
	{
		await this.buyButton.click();
	}

	async addCustomerInformation(customer)
	{
		await expect(this.finalizePurchaseHeading, 'Should modal for customer input be visible').toBeVisible();
		await this.nameInput.fill(customer.name);
		await this.addressInput.fill(customer.address);
		await this.confirmPurchaseButtonAddress.click();
	}

	async verifyCustomerReceipt(customer, product, grandTotal, totalVAT, quantity)
	{
		await expect.soft(this.purchaseModalLabel, 'Should modal finalize purchase be visible').toContainText('Finalize Purchase');
		await expect.soft(this.receiptSubTitle, 'Should modal subtitle be receipt').toContainText('Receipt');
		await expect.soft(this.receiptItems, 'Should receipt items include selected product').toContainText(`${quantity} x ${product.name} - $${grandTotal}`);
		await expect.soft(this.receiptName, 'Should a thank you message with customer name be displayd').toContainText(`Thank you for your purchase, ${customer.name}`);
		await expect.soft(this.receiptAddress, 'Should customers shipping address be displayed').toContainText(`It will be shipped to: ${customer.address}`);

		await expect.soft(this.receiptTotal, 'Should receipt total be correct').toContainText(String('$' + grandTotal));
		await expect.soft(this.receiptVAT, 'Should receipt VAT be correct').toContainText(String('$' + totalVAT));
		await expect.soft(this.receiptGrandTotal, 'Should receipt grand total be Correct').toContainText('$' + String(grandTotal));
	}

	async closeReceipt()
	{
		await this.confirmPurchaseButton.click();
	}

}
