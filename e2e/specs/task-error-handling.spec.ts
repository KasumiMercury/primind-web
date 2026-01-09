import type { Page } from "@playwright/test";
import { Code, expect, test } from "../fixtures";

test.describe("Task Error Handling", () => {
    async function authenticate(page: Page) {
        // Wait for the Login Required alert to be visible and stable
        const loginButton = page.locator('button:has-text("Login")');
        await expect(loginButton.first()).toBeVisible({ timeout: 10000 });

        // Click the login button in the Login Required alert
        await loginButton.first().click();

        // Wait for the login dialog to appear
        const dialogOverlay = page
            .locator('[data-slot="dialog-overlay"]')
            .first();
        await expect(dialogOverlay).toBeVisible({
            timeout: 10000,
        });

        // Click Sign in with Google and wait for navigation
        const responsePromise = page.waitForResponse(
            (response) => response.url().includes("/callback/google"),
            { timeout: 15000 },
        );
        await page.click('button:has-text("Log in with Google")');

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

    test.beforeEach(async ({ page, mockApi: _ }) => {
        // mockApi fixture is destructured to ensure headers are set before navigation
        await page.goto("/");
        // Wait for page to be fully loaded and interactive
        await page.waitForLoadState("networkidle");
    });

    test("displays error feedback when task creation fails", async ({
        page,
        mockApi,
    }) => {
        await authenticate(page);

        await mockApi.task.mockCreateTaskError(
            Code.Internal,
            "Failed to create task: internal server error",
        );

        const operationArea = page.locator(".fixed.inset-x-0.bottom-0");
        const centerButton = operationArea.locator("button").nth(1);
        await centerButton.click();

        await expect(
            page.locator("[data-sonner-toast][data-type='error']").first(),
        ).toHaveAttribute("data-visible", "true", { timeout: 5000 });
    });

    test("displays error feedback when task update fails", async ({
        page,
        mockApi,
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

        // Fill title first, then set error mock, then click save
        await titleInput.fill("Test Task");

        await mockApi.task.mockUpdateTaskError(
            Code.Internal,
            "Failed to save changes",
        );
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
        mockApi,
    }) => {
        await authenticate(page);

        // Create a task by clicking the center button
        const operationArea = page.locator(".fixed.inset-x-0.bottom-0");
        const centerButton = operationArea.locator("button").nth(1);
        await centerButton.click();

        const dialog = page.locator('[data-slot="dialog-content"]').first();
        await expect(dialog).toBeVisible({ timeout: 5000 });

        // Set error mock for delete operation before confirming delete
        await mockApi.task.mockDeleteTaskError(
            Code.Internal,
            "Failed to delete task",
        );

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
