import {
    Page,
} from "@playwright/test";
import { Arrange } from "./types/test.types";
import { TestConfig } from "./types/config.types";
import chalk from 'chalk';
import { delay } from "../lib/utils";
import { Step } from "./types/report.types";
import YAML from 'json-to-pretty-yaml';
import storage from '../lib/storage.helper';

export default class Arranger {

    private arranges: Arrange[]
    private driver: Page;

    constructor(page: Page, arranges: Arrange[]) {
        this.arranges = arranges;
        this.driver = page;
    }

    async arrange(config: TestConfig): Promise<Step[]> {
        const startTime = new Date().getTime();
        const results: Step[] = [];
        for (const arrange of this.arranges) {
            const stepResult: Step = {
                name: `— ${arrange.name}  `,
                keyword: 'Arrange ',
                result: {
                    status: 'undetermined',
                    duration: 0
                },
                embeddings: Array.of({
                    data: YAML.stringify(arrange),
                    mime_type: 'text/plain'
                })
            };
            console.log(chalk.green(' Performing the arrangement : ', chalk.bold.bgYellow.white('%s')),
                arrange.name);
            if (arrange.pause) {
                console.log(chalk.yellow('Pausing for ', chalk.bold('%s'), ' seconds'),
                    arrange.pause);
                await delay(arrange.pause);
                console.log(chalk.green(' Resuming after pausing ', chalk.bold('%s'), ' seconds'),
                    arrange.pause);
            }
            try {
                switch (arrange.action) {
                    case 'openUrl':
                        if (arrange.url === 'url')
                            arrange.url = config.url;
                        await this.driver.goto(arrange.url);
                        break;
                    case 'setValue':
                        let value = arrange.value;
                        await storage.setValue(arrange.key, value);
                        break;
                }
                stepResult.result.status = 'passed';
            } catch (error) {
                stepResult.result.status = 'failed';
            }
            const elaspedTime = new Date().getTime() - startTime;
            stepResult.result.duration = elaspedTime;
            results.push(stepResult);
        }
        return results;
    }
}