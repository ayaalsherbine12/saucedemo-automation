import { test } from '../../support/playwright-fixtures';
import { getLoginTestData } from '../../utilities/login/login.api';
import { getProductDetailsTestData } from '../../utilities/product-details/product-details.api';

const loginData = getLoginTestData();
const productData = getProductDetailsTestData();

test.describe('Product details page', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.open(loginData.baseUrl);
    await loginPage.login(loginData.credentials.username, loginData.credentials.password);
    await inventoryPage.openProductDetails(productData.products.onesie.name);
  });

  test('should display product and add Sauce Labs Onesie to cart', async ({
    productDetailsPage,
    inventoryPage,
  }) => {
    const onesie = productData.products.onesie;
    await productDetailsPage.assertProductDetails(onesie.name, onesie.price);
    await productDetailsPage.addToCart();
    await productDetailsPage.backToProducts();
    await inventoryPage.assertCartBadgeCount(1);
  });
});