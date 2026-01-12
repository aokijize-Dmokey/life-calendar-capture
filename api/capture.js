const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
  const width = Number(req.query.width || 1179);
  const height = Number(req.query.height || 2556);

  let browser = null;

  try {
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

    await page.goto("https://thelifecalendar.com", {
      waitUntil: "networkidle2",
    });

    const screenshot = await page.screenshot({ type: "png" });

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(screenshot);
  } catch (err) {
    // Important: renvoyer l’erreur pour les logs Vercel
    console.error(err);
    res.status(500).send(String(err));
  } finally {
    if (browser) await browser.close();
  }
};
