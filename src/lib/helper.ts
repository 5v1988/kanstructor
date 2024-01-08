import fs from 'fs'
import yaml from 'yaml'
import { glob } from 'glob';
import { Test } from '../core/types/test.types';
import { TestConfig } from '../core/types/config.types';
import {
    BrowserContext,
    chromium,
    devices,
    firefox,
    webkit
} from '@playwright/test';

export let getTests = async (pattern: string): Promise<Test[]> => {
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

export let getLocators = async (pattern: string) => {
    let consolidatedLocators = {};
    const paths = await glob(pattern);
    for (let path of paths) {
        let file = fs.readFileSync(path, 'utf8');
        let locators = await yaml.parse(file);
        consolidatedLocators = { ...consolidatedLocators, ...locators };
    }
    return new Map<string, string>(Object.entries(consolidatedLocators));
};

export let getConfigurations = async (path: string) => {
    let file = fs.readFileSync(path, 'utf8');
    let config: TestConfig = await yaml.parse(file);
    return config;
};

export let getBrowserContext = async (config: TestConfig) => {
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
    let context: BrowserContext = await browser!.newContext(devices[config.device]);
    return { browser, context };
}