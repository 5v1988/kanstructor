import {
    Browser,
    BrowserContext,
    chromium,
    devices,
    firefox,
    webkit
} from '@playwright/test';
import { TestConfig } from '../core/types/config.types';
import chalk from 'chalk';
let browser: Browser, context: BrowserContext;

export const getBrowserContext = async (config: TestConfig) => {
    switch (config.browser) {
        case 'chrome':
            browser = await chromium.launch({ headless: config.headless });
            break;
        case 'firefox':
            browser = await firefox.launch({ headless: config.headless });
            break;
        case 'webkit':
            browser = await webkit.launch({ headless: config.headless });
            break;
    }
    context = await browser!.newContext(devices[config.device]);
    console.log(chalk.green('Testing browser : ', chalk.bold('%s'), 'with emulation : ',
        chalk.bold('%s')), config.browser, config.device);
    return { browser, context };
}

export const tidyUpBrowserStuffs = async () => {
    await context!.close();
    await browser!.close();
}