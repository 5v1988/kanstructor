import fs from 'fs'
import yaml from 'yaml'
import { glob } from 'glob';
import chalk from 'chalk';
import { Act, Assert, Test } from '../core/types/test.types';
import { TestConfig } from '../core/types/config.types';
import {
    BrowserContext,
    chromium,
    devices,
    firefox,
    webkit
} from '@playwright/test';

export const getTests = async (pattern: string): Promise<Test[]> => {
    const paths = await glob(pattern);
    const allTests: Test[] = [];
    for (const path of paths) {
        const file = fs.readFileSync(path, 'utf8');
        const suite: { tests: Test[] } = await yaml.parse(file);
        const { tests } = suite;
        allTests.push(...tests);
    }
    return allTests;
}

export const getTransformedTests = async (tests: Test[]): Promise<Test[]> => {
    const actsToUse: Act[] = [];
    const assertsToUse: Assert[] = [];
    tests.forEach(test => {
        let extracts = test.act.filter(it => it.id);
        actsToUse.push(...extracts);
    });
    tests.forEach(test => {
        let extracts = test.assert.filter(it => it.id);
        assertsToUse.push(...extracts);
    });
    tests.forEach(test => {
        let replacedOnes = test.act.map(act => act.refId ?
            actsToUse.find(origAct => origAct.id === act.refId)! : act)
        test.act = replacedOnes;
    });
    tests.forEach(test => {
        let replacedOnes = test.assert.map(assert => assert.refId ?
            assertsToUse.find(origAssert => origAssert.id === assert.refId)! : assert)
        test.assert = replacedOnes;
    });
    return tests;
}

export const getLocators = async (pattern: string) => {
    let consolidatedLocators = {};
    const paths = await glob(pattern);
    for (const path of paths) {
        const file = fs.readFileSync(path, 'utf8');
        const locators = await yaml.parse(file);
        consolidatedLocators = { ...consolidatedLocators, ...locators };
    }
    return new Map<string, string>(Object.entries(consolidatedLocators));
};

export const getConfigurations = async (pattern: string) => {
    const path = await glob(pattern);
    const file = fs.readFileSync(path[0], 'utf8');
    const config: TestConfig = await yaml.parse(file);
    return config;
};

export const getBrowserContext = async (config: TestConfig) => {
    let browser;
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
    const context: BrowserContext = await browser!.newContext(devices[config.device]);
    console.log(chalk.green('Testing browser : ', chalk.bold('%s'), 'with emulation : ',
        chalk.bold('%s')), config.browser, config.device);
    return { browser, context };
}