import { test, expect } from '../../support/playwright-fixtures';
import { getLoginTestData } from '../../utilities/login/login.api';

const loginData = getLoginTestData();

test.describe('Login page', () => {
  test('should login with standard user credentials', async ({ page, loginPage }) => {
    await loginPage.open(loginData.baseUrl);
    await loginPage.login(loginData.credentials.username, loginData.credentials.password);
    await loginPage.assertSuccessfulLogin(loginData.messages.inventoryTitle);
    await expect(page).toHaveURL(/inventory\.html/);
  });
});