import { test as base } from '@playwright/test';
import { LoginMethods } from '../pages/login/login.methods';
import { InventoryMethods } from '../pages/inventory/inventory.methods';
import { ProductDetailsMethods } from '../pages/product-details/product-details.methods';
import { CartMethods } from '../pages/cart/cart.methods';
import { CheckoutMethods } from '../pages/checkout/checkout.methods';

type PageObjects = {
  loginPage: LoginMethods;
  inventoryPage: InventoryMethods;
  productDetailsPage: ProductDetailsMethods;
  cartPage: CartMethods;
  checkoutPage: CheckoutMethods;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginMethods(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryMethods(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsMethods(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartMethods(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutMethods(page));
  },
});

export { expect } from '@playwright/test';