import { Page } from "@playwright/test";
import { Act } from "./types/test.types";
import { delay, write } from "../lib/utils";
import chalk from 'chalk';
import { Step } from "./types/report.types";
import YAML from 'json-to-pretty-yaml';

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

    async act(): Promise<Step[]> {
        const startTime = new Date().getTime();
        const results: Step[] = [];
        for (const act of this.acts) {
            const stepResult: Step = {
                name: `— ${act.name}  `,
                keyword: 'Act ',
                result: {
                    status: 'undetermined',
                    duration: 0
                },
                embeddings: Array.of({
                    data: YAML.stringify(act),
                    mime_type: 'text/plain'
                })
            };
            console.log(chalk.green(' Performing the act : ', chalk.bold.bgYellow.white('%s')),
                act.name);
            if (act.pause) {
                console.log(chalk.yellow('Pausing for ', chalk.bold('%s'), ' seconds'),
                    act.pause);
                await delay(act.pause);
                console.log(chalk.green(' Resuming after pausing ', chalk.bold('%s'), ' seconds'),
                    act.pause);
            }
            await this.driver.waitForLoadState('networkidle');
            try {
                switch (act.action) {
                    case 'type':
                        await this.driver.locator(act.locator).fill(act.value);
                        break;
                    case 'check':
                        await this.driver.locator(act.locator).check();
                        break;
                    case 'uncheck':
                        await this.driver.locator(act.locator).uncheck();
                        break;
                    case 'press':
                        await this.driver.keyboard.press(act.value);
                        break;
                    case 'click':
                        await this.driver.locator(act.locator).click();
                        break;
                    case 'doubleclick':
                        await this.driver.locator(act.locator).dblclick();
                        break;
                    case 'clear':
                        await this.driver.locator(act.locator).clear();
                        break;
                    case 'focus':
                        await this.driver.locator(act.locator).focus();
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
                    case 'extract':
                        let text = [];
                        if (act.locator && act.extractType === 'innerText')
                            text = await this.driver.locator(act.locator)
                                .allInnerTexts();
                        else if (act.locator && act.extractType === 'textContents')
                            text = await this.driver.locator(act.locator)
                                .allTextContents();
                        else if (act.locator && act.extractType === 'innerHTML')
                            text = Array.of(await this.driver.locator(act.locator)
                                .innerHTML());
                        else
                            text = Array.of(await this.driver.content());

                        write(act.path, text);
                        break;
                    case 'download':
                        const downloadEvent = await this.driver.waitForEvent('download');
                        await this.driver.locator(act.locator).click();
                        await downloadEvent.saveAs(act.dir + downloadEvent.suggestedFilename());
                        break;
                    case 'upload':
                        await this.driver.locator(act.locator).setInputFiles(act.path);
                        break
                    default:
                        throw new Error(`No such action: '${act.action}'. Please check for typo.`);
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