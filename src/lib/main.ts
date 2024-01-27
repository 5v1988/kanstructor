import {
    getTests,
    getLocators,
    getConfigurations,
    getTransformedTests
} from './common.helper';
import {
    getBrowserContext,
    tidyUpBrowserStuffs
} from './browser.helper';

import { Page } from '@playwright/test';
import Arranger from '../core/arranger';
import Actor from '../core/actor';
import Asserter from '../core/asserter';
import { Test } from '../core/types/test.types';
import chalk from 'chalk';
import { Element, Report } from '../core/types/report.types';
import { writeToJson } from './utils';

export default async function main() {
    const log = console.log;
    const suitePattern = '**/resources/**/*test.{yaml,yml}';
    const locatorPattern = '**/resources/**/*element.{yaml,yml}';
    const configPath = '**/resources/**/config.{yaml,yml}';
    const tests: Test[] = await getTests(suitePattern);
    const locators = await getLocators(locatorPattern);
    const config = await getConfigurations(configPath);
    const tTests = await getTransformedTests(tests);
    let report: Report = {
        name: 'This is a summary report',
        id: 'report',
        keyword: 'Suite',
        uri: '',
        elements: []
    };

    for (const test of tTests) {
        let testResult: Element = {
            name: test.name,
            id: test.name.replace(' ', '-'),
            keyword: 'Test',
            steps: []
        };
        if (test.exclude) {
            log(chalk.yellow('Skiping the test: ', chalk.bold('%s')), test.name);
            continue;
        }
        log(chalk.green('Starting the test: ', chalk.bold('%s')), test.name);
        const browserContext = await getBrowserContext(config);
        const pwPage: Page = await browserContext.context.newPage();
        const arranger = new Arranger(pwPage, test.arrange);
        const actor = new Actor(pwPage, test.act);
        const asserter = new Asserter(pwPage, test.assert);
        try {
            let arrangeStepResults = await arranger.arrange(config);
            console.log(arrangeStepResults);
            testResult.steps.push(...arrangeStepResults);;
            await actor.transformLocators(locators);
            await actor.act();
            await asserter.transformLocators(locators);
            await asserter.assert();
            log(chalk.green('Finishing the test: ', chalk.bold('%s')), test.name);
        } catch (error) {
            log(chalk.red('Finishing the test: ', chalk.bold(' %s'), ' with failure due to %s'),
                test.name, error);
        }
        tidyUpBrowserStuffs();
        report.elements.push(testResult);
        writeToJson(Array.of(report));
        console.log(Array.of(report));
    }
}
