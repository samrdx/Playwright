import { test, expect } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';

test ('login test browsers', async ({ browser }) => {

//BrowserContext1:
const normalContext = await browser.newContext ();
const pageNormal = await normalContext.newPage ();

//BrowserContext2:
const incognitoContext = await browser.newContext (); 
const pageIncognito = await incognitoContext.newPage (); 
    
//Browser 1
await pageNormal.goto ('https://moveontruckqa.bermanntms.cl/login');

const emailidNormal = pageNormal.locator ('#login-usuario');
const passwordNormal = pageNormal.locator ('#login-clave');
const loginbtnNormal = pageNormal.locator ('[class="btn btn-success btn-custom w-md waves-effect waves-light"]'); 

await emailidNormal.fill ('arivas'); 
await passwordNormal.fill ('arivas');
await loginbtnNormal.click ();

//assertion 1 
await expect (pageNormal).toHaveTitle ('Inicio');
console.log ('Browser 1 Title: ' + await pageNormal.title ());


//Browser 2
await pageIncognito.goto ('https://moveontruckqa.bermanntms.cl/login');

const emailidIncognito = pageIncognito.locator ('#login-usuario');
const passwordIncognito = pageIncognito.locator ('#login-clave');
const loginbtnIncognito = pageIncognito.locator ('[class="btn btn-success btn-custom w-md waves-effect waves-light"]'); 

await emailidIncognito.fill ('srodriguez'); 
await passwordIncognito.fill ('srodriguez');
await loginbtnIncognito.click ();

//assertion 2 
await expect (pageIncognito).toHaveTitle ('Inicio');
console.log ('Browser 2 Title: ' + await pageIncognito.title() );
});