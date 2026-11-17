import { After, AfterAll, Before, BeforeAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { SauceDemoWorld } from '../support/cucumber-world';

setDefaultTimeout(60_000);

BeforeAll(async function () {
  // Global hook: reserved for one-time setup (e.g. Allure environment properties).
});

Before(async function (this: SauceDemoWorld) {
  await this.initBrowser();
});

After(async function (this: SauceDemoWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const safeName = scenario.pickle.name.replace(/\W+/g, '_');
    await this.page.screenshot({
      path: `allure-results/screenshot-${safeName}.png`,
      fullPage: true,
    });
  }
  await this.disposeBrowser();
});

AfterAll(async function () {
  // Global hook: reserved for teardown after the full suite.
});