import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.goto("https://thelifecalendar.com", {
      waitUntil: "networkidle2",
      timeout: 30_000
    });

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true
    });

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(screenshot);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Capture failed",
      message: error.message
    });

  } finally {
    if (browser) await browser.close();
  }
}
