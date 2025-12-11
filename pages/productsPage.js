class ProductsPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.inventoryContainer = page.locator('.inventory_container');
        this.inventoryItems = page.locator('.inventory_item');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    }

    async isLoaded() {
        await this.title.waitFor({ state: 'visible' });
        return await this.inventoryContainer.isVisible();
    }

    async getTitle() {
        return await this.title.textContent();
    }

    async addToCartByName(productName) {
        const product = this.inventoryItems.filter({
            has: this.page.getByRole('link', { name: productName })
        }).first();
        await product.scrollIntoViewIfNeeded();
        const addButton = product.getByRole('button', { name: 'Add to cart' });
        await addButton.waitFor({ state: 'visible' });
        await addButton.click();
    }

    async addToCartByIndex(index) {
        const item = this.inventoryItems.nth(index);
        await item.scrollIntoViewIfNeeded();
        const addButton = item.getByRole('button', { name: 'Add to cart' });
        await addButton.waitFor({ state: 'visible' });
        await addButton.click();
    }

    async removeFromCartByName(productName) {
        const product = this.inventoryItems.filter({
            has: this.page.getByRole('link', { name: productName })
        }).first();
        await product.scrollIntoViewIfNeeded();
        const removeButton = product.getByRole('button', { name: 'Remove' });
        await removeButton.waitFor({ state: 'visible' });
        await removeButton.click();
    }

    async getCartBadgeCount() {
        if (await this.shoppingCartBadge.isVisible()) {
            return await this.shoppingCartBadge.textContent();
        }
        return '0';
    }

    async goToCart() {
        await this.shoppingCartLink.click();
    }

    async logout() {
        await this.menuButton.click();
        await this.logoutLink.click();
    }

    async sortProducts(option) {
        await this.sortDropdown.selectOption(option);
    }

    async getProductCount() {
        return await this.inventoryItems.count();
    }

    async getButtonTextByProductName(productName) {
        const product = this.inventoryItems.filter({
            has: this.page.getByRole('link', { name: productName })
        }).first();
        const button = product.locator('button');
        return await button.textContent();
    }
}

module.exports = { ProductsPage };
