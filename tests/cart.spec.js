const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');
const { CartPage } = require('../pages/cartPage');
const users = require('../data/users');
const { names, sets } = require('../data/products');

test.describe('Add to Cart Tests', () => {
    let loginPage;
    let productsPage;
    let cartPage;

    test.beforeEach(async({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        // Login before each test
        await loginPage.goto();
        await loginPage.login(users.standard.username, users.standard.password);
        await productsPage.isLoaded();
    });

    test.describe('Positive Add to Cart Tests', () => {
        test('should add a single product to cart', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('1');
        });

        test('should add multiple products to cart', async({ page }) => {
            for (const productName of sets.trio) {
                await productsPage.addToCartByName(productName);
            }
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('3');
        });

        test('should add all products to cart', async({ page }) => {
            const productCount = await productsPage.getProductCount();
            for (let p = 0; p < productCount; p++) {
                await productsPage.addToCartByIndex(p);
            }
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe(productCount.toString());
        });

        test('should display correct items in cart', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            await productsPage.goToCart();
            await cartPage.isLoaded();
            const itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
            const itemNames = await cartPage.getCartItemNames();
            expect(itemNames).toContain(names.backpack);
            expect(itemNames).toContain(names.bikeLight);
        });

        test('should remove product from cart on products page', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            let badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
            await productsPage.removeFromCartByName(names.backpack);
            badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('1');
        });

        test('should remove product from cart on cart page', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            await productsPage.goToCart();
            await cartPage.isLoaded();
            let itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
            await cartPage.removeItemByName(names.backpack);
            itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(1);
            const itemNames = await cartPage.getCartItemNames();
            expect(itemNames).not.toContain(names.backpack);
            expect(itemNames).toContain(names.bikeLight);
        });

        test('should continue shopping from cart', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.goToCart();
            await cartPage.isLoaded();
            await cartPage.continueShopping();
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(await productsPage.isLoaded()).toBeTruthy();
        });

        test('should add products by index and verify order', async({ page }) => {
            await productsPage.addToCartByIndex(0);
            await productsPage.addToCartByIndex(2);
            await productsPage.addToCartByIndex(4);
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('3');
            await productsPage.goToCart();
            await cartPage.isLoaded();
            const itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(3);
        });

        test('should maintain cart when navigating between product and cart pages', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            let badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
            await productsPage.goToCart();
            await cartPage.isLoaded();
            await cartPage.continueShopping();
            await productsPage.isLoaded();
            badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
        });

        test('should remove and re-add product successfully', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            let badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('1');
            await productsPage.removeFromCartByName(names.backpack);
            badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('0');
            await productsPage.addToCartByName(names.backpack);
            badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('1');
        });

        test('should remove middle product from cart', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            await productsPage.addToCartByName(names.boltShirt);
            await productsPage.goToCart();
            await cartPage.isLoaded();
            let itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(3);
            await cartPage.removeItemByName(names.bikeLight);
            itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
            const itemNames = await cartPage.getCartItemNames();
            expect(itemNames).toContain(names.backpack);
            expect(itemNames).not.toContain(names.bikeLight);
            expect(itemNames).toContain(names.boltShirt);
        });

        test('should remove products in reverse order', async({ page }) => {
            const products = [names.backpack, names.bikeLight, names.boltShirt];
            for (const product of products) {
                await productsPage.addToCartByName(product);
            }
            let badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('3');
            for (let p = products.length - 1; p >= 0; p--) {
                await productsPage.removeFromCartByName(products[p]);
            }
            badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('0');
        });
    });

    test.describe('Negative Cart Tests', () => {
        test('should handle empty cart', async({ page }) => {
            await productsPage.goToCart();
            await cartPage.isLoaded();
            const itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(0);
        });

        test('should update cart badge when all items removed from product page', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            await productsPage.removeFromCartByName(names.backpack);
            await productsPage.removeFromCartByName(names.bikeLight);
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('0');
        });

        test('should remove all products and verify empty cart page', async({ page }) => {
            for (const productName of sets.trio) {
                await productsPage.addToCartByName(productName);
            }
            await productsPage.goToCart();
            await cartPage.isLoaded();
            const itemNames = await cartPage.getCartItemNames();
            for (const itemName of itemNames) {
                await cartPage.removeItemByName(itemName);
            }
            const itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(0);
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('0');
        });

        test('should verify cart persists after navigation', async({ page }) => {
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
            // Navigate to cart
            await productsPage.goToCart();
            await cartPage.isLoaded();
            // Go back to products
            await cartPage.continueShopping();
            await productsPage.isLoaded();
            // Navigate to cart again
            await productsPage.goToCart();
            await cartPage.isLoaded();
            const itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
            const itemNames = await cartPage.getCartItemNames();
            expect(itemNames).toContain(names.backpack);
            expect(itemNames).toContain(names.bikeLight);
        });

        test('should verify removal from products page reflects in cart page', async({ page }) => {
            // Add three products
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            await productsPage.addToCartByName(names.boltShirt);
            let badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('3');
            // Remove one from products page
            await productsPage.removeFromCartByName(names.bikeLight);
            badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
            // Navigate to cart and verify it's gone
            await productsPage.goToCart();
            await cartPage.isLoaded();
            const itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
            const itemNames = await cartPage.getCartItemNames();
            expect(itemNames).toContain(names.backpack);
            expect(itemNames).not.toContain(names.bikeLight);
            expect(itemNames).toContain(names.boltShirt);
        });
    });

    test.describe('Edge Cases', () => {
        test('should persist cart when navigating away and back', async({ page }) => {
            // Add products
            await productsPage.addToCartByName(names.backpack);
            await productsPage.addToCartByName(names.bikeLight);
            let badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
            // Navigate to cart
            await productsPage.goToCart();
            await cartPage.isLoaded();
            let itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
            // Navigate back to products
            await cartPage.continueShopping();
            await productsPage.isLoaded();
            // Verify cart still has items
            badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('2');
            // Navigate to cart again
            await productsPage.goToCart();
            await cartPage.isLoaded();
            itemCount = await cartPage.getCartItemsCount();
            expect(itemCount).toBe(2);
            const itemNames = await cartPage.getCartItemNames();
            expect(itemNames).toContain(names.backpack);
            expect(itemNames).toContain(names.bikeLight);
        });

        test('should change button from Remove back to Add to cart after removal', async({ page }) => {
            // Add product
            await productsPage.addToCartByName(names.backpack);
            // Verify button shows "Remove"
            let buttonText = await productsPage.getButtonTextByProductName(names.backpack);
            expect(buttonText).toBe('Remove');
            // Remove product
            await productsPage.removeFromCartByName(names.backpack);
            // Verify button changes back to "Add to cart"
            buttonText = await productsPage.getButtonTextByProductName(names.backpack);
            expect(buttonText).toBe('Add to cart');
            // Verify badge is 0
            const badgeCount = await productsPage.getCartBadgeCount();
            expect(badgeCount).toBe('0');
        });
    });
});
