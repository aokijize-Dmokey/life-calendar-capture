import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.goto("https://thelifecalendar.com", {
      waitUntil: "networkidle2"
    });

    const buffer = await page.screenshot({
      type: "png",
      fullPage: true
    });

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  } finally {
    if (browser) await browser.close();
  }
}
