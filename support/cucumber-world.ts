import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginMethods } from '../pages/login/login.methods';
import { InventoryMethods } from '../pages/inventory/inventory.methods';
import { ProductDetailsMethods } from '../pages/product-details/product-details.methods';
import { CartMethods } from '../pages/cart/cart.methods';
import { CheckoutMethods } from '../pages/checkout/checkout.methods';

export class SauceDemoWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginMethods;
  inventoryPage!: InventoryMethods;
  productDetailsPage!: ProductDetailsMethods;
  cartPage!: CartMethods;
  checkoutPage!: CheckoutMethods;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async initBrowser(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      channel: (process.env.PLAYWRIGHT_CHANNEL as 'chrome' | 'msedge' | undefined) ?? 'msedge',
    });
    this.context = await this.browser.newContext({
      baseURL: 'https://www.saucedemo.com',
    });
    this.page = await this.context.newPage();
    this.loginPage = new LoginMethods(this.page);
    this.inventoryPage = new InventoryMethods(this.page);
    this.productDetailsPage = new ProductDetailsMethods(this.page);
    this.cartPage = new CartMethods(this.page);
    this.checkoutPage = new CheckoutMethods(this.page);
  }

  async disposeBrowser(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(SauceDemoWorld);