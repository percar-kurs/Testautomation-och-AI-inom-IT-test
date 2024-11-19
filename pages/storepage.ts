import { Locator, Page } from "@playwright/test";

export class StorePage
{
	readonly page: Page;
	readonly usernameText: Locator;
	readonly header: Locator;
	readonly logoutButton: Locator;

	constructor(page: Page){
		this.page=page;
		this.usernameText = page.getByTestId("username");
		this.header = page.locator("h1")
		this.logoutButton = page.locator('button.btn.btn-danger.btn-sm.mt-2', { hasText: 'Log Out',	   

		});
	}

}