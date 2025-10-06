import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly continueShoppingBtn: Locator;
  readonly checkoutBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingBtn = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
  }

  async assertOnCart() {
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  itemByName(name: string) {
    const row = this.cartItems.filter({ hasText: name });
    return {
      row,
      name: row.locator('.inventory_item_name'),
      removeBtn: row.getByRole('button', { name: 'Remove' }),
      price: row.locator('.inventory_item_price'),
      qty: row.locator('.cart_quantity'),
    };
  }

  async expectItemVisible(name: string) {
    await expect(this.itemByName(name).row).toBeVisible();
  }

  async continueShopping() {
    await this.continueShoppingBtn.click();
  }
}
