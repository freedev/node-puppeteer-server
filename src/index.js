import 'dotenv/config';
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

app.get('/', async (req, res) => {

  const browser = await puppeteer.launch();
  console.log('browser created!')

  const page = await browser.newPage();

  await page.goto(`chrome://gpu`);

  page.on('console', msg => console.log('PAGE LOG:', msg.text()))

  await page.evaluate(() => {
      window.resizeTo(100, 100)
      console.log("window resized!!")
  });
  
  let opt = {
    type: 'png',
    fullPage: true,
    encoding: 'binary',
    captureBeyondViewport: true
  }

  let resp = await page.screenshot(opt)

  await page.close();
  await browser.close();

  res.type('png') // => 'image/png'
  res.send(resp);
});

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
  // server ready to accept connections here
});
