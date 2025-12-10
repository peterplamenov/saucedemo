const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const users = require('../data/users');
const { sets } = require('../data/products');
const { customers } = require('../data/checkout');

test.describe('End-to-End Tests', () => {
    test('should complete full user journey from login to checkout', async({ page }) => {
        // This test starts fresh without beforeEach setup
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // Step 1: Login
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        await expect(page).toHaveURL(/.*inventory.html/);

        // Step 2: Add products
        await productsPage.isLoaded();
        for (const productName of sets.trio) {
            await productsPage.addToCartByName(productName);
        }
        const badgeCount = await productsPage.getCartBadgeCount();
        expect(badgeCount).toBe('3');

        // Step 3: Go to cart and verify
        await productsPage.goToCart();
        await cartPage.isLoaded();
        const itemCount = await cartPage.getCartItemsCount();
        expect(itemCount).toBe(3);

        // Step 4: Proceed to checkout
        await cartPage.proceedToCheckout();

        // Step 5: Fill information and complete
        await checkoutPage.fillCheckoutInformation(customers.testUser.firstName, customers.testUser.lastName, customers.testUser.postalCode);
        await checkoutPage.continueToOverview();
        await expect(page.locator('.title')).toHaveText('Checkout: Overview');
        await checkoutPage.finishCheckout();

        // Step 6: Verify success
        await expect(await checkoutPage.isCheckoutComplete()).toBeTruthy();
        const completeHeader = await checkoutPage.getCompleteHeader();
        expect(completeHeader).toContain('Thank you for your order');
    });
});
