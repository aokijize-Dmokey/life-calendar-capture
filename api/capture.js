import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: {
        width: 1179,
        height: 2556,
        deviceScaleFactor: 2,
      },
    });

    const page = await browser.newPage();

    await page.goto("https://thelifecalendar.com", {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    const buffer = await page.screenshot({ type: "png" });

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(buffer);
  } catch (error) {
    console.error("CAPTURE ERROR:", error);
    res.status(500).json({
      error: "Capture failed",
      message: error.message,
    });
  } finally {
    if (browser) await browser.close();
  }
}
