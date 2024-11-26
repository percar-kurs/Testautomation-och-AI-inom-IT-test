import { Locator, Page } from "@playwright/test";

export class StorePage
{
	readonly page: Page;
	readonly usernameText: Locator;
	readonly header: Locator;
	readonly logoutButton: Locator;
	readonly pageTitle: Locator;

	constructor(page: Page)
	{
		this.page = page;
		this.pageTitle = page.locator('title');
		this.usernameText = page.getByTestId("username");
		this.header = page.locator("h1")
		this.logoutButton = page.locator('button.btn.btn-danger.btn-sm.mt-2', {
			hasText: 'Log Out',
		});
	}

    async getUserName(){
        this.page.waitForTimeout(200)
        return this.usernameText.textContent()
    }


}
