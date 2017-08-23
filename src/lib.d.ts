declare module "*.json" {
    export const version: string;
}

declare module "puppeteer" {
    export function launch(): Promise<Browser>;
    export class Browser {
        newPage(): Promise<Page>;
        close(): void;
    }
    export class Page {
        goto(url: string): Promise<void>;
        evaluate(pageFunction: () => string): Promise<string>;
    }
}
