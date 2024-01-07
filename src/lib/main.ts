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
    const suitePattern = '**/tests/**/*test.{yaml,yml}';
    const locatorPattern = '**/tests/**/*element.{yaml,yml}';
    let tests: Test[] = await getTests(suitePattern);
    let locators = await getLocators(locatorPattern);
    let browser: Browser = await chromium.launch({ headless: false });
    for (let test of tests) {
        if (test.exclude) {
            console.log(`Skiping the test: ${test.name}`);
            continue;
        }
        console.log(`=== Starting the test: ${test.name} ===`);
        let context: BrowserContext = await browser.newContext(devices['Desktop Chrome']);
        let pwPage: Page = await context.newPage();
        let arranger = new Arranger(pwPage, test.arrange);
        let actor = new Actor(pwPage, test.act);
        let asserter = new Asserter(pwPage, test.assert);
        await arranger.arrange();
        await actor.transformLocators(locators);
        await actor.act();
        await asserter.transformLocators(locators);
        await asserter.assert();
        await context.close();
        console.log(`=== Finishing the test: ${test.name} ===`);
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
        allTests.push(...tests);
    }
    return allTests;
}

let getLocators = async (pattern: string) => {
    let consolidatedLocators = {};
    const paths = await glob(pattern);
    for (let path of paths) {
        let file = fs.readFileSync(path, 'utf8');
        let locators = await yaml.parse(file);
        consolidatedLocators = { ...consolidatedLocators, ...locators };
    }
    return new Map<string, string>(Object.entries(consolidatedLocators));
}

main();