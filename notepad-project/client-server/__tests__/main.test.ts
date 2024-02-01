import puppeteer, { Browser, Page } from 'puppeteer';
// import { Server } from 'https';
// import express from 'express';
// import fs from 'fs/promises';
// import dotenv from 'dotenv';
// import renderDomainPage from '../controllers/renderDomainPage';

// dotenv.config();

async function inputIdAndPW(page: Page, userId: string, pw: string) {
  const inputID = 'input[type="text"]';
  await page.waitForSelector(inputID);
  await page.$eval(inputID, (input) => input.value = '');
  await page.click(inputID, { clickCount: 1 });
  await page.type(inputID, userId);

  const inputPW = 'input[type="password"]';
  await page.waitForSelector(inputPW);
  await page.$eval(inputPW, (input) => input.value = '');
  await page.click(inputPW, { clickCount: 1 });
  await page.type(inputPW, pw);
}

async function hasError(page: Page) {
  const errorSelector = '.error';
  await page.waitForSelector(errorSelector);

  const errorEle = await page.$(errorSelector);
  return !!errorEle;
}

// function findInteractBtn(spanInnerText: string) {
//   const buttons = Array.from(document.querySelectorAll('.interact button'));
//   return buttons.find((btn) => btn?.querySelector('span')?.innerText === spanInnerText);
// }

describe('Tests from login to logout', () => {
  let browser: Browser;
  let page: Page;
  // let server: Server;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // headless: false 는 창을 볼수 있다.
      slowMo: 70, // slow down the testing
    });
    page = await browser.newPage();

    // const app = express();
    // app.use(express.static(process.env.PUBLIC as string));
    // app.get('/', renderDomainPage);

    // const createHttpsOptions = async () => ({
    //   key: await fs.readFile(`${process.env.CA as string}client_key.pem`),
    //   cert: await fs.readFile(`${process.env.CA}client_cert.pem`),
    // });

    // const options = await createHttpsOptions();

    // server = https.createServer(options, app);
    // server.listen(3000, () => {
    //   console.log('Express server started on port 3000');
    // });
  });

  afterAll(async () => {
    await browser.close();
    // server.close();
  });

  it('Rendering domain page', async () => {
    await page.goto('https://localhost:3000');

    const title = await page.title();
    expect(title).toBe('NotePad');
  });

  it('Going to login page', async () => {
    await page.waitForSelector('div.log-in button');
    // const loginButton = await page.$('.log-in button');
    // await loginButton?.click();
    await page.click('.log-in button', { clickCount: 1 });

    const currentURL = page.url();
    expect(currentURL).toBe('https://localhost:3000/login');
  });

  it('Highlight the Id if user NOT found', async () => {
    await inputIdAndPW(page, 'unknown', 'unknown');
    await page.keyboard.press('Enter');
    const notFound = await hasError(page);
    expect(notFound).toBe(true);
  }, 15000);

  it('Highlight the pw if it is wrong', async () => {
    await inputIdAndPW(page, 'user01', 'wrongPW');
    await page.keyboard.press('Enter');
    const isWrongPW = await hasError(page);
    expect(isWrongPW).toBe(true);
  }, 15000);

  it('Logging in', async () => {
    await inputIdAndPW(page, 'user01', 'user01');

    // const submitBtn = 'button[type="submit"]';
    // await page.waitForSelector(submitBtn);
    // await page.click(submitBtn, { clickCount: 1 });
    await page.keyboard.press('Enter');

    await page.waitForSelector('div.log-in button', { timeout: 2000 });

    const currentURL = page.url();
    expect(currentURL).toBe('https://localhost:3000/user/user01');
  }, 15000);

  it('Logging out', async () => {
    await page.click('.log-in button', { clickCount: 1 });

    const currentURL = page.url();
    expect(currentURL).toBe('https://localhost:3000/');
  }, 12000);
});
