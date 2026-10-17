import { chromium, type FullConfig } from "@playwright/test";

export default async function globalSetup(config: FullConfig) {
    const { baseURL } = config.projects[0].use;
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(baseURL ?? "/");
    await page.waitForLoadState("networkidle");
    await browser.close();
}
