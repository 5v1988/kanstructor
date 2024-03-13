import { Page } from "@playwright/test";
import { Act } from "./types/test.types";
import { delay, write } from "../lib/utils";
import chalk from 'chalk';
import { Step } from "./types/report.types";
import YAML from 'json-to-pretty-yaml';
import storage from '../lib/storage.helper';

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
            let hasError: boolean = false;
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
            try {
                console.log(chalk.green(' Performing the act : ', chalk.bold.bgYellow.white('%s')),
                    act.name);
                let element;
                if (act.pause) {
                    console.log(chalk.yellow('Pausing for ', chalk.bold('%s'), ' seconds'),
                        act.pause);
                    await delay(act.pause);
                    console.log(chalk.green(' Resuming after pausing ', chalk.bold('%s'), ' seconds'),
                        act.pause);
                }
                await this.driver.waitForLoadState('networkidle');

                if (act.role) {
                    if (!act.text)
                        throw new Error(`The key: text should be required when using role. Please check once.`);
                    element = this.driver.getByRole(act.role, { name: new RegExp(act.text.trim(), "i") });
                } else if (act.text) {
                    element = this.driver.getByText(act.text);
                } else {
                    element = this.driver.locator(act.locator);
                }
                switch (act.action) {
                    case 'type':
                        await element.fill(act.value);
                        break;
                    case 'check':
                        await element.check();
                        break;
                    case 'uncheck':
                        await element.uncheck();
                        break;
                    case 'press':
                        await this.driver.keyboard.press(act.value);
                        break;
                    case 'click':
                        await element.click();
                        break;
                    case 'doubleclick':
                        await element.dblclick();
                        break;
                    case 'clear':
                        await element.clear();
                        break;
                    case 'focus':
                        await element.focus();
                        break;
                    case 'select':
                        await element.selectOption({ label: act.value });
                        break;
                    case 'hover':
                        await element.hover();
                        break;
                    case 'snapshot':
                        await delay(1);
                        const buffer = await this.driver
                            .screenshot({ path: act.path, fullPage: true });
                        stepResult.embeddings!.push({
                            data: buffer.toString('base64'),
                            mime_type: 'image/png'
                        });
                        break;
                    case 'extract':
                        let text = [];
                        if (act.locator && act.extractType === 'innerText')
                            text = await element.allInnerTexts();
                        else if (act.locator && act.extractType === 'textContents')
                            text = await element.allTextContents();
                        else if (act.locator && act.extractType === 'innerHTML')
                            text = Array.of(await element.innerHTML());
                        else
                            text = Array.of(await this.driver.content());
                        write(act.path, text);
                        stepResult.embeddings!.push({
                            data: text.join('\n'),
                            mime_type: 'text/plain'
                        });
                        break;
                    case 'download':
                        const downloadEvent = await this.driver.waitForEvent('download');
                        await element.click();
                        await downloadEvent.saveAs(act.dir + downloadEvent.suggestedFilename());
                        break;
                    case 'upload':
                        await element.setInputFiles(act.path);
                        break
                    case 'setValue':
                        let value = act.value;
                        if (act.locator){
                            value = await element.innerText();
                        }
                        await storage.setValue(act.key, value);
                        break; 
                    default:
                        throw new Error(`No such action: '${act.action}'. Please check for typo.`);
                }
                stepResult.result.status = 'passed';
            } catch (error) {
                hasError = true;
                stepResult.result.status = 'failed';
                console.log(chalk.red('Unexpected failure@step:', chalk.bold.bgYellow.white('%s'),
                    ' Time to take a closer look!'), act.name);
            }
            const elaspedTime = new Date().getTime() - startTime;
            stepResult.result.duration = elaspedTime;
            results.push(stepResult);
            if (hasError)
                break;
        }
        return results;
    }
}