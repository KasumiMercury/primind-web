import type { Page } from "@playwright/test";
import { expect, test } from "../fixtures/error-injection";

test.describe("Task Error Handling", () => {
    async function authenticate(page: Page) {
        // Click the login button in the Login Required alert
        await page.click('button:has-text("Login")');

        // Wait for the login dialog to appear
        await expect(
            page.locator('[data-slot="dialog-overlay"]').first(),
        ).toBeVisible({
            timeout: 5000,
        });

        // Click Sign in with Google and wait for navigation
        const responsePromise = page.waitForResponse(
            (response) => response.url().includes("/callback/google"),
            { timeout: 15000 },
        );
        await page.click('button:has-text("Sign in with Google")');

        // Wait for the callback response (indicates auth flow completed)
        await responsePromise;

        // Wait for navigation to complete
        await page.waitForLoadState("networkidle");

        // Close all remaining dialogs by clicking close buttons
        for (let i = 0; i < 5; i++) {
            const dialogOverlays = page.locator('[data-slot="dialog-overlay"]');
            const dialogCount = await dialogOverlays.count();
            if (dialogCount === 0) break;

            // Find close button in any visible dialog content
            const closeButton = page.locator(
                '[data-slot="dialog-content"] [data-slot="dialog-close"]',
            );
            if ((await closeButton.count()) > 0) {
                await closeButton.first().click({ force: true });
            } else {
                // Fallback: press Escape
                await page.keyboard.press("Escape");
            }
            await page.waitForTimeout(300);
        }

        // Wait for authentication to complete (Login Required should disappear)
        await expect(page.locator('text="Login Required"')).not.toBeVisible({
            timeout: 5000,
        });
    }

    test.beforeEach(async ({ page, setErrorMode: _ }) => {
        // Ensure mock error header is set before navigation
        await page.goto("/");
    });

    test("displays error feedback when task creation fails", async ({
        page,
        setErrorMode,
    }) => {
        await authenticate(page);

        await setErrorMode("task.create.fail");

        const operationArea = page.locator(".fixed.inset-x-0.bottom-0");
        const centerButton = operationArea.locator("button").nth(1);
        await centerButton.click();

        await expect(
            page.locator("[data-sonner-toast][data-type='error']").first(),
        ).toHaveAttribute("data-visible", "true", { timeout: 5000 });
    });

    test("displays error feedback when task update fails", async ({
        page,
        setErrorMode,
    }) => {
        await authenticate(page);

        const operationArea = page.locator(".fixed.inset-x-0.bottom-0");
        const centerButton = operationArea.locator("button").nth(1);
        await centerButton.click();

        // Wait for Quick Edit dialog to appear and stabilize
        const dialog = page.locator('[data-slot="dialog-content"]');
        await expect(dialog).toBeVisible({ timeout: 5000 });
        await page.waitForLoadState("networkidle");

        // Click on "Title" field add button to start editing
        const titleButton = dialog.locator('button[aria-label="Title"]');
        await expect(titleButton).toBeVisible({ timeout: 5000 });
        await titleButton.scrollIntoViewIfNeeded();
        await titleButton.click();

        // Wait for title input to appear (indicates edit mode started)
        const titleInput = dialog.getByRole("textbox").first();
        await expect(titleInput).toBeVisible({ timeout: 5000 });

        // Fill title first, then set error mode, then click save
        await titleInput.fill("Test Task");

        await setErrorMode("task.update.fail");
        // Ensure network is idle before making the error-triggering request
        await page.waitForLoadState("networkidle");

        // Submit the form by clicking Save button
        const saveButton = dialog.getByRole("button", { name: "Save" });
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Wait for the error indicator to appear
        const errorIndicator = dialog.locator("text=Failed");
        await expect(errorIndicator).toBeVisible({ timeout: 10000 });
    });

    test("displays error in delete dialog when delete fails", async ({
        page,
        setErrorMode,
    }) => {
        await authenticate(page);

        // Create a task by clicking the center button
        const operationArea = page.locator(".fixed.inset-x-0.bottom-0");
        const centerButton = operationArea.locator("button").nth(1);
        await centerButton.click();

        const dialog = page.locator('[data-slot="dialog-content"]').first();
        await expect(dialog).toBeVisible({ timeout: 5000 });

        // Set error mode for delete operation before confirming delete
        await setErrorMode("task.delete.fail");

        // Open delete confirmation from Quick Edit dialog
        const deleteButton = dialog.locator('[aria-label="Delete Task"]');
        await expect(deleteButton).toBeVisible({ timeout: 5000 });
        await deleteButton.click();

        // Click confirm delete button inside the confirmation dialog
        const deleteDialog = page
            .locator('[data-slot="dialog-content"]')
            .filter({ hasText: "Delete Task" });
        const confirmButton = deleteDialog.getByRole("button", {
            name: "Delete",
        });
        await confirmButton.click();

        // Expect error message to appear in the dialog
        await expect(page.locator(".bg-red-50, .bg-red-950")).toBeVisible({
            timeout: 5000,
        });
    });
});
