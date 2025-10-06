import { Page, Locator, expect } from '@playwright/test';

/**
 * Product details page object.
 */
export class ProductDetailsPage {
  readonly page: Page;
  readonly backButton: Locator;
  readonly title: Locator;
  readonly addBtn: Locator;
  readonly removeBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backButton = page.getByRole('button', { name: 'Back to products' });
    this.title = page.locator('.inventory_details_name');
    this.addBtn = page.getByRole('button', { name: 'Add to cart' });
    this.removeBtn = page.getByRole('button', { name: 'Remove' });
  }

  async assertOnDetails() {
    await expect(this.title).toBeVisible();
    await expect(this.page).toHaveURL(/inventory-item\.html\?id=/);
  }

  async backToInventory() {
    await this.backButton.click();
  }
}
