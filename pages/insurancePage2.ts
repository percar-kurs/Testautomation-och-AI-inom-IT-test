
//insurance/

import { Page } from '@playwright/test';

export class InsurancePage2 {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get navbarNav() {
    return this.page.locator('#navbarNav');
  }

  get inputName() {
    return this.page.locator('#inputName');
  }
}



