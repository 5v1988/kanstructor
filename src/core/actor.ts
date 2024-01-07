import { Page } from "@playwright/test";
import { Act } from "./types";

export default class Actor {
    private acts: Act[]
    private driver: Page;

    constructor(page: Page, acts: Act[]) {
        this.acts = acts;
        this.driver = page;
    }

    async act() {
        for (let act of this.acts) {
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
                    await this.driver
                        .screenshot({ path: act.path, fullPage: true });
                    break;    
            }
        }
    }
}