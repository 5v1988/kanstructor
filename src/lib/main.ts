import fs from 'fs'
import yaml from 'yaml'
import {
    Browser,
    BrowserContext,
    Page,
    chromium,
    devices
} from '@playwright/test';
import Arranger from '../core/arranger';
import Actor from '../core/actor';
import Asserter from '../core/asserter';

async function main() {

    const file = fs.readFileSync('src/tests/login-tests.yml', 'utf8')
    let { tests } = await yaml.parse(file);
    let browser: Browser = await chromium.launch({ headless: false });
    for (let test of tests) {
        console.log(`Starting the test: ${test.name}`)
        let context: BrowserContext = await browser.newContext(devices['Desktop Chrome']);
        let pwPage: Page = await context.newPage();
        let arranger: Arranger = new Arranger(pwPage, test.arrange);
        let actor = new Actor(pwPage, test.act);
        let asserter = new Asserter(pwPage, test.assert);
        await arranger.arrange();
        await actor.act();
        await asserter.assert();
        await context.close();
    }
    await browser.close();
}

main();
