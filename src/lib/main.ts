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
import { glob } from 'glob';
import { Test } from '../core/types';

async function main() {
    const paths = await glob('**/tests/**/*.{yaml,yml}');
    let allTests: Test[] = [];
    for (let path of paths) {
        let file = fs.readFileSync(path, 'utf8');
        let suite: { tests: Test[] } = await yaml.parse(file);
        let { tests } = suite;
        allTests.push(...tests)
    }
    let browser: Browser = await chromium.launch({ headless: false });
    for (let test of allTests) {
        console.log(`Starting the test: ${test.name}`)
        let context: BrowserContext = await browser.newContext(devices['Desktop Chrome']);
        let pwPage: Page = await context.newPage();
        let arranger = new Arranger(pwPage, test.arrange);
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
