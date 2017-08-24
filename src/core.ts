import * as puppeteer from "puppeteer";
import * as fs from "fs";

export async function prerender(url: string, selector: string, out: string, timeout = 0) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    setTimeout(async () => {
        const content = await page.evaluate(containerSelector => {
            const element = document.querySelector(containerSelector);
            return element ? element.innerHTML : "";
        }, selector);

        fs.writeFileSync(out, content);

        browser.close();
    }, timeout);
}
