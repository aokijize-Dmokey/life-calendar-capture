import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  let browser;

  try {
    const width = Number(req.query.width || 1179);
    const height = Number(req.query.height || 2556);

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: {
        width,
        height,
        deviceScaleFactor: 2,
      },
    });

    const page = await browser.newPage();

    await page.goto("https://thelifecyclecalendar.com", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    const buffer = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "capture_failed",
      message: error.message,
    });
  } finally {
    if (browser) await browser.close();
  }
}

