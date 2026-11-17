import { test } from '../../support/playwright-fixtures';
import { getLoginTestData } from '../../utilities/login/login.api';
import { getInventoryTestData } from '../../utilities/inventory/inventory.api';
import { getProductDetailsTestData } from '../../utilities/product-details/product-details.api';
import { getCartTestData } from '../../utilities/cart/cart.api';

const loginData = getLoginTestData();
const inventoryData = getInventoryTestData();
const productData = getProductDetailsTestData();
const cartData = getCartTestData();

test.describe('Cart page', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, productDetailsPage }) => {
    await loginPage.open(loginData.baseUrl);
    await loginPage.login(loginData.credentials.username, loginData.credentials.password);
    await inventoryPage.addProductToCart(inventoryData.products.fleeceJacket.name);
    await inventoryPage.openProductDetails(productData.products.onesie.name);
    await productDetailsPage.addToCart();
    await productDetailsPage.backToProducts();
    await inventoryPage.goToCart();
  });

  test('should list cart items with correct names and prices', async ({ cartPage }) => {
    await cartPage.assertProducts(cartData.items);
  });
});