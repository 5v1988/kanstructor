import {
    getTests,
    getLocators,
    getConfigurations,
    getBrowserContext
} from './helper';
import { Page } from '@playwright/test';
import Arranger from '../core/arranger';
import Actor from '../core/actor';
import Asserter from '../core/asserter';
import { Test } from '../core/types/test.types';

export default async function main() {
    const suitePattern = '**/resources/**/*test.{yaml,yml}';
    const locatorPattern = '**/resources/**/*element.{yaml,yml}';
    const configPath = '**/resources/**/config.{yaml,yml}';
    let tests: Test[] = await getTests(suitePattern);
    let locators = await getLocators(locatorPattern);
    let config = await getConfigurations(configPath);

    for (let test of tests) {
        if (test.exclude) {
            console.log(`Skiping the test: ${test.name}`);
            continue;
        }
        console.log(`=== Starting the test: ${test.name} ===`);
        let browserContext = await getBrowserContext(config);
        let pwPage: Page = await browserContext.context.newPage();
        let arranger = new Arranger(pwPage, test.arrange);
        let actor = new Actor(pwPage, test.act);
        let asserter = new Asserter(pwPage, test.assert);
        try {
            await arranger.arrange();
            await actor.transformLocators(locators);
            await actor.act();
            await asserter.transformLocators(locators);
            await asserter.assert();
            //console.log(`=== Finishing the test: ${test.name} ===`);
        } catch (error) {
            //console.log(`=== Finishing the test: ${test.name} with failure due to ${error} ===`);
        }
        await browserContext.context!.close();
        await browserContext.browser!.close();
    }
}
