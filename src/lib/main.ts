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
import generateReport from './report.generation';

export default async function main() {
    const log = console.log;
    const suitePattern = '**/resources/**/*test.{yaml,yml}';
    const locatorPattern = '**/resources/**/*element.{yaml,yml}';
    const configPath = '**/resources/**/config.{yaml,yml}';
    const tests: Test[] = await getTests(suitePattern);
    const locators = await getLocators(locatorPattern);
    const config = await getConfigurations(configPath);
    const tTests = await getTransformedTests(tests);
    const report: Report = {
        name: 'This is a summary report',
        id: 'report',
        keyword: 'Suite',
        uri: '',
        elements: []
    };

    for (const test of tTests) {
        const testResult: Element = {
            name: test.description,
            id: test.name.replace(' ', '-'),
            keyword: test.name,
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
            const arrangeStepResults = await arranger.arrange(config);
            testResult.steps.push(...arrangeStepResults);
            await actor.transformLocators(locators);
            const actStepResults = await actor.act();
            testResult.steps.push(...actStepResults);
            await asserter.transformLocators(locators);
            const assertStepResults = await asserter.assert();
            testResult.steps.push(...assertStepResults);
            log(chalk.green('Finishing the test: ', chalk.bold('%s')), test.name);
        } catch (error) {
            log(chalk.red('Finishing the test: ', chalk.bold(' %s'), ' with failure due to %s'),
                test.name, error);
        }
        report.elements.push(testResult);
        tidyUpBrowserStuffs();
    }
    writeToJson(Array.of(report));
    generateReport(config);
}
