import {
    Page,
} from "@playwright/test";
import { Arrange } from "./types/test.types";
import { TestConfig } from "./types/config.types";
import chalk from 'chalk';
import { delay } from "../lib/utils";

export default class Arranger {

    private arranges: Arrange[]
    private driver: Page;

    constructor(page: Page, arranges: Arrange[]) {
        this.arranges = arranges;
        this.driver = page;
    }

    async arrange(config: TestConfig) {
        for (const arrange of this.arranges) {
            console.log(chalk.green(' Performing the arrangement : ', chalk.bold.bgYellow.white('%s')),
                arrange.name);
            if (arrange.pause) {
                console.log(chalk.yellow('Pausing for ', chalk.bold('%s'), ' seconds'),
                    arrange.pause);
                await delay(arrange.pause);
                console.log(chalk.green(' Resuming after pausing ', chalk.bold('%s'), ' seconds'),
                    arrange.pause);
            }
            switch (arrange.name) {
                case 'openUrl':
                    if (arrange.url === 'url')
                        arrange.url = config.url;
                    await this.driver.goto(arrange.url);
                    break;
            }
        }
    }
}