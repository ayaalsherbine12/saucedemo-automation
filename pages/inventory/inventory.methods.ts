import { expect, Locator, Page } from '@playwright/test';
import { InventoryElements } from './inventory.elements';

export class InventoryMethods {
  constructor(private readonly page: Page) {}

  private itemByProductName(productName: string): Locator {
    return this.page
      .locator(InventoryElements.inventoryItem)
      .filter({ has: this.page.getByText(productName, { exact: true }) });
  }

  async addProductToCart(productName: string): Promise<void> {
    const item = this.itemByProductName(productName);
    await item.locator(InventoryElements.addToCartButton).click();
  }

  async openProductDetails(productName: string): Promise<void> {
    const item = this.itemByProductName(productName);
    await item.locator(InventoryElements.itemName).click();
    await this.page.waitForURL(/inventory-item\.html/);
  }

  async assertCartBadgeCount(expectedCount: number): Promise<void> {
    await expect(this.page.locator(InventoryElements.cartBadge)).toHaveText(String(expectedCount));
  }

  async goToCart(): Promise<void> {
    await this.page.click(InventoryElements.cartLink);
  }
}