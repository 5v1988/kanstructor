import { Page } from "@playwright/test";
import { Act } from "./types/test.types";
import { delay, write } from "../lib/utils";
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
                console.log(chalk.yellow('Pausing for ', chalk.bold('%s'), ' seconds'),
                    act.pause);
                await delay(act.pause);
                console.log(chalk.green(' Resuming after pausing ', chalk.bold('%s'), ' seconds'),
                    act.pause);
            }
            await this.driver.waitForLoadState('networkidle');

            switch (act.action) {
                case 'type':
                    await this.driver.locator(act.locator).fill(act.value);
                    break;
                case 'press':
                    await this.driver.keyboard.press(act.value);
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
                case 'hover':
                    await this.driver.locator(act.locator).hover();
                    break;
                case 'snapshot':
                    await delay(1);
                    await this.driver
                        .screenshot({ path: act.path, fullPage: true });
                    break;
                case 'save':
                    let text = [];
                    if (act.locator && act.type === 'innerText')
                        text = await this.driver.locator(act.locator)
                            .allInnerTexts();
                    else if (act.locator && act.type === 'textContents')
                        text = await this.driver.locator(act.locator)
                            .allTextContents();
                    else if (act.locator && act.type === 'innerHTML')
                        text = Array.of(await this.driver.locator(act.locator)
                            .innerHTML());
                    else
                        text = Array.of(await this.driver.content());
                    write(act.path, text);
                    break;
            }
        }
    }
}