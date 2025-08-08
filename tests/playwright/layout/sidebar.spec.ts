import { expect, test } from '@playwright/test';

test.describe('sidebar navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

	test('sidebar home link', async ({ page }) => {
		// Click the home link.
		await page.getByRole('link', { name: 'Home' }).click();

		// Check page URL
		await expect(page).toHaveURL("/");
	});	

	test('sidebar communities link', async ({ page }) => {
		// Click the communities link.
		await page.getByRole('link', { name: 'Communities' }).click();

		// Check page URL
		await expect(page).toHaveURL("/c");
	});

	test('sidebar topics link', async ({ page }) => {
		// Click the topics link.
		await page.getByRole('link', { name: 'Topics' }).click();

		// Check page URL
		await expect(page).toHaveURL("/topics");
	});

	test('sidebar joined communities button', async ({ page }) => {
		// Click the joined communities button.
		await page.getByRole('button', { name: 'Joined Communities' }).click();

		// Check for presence of submenu
		await page.getByTestId("sidebar-joinedcommunities-submenu")
	});

	test('sidebar saved posts link', async ({ page }) => {
		// Click the saved posts link.
		await page.getByRole('link', { name: 'Saved Posts' }).click();

		// Check page URL
		await expect(page).toHaveURL("/posts/saved");
	});
})