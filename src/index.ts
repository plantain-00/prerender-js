import * as minimist from "minimist";
import * as packageJson from "../package.json";
import { prerender } from "./core";

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

    let selector: string = argv.selector;
    if (!selector || typeof selector !== "string") {
        const id: string = argv.id;
        if (!id || typeof id !== "string") {
            throw new Error("Need `--selector`");
        }
        selector = `#${id}`;
    }

    const out: string = argv.o;
    if (!out || typeof out !== "string") {
        throw new Error("Need `-o`");
    }

    const timeout: number = argv.timeout === undefined ? 0 : +argv.timeout;
    if (isNaN(timeout) || timeout < 0) {
        throw new Error("Invalid `timeout`");
    }

    await prerender(urls[0], selector, out, timeout);
}

executeCommandLine().then(() => {
    printInConsole("prerender-js success.");
}, error => {
    printInConsole(error);
    if (!suppressError) {
        process.exit(1);
    }
});
