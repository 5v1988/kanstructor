import fs from 'fs'
import yaml from 'yaml'
import { glob } from 'glob';
import { Act, Assert, Suite, Test } from '../core/types/test.types';
import { TestConfig } from '../core/types/config.types';

export const getSuites = async (pattern: string): Promise<Suite[]> => {
    const paths = await glob(pattern);
    const suites: Suite[] = [];
    for (const path of paths) {
        const file = fs.readFileSync(path, 'utf8');
        const suite: Suite = await yaml.parse(file);
        if (!suite)
            continue;
        suites.push(suite);
    }
    return suites;
}
export const getTests = async (pattern: string): Promise<Test[]> => {
    const paths = await glob(pattern);
    const allTests: Test[] = [];
    for (const path of paths) {
        const file = fs.readFileSync(path, 'utf8');
        const suite: { tests: Test[] } = await yaml.parse(file);
        if (!suite) {
            continue;
        }
        const { tests } = suite;
        allTests.push(...tests);
    }
    return allTests;
}

export const getTransformedTests = async (tests: Test[]): Promise<Test[]> => {
    const actsToUse: Act[] = [];
    const assertsToUse: Assert[] = [];
    tests.forEach(test => {
        const extracts = test.act.filter(it => it.id);
        actsToUse.push(...extracts);
    });
    tests.forEach(test => {
        const extracts = test.assert.filter(it => it.id);
        assertsToUse.push(...extracts);
    });
    tests.forEach(test => {
        const replacedOnes = test.act.map(act => act.refId ?
            actsToUse.find(origAct => origAct.id === act.refId)! : act)
        test.act = replacedOnes;
    });
    tests.forEach(test => {
        const replacedOnes = test.assert.map(assert => assert.refId ?
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