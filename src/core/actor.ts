import { Page } from "@playwright/test";
import { Act } from "./types/test.types";
import { delay } from "../lib/utils";
import chalk from 'chalk';

export default class Actor {
    private acts: Act[]
    private driver: Page;

    constructor(page: Page, acts: Act[]) {
        this.acts = acts;
        this.driver = page;
    }

    async transformLocators(locators: Map<string, string>) {
        this.acts.forEach(async act => {
            if (locators.has(act.locator)) {
                console.log(chalk.green('Transforming locator: ', chalk.white.bgRed.bold('%s'), ' with ',
                    chalk.white.bgRed.bold('%s')), act.locator, locators.get(act.locator));
                act.locator = locators.get(act.locator)!;
            }
        });
    }

    async act() {
        for (const act of this.acts) {
            if (act.pause) {
                console.log(`=== Pausing for ${act.pause} seconds ===`);
                await delay(act.pause);
                console.log('===  Resuming after pausing ===');
            }

            switch (act.action) {
                case 'type':
                    await this.driver.locator(act.locator).fill(act.value);
                    break;
                case 'click':
                    await this.driver.locator(act.locator).click();
                    break;
                case 'clear':
                    await this.driver.locator(act.locator).clear();
                    break;
                case 'select':
                    await this.driver.locator(act.locator)
                        .selectOption({ label: act.value });
                    break;
                case 'snapshot':
                    await this.driver.waitForLoadState('networkidle');
                    await delay(2);
                    await this.driver
                        .screenshot({ path: act.path, fullPage: true });
                    break;
                case 'save':
                    let text = '';
                    if(act.locator)
                        text = await this.driver.locator(act.locator)
                            .innerText();
                    else
                        text = await this.driver.content();            
            }
        }
    }
}