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
import chalk from 'chalk';

export default async function main() {
    const log = console.log;
    const suitePattern = '**/resources/**/*test.{yaml,yml}';
    const locatorPattern = '**/resources/**/*element.{yaml,yml}';
    const configPath = '**/resources/**/config.{yaml,yml}';
    const tests: Test[] = await getTests(suitePattern);
    const locators = await getLocators(locatorPattern);
    const config = await getConfigurations(configPath);

    for (const test of tests) {
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
            await arranger.arrange(config);
            await actor.transformLocators(locators);
            await actor.act();
            await asserter.transformLocators(locators);
            await asserter.assert();
            log(chalk.green('Finishing the test: ', chalk.bold('%s')), test.name);
        } catch (error) {
            log(chalk.red('Finishing the test: ', chalk.bold(' %s'), ' with failure due to %s'),
                test.name, error);
        }
        await browserContext.context!.close();
        await browserContext.browser!.close();
    }
}
