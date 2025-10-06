import { test as base } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/cart.page';
import { LoginPage } from '../pages/LoginPage';
import { ProductDetailsPage } from '../pages/productDetailsPage';

type POM = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  productDetailsPage: ProductDetailsPage;
};

export const test = base.extend<POM>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  productDetailsPage: async ({ page }, use) => { await use(new ProductDetailsPage(page)); },
});

export { expect } from '@playwright/test';
