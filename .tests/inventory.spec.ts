import { test, expect } from '../fixtures/pom-fixture';


const USERNAME: string = process.env.USERNAME ?? '';
const PASSWORD: string = process.env.PASSWORD ?? '';

test.describe('Inventory behaviors', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();              
    await loginPage.login(USERNAME, PASSWORD);
    await inventoryPage.assertLoaded();
  });

  // Test A: Add/remove updates cart badge and cart contents
   test('Add to cart and remove updates cart badge', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItem('Sauce Labs Backpack');
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.addItem('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeCount(2);

    await inventoryPage.goToCart();
    await cartPage.assertOnCart();
    await cartPage.expectItemVisible('Sauce Labs Backpack');
    await cartPage.expectItemVisible('Sauce Labs Bike Light');

    await cartPage.continueShopping();
    await inventoryPage.assertLoaded();
    await inventoryPage.removeItem('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadgeCount(1);
  });

  // Test B: Sort order A->Z and Z->A
  test('Sort by name A-Z and Z-A', async ({ inventoryPage }) => {
    await inventoryPage.selectSort('az');
    const namesAZ = await inventoryPage.getVisibleItemNames();
    const sortedAZ = [...namesAZ].sort((a, b) => a.localeCompare(b));
    expect(namesAZ).toEqual(sortedAZ);

    await inventoryPage.selectSort('za');
    const namesZA = await inventoryPage.getVisibleItemNames();
    const sortedZA = [...namesZA].sort((a, b) => b.localeCompare(a));
    expect(namesZA).toEqual(sortedZA);
  });

  // Test C: Navigate to product details via name and image, then back
  test('Product details navigation from name and image', async ({ inventoryPage, productDetailsPage }) => {
    await inventoryPage.openDetailsFromName('Sauce Labs Backpack');
    await productDetailsPage.assertOnDetails();
    await productDetailsPage.backToInventory();
    await inventoryPage.assertLoaded();

    await inventoryPage.openDetailsFromImage('Sauce Labs Backpack');
    await productDetailsPage.assertOnDetails();
    await productDetailsPage.backToInventory();
    await inventoryPage.assertLoaded();
  });
});
