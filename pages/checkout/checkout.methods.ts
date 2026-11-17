import { expect, Page } from '@playwright/test';
import { CheckoutElements } from './checkout.elements';

export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutMethods {
  constructor(private readonly page: Page) {}

  async fillCustomerInfo(customer: CheckoutCustomer): Promise<void> {
    await this.page.fill(CheckoutElements.firstNameInput, customer.firstName);
    await this.page.fill(CheckoutElements.lastNameInput, customer.lastName);
    await this.page.fill(CheckoutElements.postalCodeInput, customer.postalCode);
    await this.page.click(CheckoutElements.continueButton);
  }

  async assertOverview(
    items: Array<{ name: string; price: string }>,
    shippingInformation: string,
  ): Promise<void> {
    await expect(this.page.locator(CheckoutElements.overviewTitle)).toHaveText('Checkout: Overview');
    await expect(this.page.locator(CheckoutElements.overviewItem)).toHaveCount(items.length);

    for (const item of items) {
      const row = this.page
        .locator(CheckoutElements.overviewItem)
        .filter({ has: this.page.getByText(item.name, { exact: true }) });
      await expect(row.locator(CheckoutElements.overviewItemName)).toHaveText(item.name);
      await expect(row.locator(CheckoutElements.overviewItemPrice)).toHaveText(item.price);
    }

    await expect(this.page.locator(CheckoutElements.shippingInfo)).toContainText(shippingInformation);
    await expect(this.page.locator(CheckoutElements.summarySubtotal)).toBeVisible();
    await expect(this.page.locator(CheckoutElements.summaryTax)).toBeVisible();
    await expect(this.page.locator(CheckoutElements.summaryTotal)).toBeVisible();
  }

  async finishOrder(): Promise<void> {
    await this.page.click(CheckoutElements.finishButton);
  }

  async assertOrderComplete(header: string, message: string): Promise<void> {
    await expect(this.page.locator(CheckoutElements.completeHeader)).toHaveText(header);
    await expect(this.page.locator(CheckoutElements.completeText)).toContainText(message);
  }
}