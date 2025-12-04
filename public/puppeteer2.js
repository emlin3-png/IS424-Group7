// import puppeteer

const puppeteer = require("puppeteer");

// this test simulates an admin signing in and viewing the members portal list before signing out
async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  //   open a new tab
  const page = await browser.newPage();

  //   go to IDO site
  await page.goto("https://ido-draft.web.app/index.html");

  //   click sign in button
  await page.click("#nav-signin");

  // input email + pass
  await page.type("#signin-email", "test@gmail.com");
  await page.type("#signin-password", "Hello2025");

  // submit
  await page.click("#signin-submit");

  // go to members portal
  await page.click(".gotoMembersPortal");

  // scroll down slowly
  await slowScroll(page);

  // sign out
  await page.click("#logout-btn");

  // close browser after 2 sec
  await new Promise((r) => setTimeout(r, 2000));
  await browser.close();
}

// call the function
go();

// creating the "slow scroll function" to call above
async function slowScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100; // num pixels per step
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
