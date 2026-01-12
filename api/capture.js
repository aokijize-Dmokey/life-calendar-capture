import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export default async function handler(req, res) {
  let browser = null;

  try {
    const width = Number(req.query.width || 1179);
    const height = Number(req.query.height || 2556);

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width,
        height,
        deviceScaleFactor: 2,
      },
      executablePath: await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v119.0.0/chromium-v119.0.0-pack.tar"
      ),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto("https://thelifecyclalendar.com", {
      waitUntil: "networkidle2",
      timeout: 30_000,
    });

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(screenshot);
  } catch (error) {
    console.error("CAPTURE ERROR:", error);

    res.status(500).json({
      error: "capture_failed",
      message: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
