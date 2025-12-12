import type { Page } from "@playwright/test";
import { expect, test } from "../fixtures/error-injection";

test.describe("Task Error Handling", () => {
    async function authenticate(page: Page) {
        await page.click('button:has-text("Log in")');

        await page.click('button:has-text("Sign in with")');

        await page.waitForURL("/");

        await page.keyboard.press("Escape");

        await page.waitForTimeout(500);

        await expect(page.locator('text="Login Required"')).not.toBeVisible({
            timeout: 5000,
        });
    }

    test.beforeEach(async ({ page }) => {
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

        await page.waitForSelector('[aria-label="Close Quick Edit"]', {
            timeout: 5000,
        });

        await setErrorMode("task.update.fail");

        await page.fill('input[placeholder="Task Title"]', "Test Task");

        await page.click('button:has-text("Save")');

        const errorIndicator = page.locator("text=Failed");
        await expect(errorIndicator).toBeVisible({ timeout: 5000 });
    });

    test("displays error in delete dialog when delete fails", async ({
        page,
        setErrorMode,
    }) => {
        await authenticate(page);

        const operationArea = page.locator(".fixed.inset-x-0.bottom-0");
        const centerButton = operationArea.locator("button").nth(1);
        await centerButton.click();

        await page.waitForSelector('[aria-label="Close Quick Edit"]', {
            timeout: 5000,
        });

        await setErrorMode("task.delete.fail");

        await page.click('[aria-label="Close Quick Edit"]');

        const taskCard = page.locator('button[aria-label$="task"]').first();
        await expect(taskCard).toBeVisible({ timeout: 5000 });

        await taskCard.click();

        await page.waitForSelector('[aria-label="Delete Task"]', {
            timeout: 5000,
        });

        await page.click('[aria-label="Delete Task"]');

        const confirmButton = page.locator(
            'button:has-text("Delete"):not([aria-label="Delete Task"])',
        );
        await confirmButton.click();

        await expect(page.locator(".bg-red-50, .bg-red-950")).toBeVisible({
            timeout: 5000,
        });
    });
});
