import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SauceDemoWorld } from '../support/cucumber-world';
import { getLoginTestData } from '../utilities/login/login.api';
import { getInventoryTestData } from '../utilities/inventory/inventory.api';
import { getProductDetailsTestData } from '../utilities/product-details/product-details.api';
import { getCartTestData } from '../utilities/cart/cart.api';
import {
  fetchCheckoutUserFromApi,
  getCheckoutTestData,
} from '../utilities/checkout/checkout.api';

const loginData = getLoginTestData();
const inventoryData = getInventoryTestData();
const productData = getProductDetailsTestData();
const cartData = getCartTestData();
const checkoutData = getCheckoutTestData();

let checkoutCustomer: Awaited<ReturnType<typeof fetchCheckoutUserFromApi>>;

Given('I am logged in as the standard user', async function (this: SauceDemoWorld) {
  await this.loginPage.open(loginData.baseUrl);
  await this.loginPage.login(loginData.credentials.username, loginData.credentials.password);
  await this.loginPage.assertSuccessfulLogin(loginData.messages.inventoryTitle);
});

When('I add the {string} to the cart from inventory', async function (this: SauceDemoWorld, productName: string) {
  const expectedName =
    productName === inventoryData.products.fleeceJacket.name
      ? inventoryData.products.fleeceJacket.name
      : productName;
  await this.inventoryPage.addProductToCart(expectedName);
});

When(
  'I open the {string} product details and add it to the cart',
  async function (this: SauceDemoWorld, productName: string) {
    const expectedName =
      productName === productData.products.onesie.name ? productData.products.onesie.name : productName;
    await this.inventoryPage.openProductDetails(expectedName);
    await this.productDetailsPage.assertProductDetails(
      productData.products.onesie.name,
      productData.products.onesie.price,
    );
    await this.productDetailsPage.addToCart();
    await this.productDetailsPage.backToProducts();
  },
);

Then('the cart badge should show {int} items', async function (this: SauceDemoWorld, count: number) {
  await this.inventoryPage.assertCartBadgeCount(count);
  expect(count).toBe(cartData.expectedItemCount);
});

When('I open the cart page', async function (this: SauceDemoWorld) {
  await this.inventoryPage.goToCart();
});

Then('the cart should contain the expected products and prices', async function (this: SauceDemoWorld) {
  await this.cartPage.assertProducts(cartData.items);
});

When('I proceed to checkout with JSONPlaceholder customer data', async function (this: SauceDemoWorld) {
  await this.cartPage.proceedToCheckout();
  checkoutCustomer = await fetchCheckoutUserFromApi();
  await this.checkoutPage.fillCustomerInfo(checkoutCustomer);
});

Then('the checkout overview should match the order details', async function (this: SauceDemoWorld) {
  await this.checkoutPage.assertOverview(
    checkoutData.overview.items,
    checkoutData.overview.shippingInformation,
  );
});

When('I finish the purchase', async function (this: SauceDemoWorld) {
  await this.checkoutPage.finishOrder();
});

Then('I should see the order complete confirmation', async function (this: SauceDemoWorld) {
  await this.checkoutPage.assertOrderComplete(
    checkoutData.complete.header,
    checkoutData.complete.message,
  );
});