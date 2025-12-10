const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const users = require('../data/users');

test.describe('Login Tests', () => {
    let loginPage;

    test.beforeEach(async({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test.describe('Positive Login Tests', () => {
        test('should login successfully with standard_user', async({ page }) => {
            await loginPage.login(users.standard.username, users.standard.password);
            // Verify successful login by checking URL and page elements
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(page.locator('.title')).toHaveText('Products');
        });

        test('should login successfully with problem_user', async({ page }) => {
            await loginPage.login(users.problem.username, users.problem.password);
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(page.locator('.title')).toHaveText('Products');
        });

        test('should login successfully with performance_glitch_user', async({ page }) => {
            await loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(page.locator('.title')).toHaveText('Products');
        });
    });

    test.describe('Negative Login Tests', () => {
        test('should show error for invalid username', async({ page }) => {
            await loginPage.login(users.invalid.username, users.invalid.password);
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain('Username and password do not match');
        });

        test('should show error for invalid password', async({ page }) => {
            await loginPage.login(users.standard.username, 'wrong_password');
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain('Username and password do not match');
        });

        test('should show error for empty username', async({ page }) => {
            await loginPage.login(users.empty.username, users.standard.password);
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain('Username is required');
        });

        test('should show error for empty password', async({ page }) => {
            await loginPage.login(users.standard.username, users.empty.password);
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain('Password is required');
        });

        test('should show error for both empty fields', async({ page }) => {
            await loginPage.login(users.empty.username, users.empty.password);
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain('Username is required');
        });

        test('should show error for locked_out_user', async({ page }) => {
            await loginPage.login(users.lockedOut.username, users.lockedOut.password);
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            const errorText = await loginPage.getErrorMessage();
            expect(errorText).toContain('this user has been locked out');
        });

        test('should be able to close error message', async({ page }) => {
            await loginPage.login(users.invalid.username, users.invalid.password);
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            await loginPage.closeError();
            await expect(await loginPage.isErrorDisplayed()).toBeFalsy();
        });

        test('should login successfully after closing error message', async({ page }) => {
            // First attempt with invalid credentials
            await loginPage.login(users.invalid.username, users.invalid.password);
            await expect(await loginPage.isErrorDisplayed()).toBeTruthy();
            // Close error message
            await loginPage.closeError();
            await expect(await loginPage.isErrorDisplayed()).toBeFalsy();
            // Login with valid credentials
            await loginPage.login(users.standard.username, users.standard.password);
            // Verify successful login
            await expect(page).toHaveURL(/.*inventory.html/);
            await expect(page.locator('.title')).toHaveText('Products');
        });
    });
});
