import 'dotenv/config';
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.static('static'))

var g_browser = null
var g_page = null

app.listen(process.env.PORT, async () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
  // server ready to accept connections here
  g_browser = await puppeteer.launch( 
    // {headless: false}
  );
  console.log(`browser created`);
  g_page = await g_browser.newPage();

  g_page.on('console', msg => {
      if (msg) {
        const text = msg.text()
        console.log('PAGE LOG:', text)
      }
  })
  // g_page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Navigate the page to a URL
  console.log(`page created`);
  await g_page.goto('http://localhost:3000/webglSample/index.html');
  console.log(`sample loaded in page`);
  await renderTheCube(g_page, 0.5);
  console.log(`render complete`);
});

async function renderTheCube(page, rotation) {
  await page.evaluate((rotation) => {
    cubeRotation = rotation
    console.log(`received rotation ${cubeRotation}`)
    render(0);
  }, rotation);
}

app.get('/', async (req, res) => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`chrome://gpu`);

  let opt = {
    type: 'png',
    fullPage: true,
    encoding: 'binary',
    captureBeyondViewport: true
  }

    await page.evaluate(() => {
      window.resizeTo(100, 100)
      console.log("window resized!!")
    });
  
  let resp = await page.screenshot(opt)

  await browser.close();

  res.type('png') // => 'image/png'
  res.send(resp);
});

app.get('/webgl', async (req, res) => {

  let rotation = 0.0
  if (req.query.rotation) {
    rotation = parseFloat(req.query.rotation )
  }

  renderTheCube(g_page, rotation)

  const element = await g_page.$('#glcanvas');

  let opt = {
    type: 'png',
    encoding: 'binary',
    captureBeyondViewport: true
  }

  let resp = await element.screenshot(opt)

  console.log(rotation)

  res.type('png') // => 'image/png'
  res.header({'Cache-Control':'no-store, no-cache, must-revalidate, proxy-revalidate'})
  res.send(resp);
});
