class CartPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.removeButtons = page.locator('button:has-text("Remove")');
    }

    async isLoaded() {
        await this.title.waitFor({ state: 'visible' });
        return await this.title.isVisible();
    }

    async getCartItemsCount() {
        return await this.cartItems.count();
    }

    async getCartItemNames() {
        const items = await this.cartItems.all();
        const names = [];
        for (const item of items) {
            const name = await item.locator('.inventory_item_name').textContent();
            names.push(name);
        }
        return names;
    }

    async removeItemByName(productName) {
        const item = this.page.locator('.cart_item', {
            has: this.page.locator(`text="${productName}"`)
        });
        const removeButton = item.locator('button:has-text("Remove")');
        await removeButton.click();
    }

    async removeItemByIndex(index) {
        await this.removeButtons.nth(index).click();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }
}

module.exports = { CartPage };
