# Lab08 task - Playwright Test Automation Suite

## 📋 Overview

This is a comprehensive automated test suite for Lab08 task (https://www.saucedemo.com/) built with Playwright and JavaScript. The project implements the Page Object Model (POM) design pattern and includes both positive and negative test scenarios for:
   ● Login functionality
   ● Adding products to the cart 
   ● Completing checkout 

## 🔍 Key Features

✅ **Page Object Model** - Clean, maintainable code structure  
✅ **Comprehensive Test Coverage** - Positive and negative scenarios  
✅ **Multiple Browsers** - Test across Chromium, Firefox, and WebKit  
✅ **HTML Reports** - Detailed test reports  
✅ **Screenshots on Failure** - Visual debugging aid  
✅ **Videos on Failure** - Full test execution recording  
✅ **CI/CD Integration** - GitHub Actions workflow included  
✅ **Parallel Execution** - Fast test execution  
✅ **Retry Mechanism** - Handles flaky tests in CI 

## 🎯 Test Coverage

The test suite covers the following tests:

### 1. Login Tests (`tests/login.spec.js`)
- ✅ Successful login with valid credentials (multiple users)
- ✅ Login failures with invalid credentials
- ✅ Login failures with empty fields
- ✅ Locked out user scenario
- ✅ Error message handling

### 2. Add to Cart Tests (`tests/cart.spec.js`)

**Positive Tests:**
- ✅ Adding single/multiple products to cart
- ✅ Adding all products to cart by index
- ✅ Displaying correct items in cart
- ✅ Removing products from cart (products and cart pages)
- ✅ Removing products in different orders (reverse, middle)
- ✅ Remove and re-add product functionality
- ✅ Continue shopping functionality
- ✅ Cart persistence during navigation

**Negative Tests:**
- ✅ Empty cart handling
- ✅ Cart badge updates after removal
- ✅ Cart persistence validation across navigation
- ✅ Removal from products page reflects in cart page

**Edge Cases:**
- ✅ Multi-page navigation persistence
- ✅ Button state transitions (Add to cart ↔ Remove)

### 3. Checkout Tests (`tests/checkout.spec.js`)
- ✅ Complete checkout flow with valid information
- ✅ Navigation through checkout steps
- ✅ Price calculation verification
- ✅ Checkout validation errors (empty fields)
- ✅ Cancel checkout functionality

### 4. End-to-End Tests (`tests/e2e.spec.js`)
- ✅ End-to-end user journey (login → add to cart → checkout)

## 🏗️ Project Structure

```
saucedemo-playwright-tests/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI/CD workflow
├── pages/                          # Page Object Model classes
│   ├── LoginPage.js               # Login page objects and methods
│   ├── ProductsPage.js            # Products page objects and methods
│   ├── CartPage.js                # Cart page objects and methods
│   └── CheckoutPage.js            # Checkout page objects and methods
├── data/                         # Shared test data
│   ├── users.js                  # Centralized test user credentials
│   ├── products.js               # Centralized product names and sets
│   └── checkout.js               # Centralized checkout customer information
├── tests/                        # Test specifications
│   ├── login.spec.js             # Login test scenarios
│   ├── cart.spec.js              # Cart test scenarios
│   ├── checkout.spec.js          # Checkout test scenarios
│   └── e2e.spec.js               # End-to-end user journey
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies and scripts
├── playwright.config.js          # Playwright configuration
└── README.md                     # This file
```
## 🚀 Getting Started

### Prerequisites
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

### Installation

1. Extract the ZIP file to your desired location

2. Navigate to the project directory:
   bash: cd saucedemo-playwright-tests

3. Install dependencies:
   bash: npm install

4. Install Playwright browsers:
   bash: npx playwright install

## 🧪 Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

### Run tests in UI mode (interactive):
```bash
npm run test:ui
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run tests on specific browser:
```bash
npm run test:chrome     # Chromium only
npm run test:firefox    # Firefox only
npm run test:webkit     # WebKit only
```

### Run specific test file:
```bash
npx playwright test tests/login.spec.js
npx playwright test tests/cart.spec.js
npx playwright test tests/checkout.spec.js
```

## 📊 Test Reports

### View HTML Report:
After running tests, view the detailed HTML report:
```bash
npm run report
```

The HTML report includes:
- Test execution summary
- Screenshots for failed tests
- Videos for failed tests (if enabled)
- Detailed execution traces
- Performance metrics

### Report Locations:
- **HTML Report:** `playwright-report/index.html`
- **Test Results (JSON):** `test-results.json`
- **Screenshots:** `test-results/**/*.png`
- **Videos:** `test-results/**/*.webm`

## 🎨 Page Object Model (POM) Architecture

The project uses the Page Object Model design pattern for maintainability and reusability:

### LoginPage (`pages/LoginPage.js`)
- Encapsulates login page elements and actions
- Methods: `goto()`, `login()`, `getErrorMessage()`, etc.

### ProductsPage (`pages/ProductsPage.js`)
- Manages product inventory interactions
- Methods: `addToCartByName()`, `removeFromCart()`, `goToCart()`, etc.

### CartPage (`pages/CartPage.js`)
- Handles shopping cart operations
- Methods: `getCartItemsCount()`, `removeItem()`, `proceedToCheckout()`, etc.

### CheckoutPage (`pages/CheckoutPage.js`)
- Manages checkout flow
- Methods: `fillCheckoutInformation()`, `finishCheckout()`, etc.

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)

Key settings:
- **Base URL:** https://www.saucedemo.com
- **Timeout:** 45 seconds per test
- **Expect Timeout:** 8 seconds
- **Action Timeout:** 15 seconds
- **Navigation Timeout:** 15 seconds
- **Viewport:** 1366x768
- **Local SlowMo:** 50ms (disabled in CI)
- **Retries:** 2 retries in CI, 0 locally
- **Browsers:** Chromium, Firefox, WebKit
- **Screenshot:** Captured on failure
- **Video:** Retained on failure
- **Trace:** Captured on first retry

### Workflow file location:
`.github/workflows/playwright.yml`

### Viewing CI Results:
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select a workflow run
4. Download artifacts (reports, screenshots) if needed

### Test Data
The tests use the following credentials provided by Sauce Demo:
- **Standard User:** `standard_user` / `secret_sauce`
- **Locked Out User:** `locked_out_user` / `secret_sauce`
- **Problem User:** `problem_user` / `secret_sauce`
- **Performance Glitch User:** `performance_glitch_user` / `secret_sauce`

## 📦 Dependencies

- **@playwright/test:** ^1.40.0 - Core Playwright testing framework 