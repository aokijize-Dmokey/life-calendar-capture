import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  const width = Number(req.query.width || 1179);
  const height = Number(req.query.height || 2556);

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    defaultViewport: {
      width,
      height,
      deviceScaleFactor: 2
    },
    headless: chromium.headless
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://thelifecyclecalendar.com", {
      waitUntil: "networkidle2"
    });

    await page.waitForTimeout(3000);

    const image = await page.screenshot({ type: "png" });
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(image);
  } finally {
    await browser.close();
  }
}
