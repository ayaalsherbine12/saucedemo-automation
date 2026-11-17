import { expect, Page } from '@playwright/test';
import { CartElements } from './cart.elements';

export class CartMethods {
  constructor(private readonly page: Page) {}

  async assertProducts(items: Array<{ name: string; price: string }>): Promise<void> {
    await expect(this.page.locator(CartElements.pageTitle)).toHaveText('Your Cart');
    await expect(this.page.locator(CartElements.cartItem)).toHaveCount(items.length);

    for (const item of items) {
      const row = this.page
        .locator(CartElements.cartItem)
        .filter({ has: this.page.getByText(item.name, { exact: true }) });
      await expect(row.locator(CartElements.itemName)).toHaveText(item.name);
      await expect(row.locator(CartElements.itemPrice)).toHaveText(item.price);
    }
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.click(CartElements.checkoutButton);
  }
}