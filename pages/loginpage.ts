import { BasePage } from './basepage.js';
import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {
    readonly userInput: Locator;
    readonly passInput: Locator;
    readonly loginBtn: Locator;
    readonly userMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.userInput = page.locator('#login-usuario');
        this.passInput = page.locator('#login-clave');
        this.loginBtn = page.locator('button.btn-success:has-text("Ingresar")');
        this.userMenu = page.locator('a.nav-link.dropdown-toggle.nav-user > strong');
    }

    async goto() {
        await this.navigateTo('https://moveontruckqa.bermanntms.cl/login');
        await expect(this.page).toHaveURL(/.*login/);
    }

    async login(user: string, pass: string) {
        await this.userInput.fill(user);
        await this.passInput.fill(pass);
        await this.loginBtn.click();
    }

    async verifyLoginSuccess(expectedUser: string) {
        await this.page.waitForURL('https://moveontruckqa.bermanntms.cl/site');
        await expect(this.userMenu).toContainText(expectedUser);
    }
}