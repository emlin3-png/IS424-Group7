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

  // now the person will attempt to sign up
  // click Sign Up Button
  await page.click("#nav-signup"); // <-- replace with your actual sign-up button selector

  // input email + pass
  await page.type("#signup-first", "Puppeteer");
  await page.type("#signup-last", "Puppeteer");
  await page.type("#signup-email", "puppeteer@gmail.com");
  await page.type("#signup-password", "puppeteerpassword");

  // submit
  await page.click("#signup-submit");

  // close browser after 5 sec
  await new Promise((r) => setTimeout(r, 5000));
  await browser.close();
}

// call the function
go();
