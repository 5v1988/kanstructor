import { Page, expect } from "@playwright/test";
import { Assert } from "./types/test.types";
import compareImages from 'resemblejs/compareImages.js';
import chalk from 'chalk';
import { delay, resolveValue } from "../lib/utils";
import { Step } from "./types/report.types";
import YAML from 'json-to-pretty-yaml';
import { getVisualComparisonConfigurations } from "../lib/common.helper";
import storage from '../lib/storage.helper';
import axios from "axios";
import { FormData } from "formdata-node"
import { fileFromPath } from 'formdata-node/file-from-path'

export default class Asserter {
    private static readonly VISUAL_CONFIG_PATH = '**/resources/**/visual.tests.config.{yaml,yml}';
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

    async assert(): Promise<Step[]> {
        const startTime = new Date().getTime();
        const results: Step[] = [];
        if (!this.asserts)
            return [];

        for (const assert of this.asserts) {
            //let hasError: boolean = false;
            const stepResult: Step = {
                name: `— ${assert.name}  `,
                keyword: 'Assert ',
                result: {
                    status: 'undetermined',
                    duration: 0
                },
                embeddings: Array.of({
                    data: YAML.stringify(assert),
                    mime_type: 'text/plain'
                })
            };
            try {
                console.log(chalk.green(' Performing the assert : ', chalk.bold.bgYellow.white('%s')),
                    assert.name);
                if (assert.value) {
                    console.log(chalk.yellow(' Resolving value: ', chalk.bold('%s')), assert.value);
                    let key = await resolveValue(assert.value);
                    if (key) {
                        assert.value = await storage.getValue(key);
                    }
                }
                if (assert.text) {
                    console.log(chalk.yellow(' Resolving value: ', chalk.bold('%s')), assert.text);
                    let key = await resolveValue(assert.text);
                    if (key) {
                        assert.text = await storage.getValue(key);
                    }
                }
                let element;
                if (assert.pause) {
                    console.log(chalk.yellow('Pausing for ', chalk.bold('%s'), ' seconds'),
                        assert.pause);
                    await delay(assert.pause);
                    console.log(chalk.green(' Resuming after pausing ', chalk.bold('%s'), ' seconds'),
                        assert.pause);
                }
                await this.driver.waitForLoadState('networkidle');
                if (assert.role) {
                    if (!assert.text)
                        throw new Error(`The key: text should be required when using role. Please check once.`);
                    element = this.driver.getByRole(assert.role, { name: new RegExp(assert.text.trim(), "i") });
                } else if (assert.text) {
                    element = this.driver.getByText(assert.text);
                } else {
                    element = this.driver.locator(assert.locator);
                }
                switch (assert.type) {
                    case 'standard':
                        switch (assert.state) {
                            case 'visible':
                                await expect(element).toBeVisible({ timeout: 10000 });
                                break;
                            case 'invisible':
                                await expect(element).toBeVisible({ visible: false });
                                break;
                            case 'enabled':
                                await expect(element).toBeEnabled();
                                break;
                            case 'disabled':
                                await expect(element).toBeDisabled();
                                break;
                            case 'checked':
                                await expect(element).toBeChecked();
                                break;
                            case 'unchecked':
                                await expect(element).toBeChecked({ checked: false });
                                break;
                            case 'containText':
                                await expect(element).toContainText(assert.text);
                                break;
                        }
                        break;

                    case 'snapshot':
                        const vcOptions = await getVisualComparisonConfigurations(Asserter.VISUAL_CONFIG_PATH);
                        const diff = await compareImages(assert.original, assert.reference,
                            vcOptions);
                        const diffSnapshot = diff.getBuffer!(false).toString('base64');
                        stepResult.embeddings!.push({
                            data: diffSnapshot,
                            mime_type: 'image/png'
                        });
                        expect(diff.rawMisMatchPercentage <= assert.tolerance).toBeTruthy();
                        break;
                    case 'glancing':
                        const form = new FormData()
                        form.append("images", await fileFromPath(assert.original));
                        form.append("images", await fileFromPath(assert.reference));
                        const response = await axios.post('https://www.qualityplus.io/api/glance',
                            form, {
                            params: {
                                threshold: assert.tolerance
                            }
                        });
                        console.log(`Response from OpenCV API: `, response.data);
                        expect(response.data.match).toBeTruthy();
                        break;
                    case 'compare':
                        let actualValue = assert.value;
                        expect(actualValue).toEqual(assert.expectedValue);
                        break;
                    // case 'text':
                    //     switch (assert.state) {
                    //         case 'visible':
                    //             await expect(this.driver.getByText(assert.text, { exact: false }))
                    //                 .toBeVisible({ timeout: 10000 });
                    //             break;
                    //         case 'invisible':
                    //             await expect(this.driver.getByText(assert.text, { exact: false }))
                    //                 .toBeVisible({ visible: false, timeout: 10000 });
                    //             break;
                    //     }
                    //     break;
                    default:
                        throw new Error(`No such assertion: '${assert.type}'. Please check for typo.`);
                }
                stepResult.result.status = 'passed';
            } catch (error) {
                // hasError = true;
                stepResult.result.status = 'failed';
                console.log(chalk.red('Unexpected failure@step:', chalk.bold.bgYellow.white('%s'),
                    ' Time to take a closer look!'), assert.name);
                console.log(chalk.red('Exception name:', chalk.bold.bgYellow.white('%s'))
                    , error);
            }
            const elaspedTime = new Date().getTime() - startTime;
            stepResult.result.duration = elaspedTime;
            results.push(stepResult);
            // if (hasError)
            //     break;
        }
        return results;
    }
}