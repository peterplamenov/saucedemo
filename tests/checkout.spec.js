const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const users = require('../data/users');
const { names } = require('../data/products');
const { customers, invalid } = require('../data/checkout');

test.describe('Checkout Tests', () => {
    let loginPage;
    let productsPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        // Login and add items before each test
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        await productsPage.isLoaded();
        await productsPage.addToCartByName(names.backpack);
        await productsPage.addToCartByName(names.bikeLight);
        await productsPage.goToCart();
        await cartPage.isLoaded();
        await cartPage.proceedToCheckout();
    });

    test.describe('Positive Checkout Tests', () => {
        test('should complete checkout with valid information', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(customers.john.firstName, customers.john.lastName, customers.john.postalCode);
            await checkoutPage.continueToOverview();
            // Verify we're on overview page
            await expect(page.locator('.title')).toHaveText('Checkout: Overview');
            // Verify items are displayed
            const cartItems = await page.locator('.cart_item').count();
            expect(cartItems).toBe(2);
            // Verify price information is displayed
            const subtotal = await checkoutPage.getSubtotal();
            const tax = await checkoutPage.getTax();
            const total = await checkoutPage.getTotal();
            expect(subtotal).toContain('Item total:');
            expect(tax).toContain('Tax:');
            expect(total).toContain('Total:');
            await checkoutPage.finishCheckout();
            // Verify checkout completion
            const completeHeader = await checkoutPage.getCompleteHeader();
            expect(completeHeader).toContain('Thank you for your order');
            await expect(await checkoutPage.isCheckoutComplete()).toBeTruthy();
        });

        test('should navigate back to products after successful checkout', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(customers.jane.firstName, customers.jane.lastName, customers.jane.postalCode);
            await checkoutPage.continueToOverview();
            await checkoutPage.finishCheckout();
            await expect(await checkoutPage.isCheckoutComplete()).toBeTruthy();
            await checkoutPage.backToProducts();
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(await productsPage.isLoaded()).toBeTruthy();
        });

        test('should complete checkout with different valid information', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(customers.alice.firstName, customers.alice.lastName, customers.alice.postalCode);
            await checkoutPage.continueToOverview();
            await checkoutPage.finishCheckout();
            const completeHeader = await checkoutPage.getCompleteHeader();
            expect(completeHeader).toContain('Thank you for your order');
        });
    });

    test.describe('Negative Checkout Tests', () => {
        test('should show error when first name is empty', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(invalid.emptyFirstName.firstName, invalid.emptyFirstName.lastName, invalid.emptyFirstName.postalCode);
            await checkoutPage.continueToOverview();
            await expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await checkoutPage.getErrorMessage();
            expect(errorText).toContain('First Name is required');
        });

        test('should show error when last name is empty', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(invalid.emptyLastName.firstName, invalid.emptyLastName.lastName, invalid.emptyLastName.postalCode);
            await checkoutPage.continueToOverview();
            await expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await checkoutPage.getErrorMessage();
            expect(errorText).toContain('Last Name is required');
        });

        test('should show error when postal code is empty', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(invalid.emptyPostalCode.firstName, invalid.emptyPostalCode.lastName, invalid.emptyPostalCode.postalCode);
            await checkoutPage.continueToOverview();
            await expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await checkoutPage.getErrorMessage();
            expect(errorText).toContain('Postal Code is required');
        });

        test('should show error when all fields are empty', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(invalid.allEmpty.firstName, invalid.allEmpty.lastName, invalid.allEmpty.postalCode);
            await checkoutPage.continueToOverview();
            await expect(await checkoutPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await checkoutPage.getErrorMessage();
            expect(errorText).toContain('First Name is required');
        });

        test('should cancel checkout from information page', async({ page }) => {
            await checkoutPage.cancel();
            await expect(page).toHaveURL(/.*cart.html/);
            await cartPage.isLoaded();
            const itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
        });

        test('should cancel checkout from overview page', async({ page }) => {
            await checkoutPage.fillCheckoutInformation(customers.john.firstName, customers.john.lastName, customers.john.postalCode);
            await checkoutPage.continueToOverview();
            await checkoutPage.cancel();
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(await productsPage.isLoaded()).toBeTruthy();
            // Verify cart still has items after canceling
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
            // Remove products from cart
            await productsPage.removeFromCartByName(names.backpack);
            await productsPage.removeFromCartByName(names.bikeLight);
            const finalBadgeCount = await productsPage.getCartBadgeCount();
            expect(finalBadgeCount).toBe('0');
        });
    });
});
