import { test } from '../../support/playwright-fixtures';
import { getLoginTestData } from '../../utilities/login/login.api';
import { getInventoryTestData } from '../../utilities/inventory/inventory.api';
import { getProductDetailsTestData } from '../../utilities/product-details/product-details.api';
import { getCartTestData } from '../../utilities/cart/cart.api';
import {
  fetchCheckoutUserFromApi,
  getCheckoutTestData,
} from '../../utilities/checkout/checkout.api';

const loginData = getLoginTestData();
const inventoryData = getInventoryTestData();
const productData = getProductDetailsTestData();
const cartData = getCartTestData();
const checkoutData = getCheckoutTestData();

test.describe('SauceDemo purchase journey (steps 4–11)', () => {
  test('standard user completes checkout with two products', async ({
    loginPage,
    inventoryPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
  }) => {
    await loginPage.open(loginData.baseUrl);
    await loginPage.login(loginData.credentials.username, loginData.credentials.password);
    await loginPage.assertSuccessfulLogin(loginData.messages.inventoryTitle);

    await inventoryPage.addProductToCart(inventoryData.products.fleeceJacket.name);
    await inventoryPage.openProductDetails(productData.products.onesie.name);
    await productDetailsPage.assertProductDetails(
      productData.products.onesie.name,
      productData.products.onesie.price,
    );
    await productDetailsPage.addToCart();
    await productDetailsPage.backToProducts();

    await inventoryPage.assertCartBadgeCount(cartData.expectedItemCount);
    await inventoryPage.goToCart();
    await cartPage.assertProducts(cartData.items);

    await cartPage.proceedToCheckout();
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