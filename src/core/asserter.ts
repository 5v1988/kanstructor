import { Page, expect } from "@playwright/test";
import { Assert } from "./types/test.types";
import compareImage from 'looks-same';
export default class Asserter {

    private asserts: Assert[]
    private driver: Page;

    constructor(page: Page, asserts: Assert[]) {
        this.asserts = asserts;
        this.driver = page;
    }

    async transformLocators(locators: Map<string, string>) {
        this.asserts.forEach(async assert => {
            if (locators.has(assert.locator)) {
                console.log(`=== Transforming locator ${assert.locator} with ${locators.get(assert.locator)} ===`);
                assert.locator = locators.get(assert.locator)!;
            }
        });
    }

    async assert() {
        for (const assert of this.asserts) {
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
                        case 'enable':
                            await expect(this.driver.locator(assert.locator))
                                .toBeEnabled();
                            break;
                        case 'disable':
                            await expect(this.driver.locator(assert.locator))
                                .toBeDisabled();
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
            }
        }
    }
}