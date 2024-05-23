import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.static('static'))
app.use(cors());


let opt = {
  type: 'png',
  fullPage: true,
  encoding: 'binary',
  captureBeyondViewport: true
}

app.get('/', async (req, res) => {

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('chrome://gpu');

  let resp = await page.screenshot(opt)

  await browser.close();

  res.type('png') // => 'image/png'
  res.send(resp);
});

app.get('/webgl', async (req, res) => {

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  // await page.goto('https://webglsamples.org/aquarium/aquarium.html');

  // await page.waitForNavigation()  

  await page.goto('http://localhost:3000/sample6/index.html');

  let opt = {
    type: 'png',
    fullPage: true,
    encoding: 'binary',
    captureBeyondViewport: true
  }

  let resp = await page.screenshot(opt)

  // Print the full title
  // console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();

  res.type('png') // => 'image/png'
  res.send(resp);
});


app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
