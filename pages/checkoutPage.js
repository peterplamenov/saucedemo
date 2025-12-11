class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.title = page.locator('.title');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.completeHeader = page.locator('.complete-header');
        this.completeText = page.locator('.complete-text');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
        this.summarySubtotal = page.locator('.summary_subtotal_label');
        this.summaryTax = page.locator('.summary_tax_label');
        this.summaryTotal = page.locator('.summary_total_label');
    }

    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continueToOverview() {
        await this.continueButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    async isErrorDisplayed() {
        return await this.errorMessage.isVisible();
    }

    async getCompleteHeader() {
        return await this.completeHeader.textContent();
    }

    async getCompleteText() {
        return await this.completeText.textContent();
    }

    async isCheckoutComplete() {
        return await this.completeHeader.isVisible();
    }

    async getSubtotal() {
        return await this.summarySubtotal.textContent();
    }

    async getTax() {
        return await this.summaryTax.textContent();
    }

    async getTotal() {
        return await this.summaryTotal.textContent();
    }

    async backToProducts() {
        await this.backHomeButton.click();
    }
}

module.exports = { CheckoutPage };
