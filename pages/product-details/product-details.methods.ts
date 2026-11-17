import { expect, Page } from '@playwright/test';
import { ProductDetailsElements } from './product-details.elements';

export class ProductDetailsMethods {
  constructor(private readonly page: Page) {}

  async assertProductDetails(name: string, price: string): Promise<void> {
    await expect(this.page.locator(ProductDetailsElements.productName)).toHaveText(name);
    await expect(this.page.locator(ProductDetailsElements.productPrice)).toHaveText(price);
  }

  async addToCart(): Promise<void> {
    await expect(this.page.locator(ProductDetailsElements.productName)).toBeVisible();
    await this.page.locator(ProductDetailsElements.addToCartButton).click();
  }

  async backToProducts(): Promise<void> {
    await this.page.click(ProductDetailsElements.backToProducts);
  }
}