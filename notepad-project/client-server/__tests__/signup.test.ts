import puppeteer, { Browser, Page } from 'puppeteer';

describe('Test of sign-up', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // headless: false 는 창을 볼수 있다.
      slowMo: 70, // slow down the testing
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('Rendering domain page', async () => {
    await page.goto('https://localhost:3000');

    const title = await page.title();
    expect(title).toBe('NotePad');
  });

  it('Going to login page', async () => {
    await page.waitForSelector('div.log-in button');
    const loginButton = await page.$('.log-in button');
    await loginButton?.click();

    await page.waitForSelector('#sign-up');

    const currentURL = page.url();
    expect(currentURL).toBe('https://localhost:3000/login');
  });

  it('Going to sign in page', async () => {
    const signupLink = await page.$('#sign-up');
    await signupLink?.click();

    await page.waitForSelector('input[id="ID"]');

    const currentURL = page.url();
    expect(currentURL).toBe('https://localhost:3000/signup');
  });

  it('Signing up', async () => {
    const inputID = 'input[id="ID"]';
    await page.click(inputID, { clickCount: 1 });
    await page.type(inputID, 'user05');

    const inputNickname = 'input[id="nickname"]';
    await page.waitForSelector(inputNickname);
    await page.click(inputNickname, { clickCount: 1 });
    await page.type(inputNickname, 'Elsa');

    const inputPW = 'input[id="pw"]';
    await page.waitForSelector(inputPW);
    await page.click(inputPW, { clickCount: 1 });
    await page.type(inputPW, 'user05');

    const inputConfmPW = 'input[id="confirm-pw"]';
    await page.waitForSelector(inputConfmPW);
    await page.click(inputConfmPW, { clickCount: 1 });
    await page.type(inputConfmPW, 'user05');

    await page.keyboard.press('Enter');
    await page.waitForSelector('form#loginForm');

    const currentURL = page.url();
    expect(currentURL).toBe('https://localhost:3000/login');
  }, 25000);
});
