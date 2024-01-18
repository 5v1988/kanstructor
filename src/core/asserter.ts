import { Page, expect } from "@playwright/test";
import { Assert } from "./types/test.types";
import compareImage from 'looks-same';
import chalk from 'chalk';
import { delay } from "../lib/utils";

export default class Asserter {

    private asserts: Assert[]
    private driver: Page;

    constructor(page: Page, asserts: Assert[]) {
        this.asserts = asserts;
        this.driver = page;
    }

    async transformLocators(locators: Map<string, string>) {
        if (!this.asserts)
            return;
        this.asserts.forEach(async assert => {
            if (locators.has(assert.locator)) {
                console.log(chalk.green('Transforming locator: ', chalk.white.bgRed.bold('%s'), ' with ',
                    chalk.white.bgRed.bold('%s')), assert.locator, locators.get(assert.locator));
                assert.locator = locators.get(assert.locator)!;
            }
        });
    }

    async assert() {
        if (!this.asserts)
            return;
        
        for (const assert of this.asserts) {
            console.log(chalk.green(' Performing the assert : ', chalk.bold.bgYellow.white('%s')),
                assert.name);
            if (assert.pause) {
                console.log(chalk.yellow('Pausing for ', chalk.bold('%s'), ' seconds'),
                    assert.pause);
                await delay(assert.pause);
                console.log(chalk.green(' Resuming after pausing ', chalk.bold('%s'), ' seconds'),
                    assert.pause);
            }
            await this.driver.waitForLoadState('networkidle');
            switch (assert.type) {
                case 'element':
                    switch (assert.state) {
                        case 'visible':
                            await expect(this.driver.locator(assert.locator))
                                .toBeVisible({ timeout: 10000 });
                            break;
                        case 'invisible':
                            await expect(this.driver.locator(assert.locator))
                                .toBeVisible({ visible: false });
                            break;
                        case 'enabled':
                            await expect(this.driver.locator(assert.locator))
                                .toBeEnabled();
                            break;
                        case 'disabled':
                            await expect(this.driver.locator(assert.locator))
                                .toBeDisabled();
                            break;
                        case 'checked':
                            await expect(this.driver.locator(assert.locator))
                                .toBeChecked();
                            break;
                        case 'unchecked':
                            await expect(this.driver.locator(assert.locator))
                                .toBeChecked({checked: false});
                            break;                
                        case 'containText':
                            await expect(this.driver.locator(assert.locator))
                                .toContainText(assert.text);
                            break;
                    }
                    break;

                case 'snapshot':
                    const { equal } = await compareImage(assert.original, assert.reference);
                    expect(equal).toBeTruthy();
                    break;

                case 'text':
                    switch (assert.state) {
                        case 'visible':
                            await expect(this.driver.getByText(assert.text, { exact: false }))
                                .toBeVisible({ timeout: 10000 });
                            break;
                        case 'invisible':
                            await expect(this.driver.getByText(assert.text, { exact: false }))
                                .toBeVisible({ visible: false, timeout: 10000 });
                            break;
                    }
                    break;
                default:
                    throw new Error(`No such assertion: '${assert.type}'. Please check for typo.`);     
            }
        }
    }
}