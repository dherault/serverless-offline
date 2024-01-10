import chromium from "@sparticuz/chrome-aws-lambda"

export default async function handler() {
  const pdfOptions = {
    format: "a4",
    scale: 1,
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>chrome-aws-lambda test</h1>
      </body>
    </html>
  `

  let browser
  let result

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })

    const page = await browser.newPage()

    // const url = new URL('https://www.example.com')
    // await page.goto(String(url))

    await page.setContent(html)

    result = await page.pdf(pdfOptions)
  } catch (error) {
    console.log(error)

    return {
      statusCode: 500,
    }
  } finally {
    if (browser !== undefined) {
      await browser.close()
    }
  }

  return {
    body: result.toString("base64"),
    headers: {
      "Content-type": "application/pdf",
    },
    isBase64Encoded: true,
    statusCode: 200,
  }
}
