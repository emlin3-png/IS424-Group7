// import puppeteer

const puppeteer = require("puppeteer");

// this test simulates a new person in IDO requesting to be a member

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  //   open a new tab
  const page = await browser.newPage();

  //   go to IDO site
  await page.goto("https://ido-draft.web.app/index.html");

  //   click on contact nav tab
  await page.click(".gotoContact");
  await page.waitForNavigation();

  // click "IDO Inquiries Form" (opens a new 'popup' window)
  const [popupPromise] = await Promise.all([
    browser.waitForTarget((target) => target.type() === "page"),
    page.click("#generalinquiryform"),
  ]);

  // 4. Get the popup + go to it for 1 sec
  const popupPage = await popupPromise.page();
  await popupPage.bringToFront();
  await new Promise((r) => setTimeout(r, 1000));

  // 5. Close the popup + return to IDO site
  await popupPage.close();
  await page.bringToFront();

  //   // provide email and password to sign in ... type(HTML_ID, value)
  //   await page.type("#email_", "test1234555@gmail.com");
  //   await page.type("#password_", "test1234555@gmail.com");

  //   // click the submit button
  //   await page.click("#signin_form > div:nth-child(3) > div > button");

  //   //   force a 1 second delay
  //   await new Promise((r) => setTimeout(r, 1000));

  //   //   search for a specific car
  //   await page.type("#search_bar", "Random Car");
  //   await page.click("#search_button");

  //   //   close the browser after 10 seconds
  //   await new Promise((r) => setTimeout(r, 10000));

  //   await browser.close();
}

// call the function
go();
