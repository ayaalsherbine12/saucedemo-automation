# SauceDemo automation

Playwright + TypeScript automation for [SauceDemo](https://www.saucedemo.com/) using a **Page Object Model**, per-page JSON test data, per-page utilities, **Cucumber hooks**, and **Allure** reporting.

## Project structure

```
pages/                    # POM: elements + methods per page
  login/
  inventory/
  product-details/
  cart/
  checkout/
tests/                    # One test module per page + full E2E journey
testData/                 # JSON per page
utilities/                # Data/API helpers per page
features/                 # Cucumber BDD scenarios
step-definitions/
hooks/                    # Cucumber @Before / @After hooks
support/                  # Playwright fixtures + Cucumber World
```

## Technical decisions

| Decision | Rationale |
|----------|-----------|
| **Playwright** | Stable auto-waiting, fast execution, built-in tracing/video on failure. |
| **Split POM** (`*.elements.ts` + `*.methods.ts`) | Locators stay separate from actions/assertions for easier maintenance when UI changes. |
| **JSON test data per page** | Non-developers can update credentials, product names, and expected values without touching code. |
| **`utilities/*/ *.api.ts`** | Single place to load JSON and call external APIs (JSONPlaceholder for checkout). |
| **Playwright tests + Cucumber** | Page-level tests give fast feedback; the feature file documents the assignment journey for stakeholders. |
| **Allure** | Unified HTML reports for both Playwright and Cucumber runs. |

## Assumptions

- Standard user credentials: `standard_user` / `secret_sauce` (SauceDemo demo data).
- Product prices match the public SauceDemo catalog ($49.99 fleece, $7.99 onesie).
- JSONPlaceholder user `id=1` (`Leanne Graham`, zip `92998-3874`) is used for checkout fields.
- First/last name are derived by splitting the API `name` field on whitespace.

## Limitations

- SauceDemo is a demo site; availability and pricing can change without notice.
- JSONPlaceholder is a public mock API (network required; no SLA).
- Cucumber and Playwright suites both write to `allure-results/`; run `allure generate` after a test run for a combined report.
- Allure CLI requires a Java runtime (`allure-commandline`).

## Prerequisites

- Node.js 18+
- Java (for Allure report generation)

## Setup

```bash
npm install

```bash
npm run browsers:install
```

## Run tests

```bash
# Full Playwright suite (page tests + E2E journey)
npm run test:e2e

# Cucumber scenario (with hooks)
npm run test:cucumber

```

## npm scripts

| Script | Description |
|--------|-------------|
| `npm test` | Playwright E2E suite, then Cucumber |
| `npm run test:e2e` | Playwright tests under `tests/` |
| `npm run test:cucumber` | Cucumber features (`features/`) with hooks |
| `npm run test:allure` | `test:e2e`, then generate Allure HTML report |
| `npm run allure:generate` | Build `allure-report/` from `allure-results/` |
| `npm run allure:open` | Open the generated report in the browser |
| `npm run allure:share` | Generate HTML, then serve `allure-report/` on LAN (port 8080) |
| `npm run allure:pack` | Generate HTML and zip `allure-report/` → `allure-report-share.zip` |
| `npm run allure:clean` | Remove `allure-results/` and `allure-report/` |
| `npm run browsers:install` | Install Playwright’s Chromium (optional if using Edge/Chrome channel) |

## Allure report

```bash
npm run test:allure
npm run allure:open
```

Or generate manually (clear old results first so the report does not show stale failures):

```bash
npm run allure:clean
npm run test:e2e
npm run allure:generate
npm run allure:open
```

To start fresh before a new run (clears raw results and the last HTML report):

```bash
npm run allure:clean
```

**Share on the network** (generates `allure-report/`, then serves static HTML — required because Allure 2.32+ blocks `allure serve -h 0.0.0.0`):

```bash
npm run allure:share
```

Custom port: `set ALLURE_SHARE_PORT=9090&& npm run allure:share` (PowerShell: `$env:ALLURE_SHARE_PORT=9090; npm run allure:share`).

**Share as a file** (email, Teams, etc.):

```bash
npm run allure:pack
```

Unzip `allure-report-share.zip` and open `index.html` in a browser.

## Assignment mapping (steps 4–11)

| Step | Implementation |
|------|----------------|
| 4 Login | `pages/login`, `tests/login`, `tests/e2e` |
| 5 Add fleece jacket | `pages/inventory`, `tests/inventory` |
| 6 Onesie via PDP | `pages/product-details` |
| 7 Cart badge = 2 | `InventoryMethods.assertCartBadgeCount` |
| 8 Cart names/prices | `pages/cart`, `testData/cart/cart.json` |
| 9 Checkout + API data | `utilities/checkout/checkout.api.ts` → JSONPlaceholder |
| 10 Overview assertions | `CheckoutMethods.assertOverview` |
| 11 Finish + complete page | `CheckoutMethods.finishOrder` / `assertOrderComplete` |