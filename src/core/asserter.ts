import { Page, expect } from "@playwright/test";
import { Assert } from "./types";

export default class Asserter {

    private asserts: Assert[]
    private driver: Page;

    constructor(page: Page, asserts: Assert[]) {
        this.asserts = asserts;
        this.driver = page;
    }

    async assert() {
        for (let assert of this.asserts) {
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
                    }
                    break;

                case 'snapshot':
                    await expect(this.driver)
                        .toHaveScreenshot(assert.path);
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