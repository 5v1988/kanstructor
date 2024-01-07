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
    const pattern = '**/tests/**/*test.{yaml,yml}';
    let browser: Browser = await chromium.launch({ headless: false });
    let tests: Test[] = await getTests(pattern);
    for (let test of tests) {
        if (test.exclude) {
            console.log(`Skiping the test: ${test.name}`)
            continue;
        }
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

let getTests = async (pattern: string): Promise<Test[]> => {
    const paths = await glob(pattern);
    let allTests: Test[] = [];
    for (let path of paths) {
        let file = fs.readFileSync(path, 'utf8');
        let suite: { tests: Test[] } = await yaml.parse(file);
        let { tests } = suite;
        allTests.push(...tests)
    }
    return allTests;
}

main();