import { test } from '../../support/playwright-fixtures';
import { getLoginTestData } from '../../utilities/login/login.api';
import { getInventoryTestData } from '../../utilities/inventory/inventory.api';
import { getProductDetailsTestData } from '../../utilities/product-details/product-details.api';
import {
  fetchCheckoutUserFromApi,
  getCheckoutTestData,
} from '../../utilities/checkout/checkout.api';

const loginData = getLoginTestData();
const inventoryData = getInventoryTestData();
const productData = getProductDetailsTestData();
const checkoutData = getCheckoutTestData();

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ loginPage, inventoryPage, productDetailsPage, cartPage }) => {
    await loginPage.open(loginData.baseUrl);
    await loginPage.login(loginData.credentials.username, loginData.credentials.password);
    await inventoryPage.addProductToCart(inventoryData.products.fleeceJacket.name);
    await inventoryPage.openProductDetails(productData.products.onesie.name);
    await productDetailsPage.addToCart();
    await productDetailsPage.backToProducts();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('should complete purchase using JSONPlaceholder customer data', async ({ checkoutPage }) => {
    const customer = await fetchCheckoutUserFromApi();
    await checkoutPage.fillCustomerInfo(customer);
    await checkoutPage.assertOverview(
      checkoutData.overview.items,
      checkoutData.overview.shippingInformation,
    );
    await checkoutPage.finishOrder();
    await checkoutPage.assertOrderComplete(
      checkoutData.complete.header,
      checkoutData.complete.message,
    );
  });
});