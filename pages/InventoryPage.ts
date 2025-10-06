import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly inventoryContainer: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly sortSelect: Locator;
  readonly itemCards: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('.app_logo');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.cartIcon = page.locator('#shopping_cart_container');
    this.cartBadge = this.cartIcon.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.sortSelect = page.locator('[data-test="product-sort-container"]').or(page.getByRole('combobox'));
    this.itemCards = page.locator('.inventory_item');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async assertLoaded() {
    await expect(this.title).toBeVisible();
    await expect(this.inventoryContainer).toBeVisible();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  itemByName(name: string) {
    const titleLink = this.page.locator('[data-test$="-title-link"]').filter({ hasText: name });
    const card = titleLink.locator('xpath=ancestor::*[@class="inventory_item" or @data-test="inventory-item"][1]');

    return {
      card,
      nameLink: titleLink,
      imageLink: card.locator('[data-test$="-img-link"]'),
      price: card.locator('.inventory_item_price'),
      addBtn: card.getByRole('button', { name: 'Add to cart' }),
      removeBtn: card.getByRole('button', { name: 'Remove' }),
    };
  }

  async addItem(name: string) {
    const { addBtn } = this.itemByName(name);
    await addBtn.click();
  }

  async removeItem(name: string) {
    const { removeBtn } = this.itemByName(name);
    await removeBtn.click();
  }

  async openDetailsFromName(name: string) {
    const { nameLink } = this.itemByName(name);
    await nameLink.click();
  }

  async openDetailsFromImage(name: string) {
    const { imageLink } = this.itemByName(name);
    await imageLink.click();
  }

  async selectSort(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortSelect.selectOption(optionValue);
  }

  async getVisibleItemNames(): Promise<string[]> {
    const names = await this.page.locator('.inventory_item_name').allInnerTexts();
    return names.map(s => s.trim());
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count: number) {
    if (count === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }
}
