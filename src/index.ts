import * as minimist from "minimist";
import * as puppeteer from "puppeteer";
import * as fs from "fs";
import * as packageJson from "../package.json";

let suppressError = false;

function printInConsole(message: any) {
    if (message instanceof Error) {
        message = message.message;
    }
    // tslint:disable-next-line:no-console
    console.log(message);
}

function showToolVersion() {
    printInConsole(`Version: ${packageJson.version}`);
}

async function executeCommandLine() {
    const argv = minimist(process.argv.slice(2), { "--": true });

    const showVersion = argv.v || argv.version;
    if (showVersion) {
        showToolVersion();
        return;
    }

    suppressError = argv.suppressError;

    const urls = argv._;
    if (urls.length !== 1) {
        throw new Error("Need only 1 url");
    }

    const id: string = argv.id;
    if (!id || typeof id !== "string") {
        throw new Error("Need `--id`");
    }

    const out: string = argv.o;
    if (!out || typeof out !== "string") {
        throw new Error("Need `-o`");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(urls[0]);
    const content = await page.evaluate(containerId => {
        const element = document.getElementById(containerId);
        if (element) {
            return element.innerHTML;
        }
        return "";
    }, id);

    fs.writeFileSync(out, content);

    browser.close();
}

executeCommandLine().then(() => {
    printInConsole("prerender-js success.");
}, error => {
    printInConsole(error);
    if (!suppressError) {
        process.exit(1);
    }
});
