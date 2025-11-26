import {test, expect} from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';


test('Basic auth test', async ({ browser }) => {
    
    const context:BrowserContext = await browser.newContext ();
    const page:Page = await context.newPage ();

    const username = 'admin';
    const password = 'admin';
    const authHeader = 'Basic ' + btoa(username + ':' + password); 
    page.setExtraHTTPHeaders({Authorization : authHeader}); 

    await page.goto('https://the-internet.herokuapp.com/basic_auth');

    const succesMessage = page.locator('div.example p');
    await expect(succesMessage).toHaveText('Congratulations! You must have the proper credentials.');



});