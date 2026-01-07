import type { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a URL and wait for the network to be idle
     */
    async navigateTo(url: string) {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Wrapper for standard waitForURL
     */
    async waitForURL(url: string | RegExp) {
        await this.page.waitForURL(url);
    }

    /**
     * Handle browser dialogs automatically (e.g. password change)
     */
    async handleDialogs() {
        this.page.on('dialog', async dialog => {
            console.log(`Dialog returned: ${dialog.message()}`);
            await dialog.accept();
        });
    }
}