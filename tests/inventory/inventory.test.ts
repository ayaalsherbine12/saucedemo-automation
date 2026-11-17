import { test } from '../../support/playwright-fixtures';
import { getLoginTestData } from '../../utilities/login/login.api';
import { getInventoryTestData } from '../../utilities/inventory/inventory.api';

const loginData = getLoginTestData();
const inventoryData = getInventoryTestData();

test.describe('Inventory page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open(loginData.baseUrl);
    await loginPage.login(loginData.credentials.username, loginData.credentials.password);
  });

  test('should add Sauce Labs Fleece Jacket to cart from listing', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(inventoryData.products.fleeceJacket.name);
    await inventoryPage.assertCartBadgeCount(1);
  });
});