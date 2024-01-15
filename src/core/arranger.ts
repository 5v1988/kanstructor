import {
    Page,
} from "@playwright/test";
import { Arrange } from "./types/test.types";
import { TestConfig } from "./types/config.types";

export default class Arranger {

    private arranges: Arrange[]
    private driver: Page;

    constructor(page: Page, arranges: Arrange[]) {
        this.arranges = arranges;
        this.driver = page;
    }

    async arrange(config: TestConfig) {
        for (const arrange of this.arranges) {
            switch (arrange.name) {
                case 'open_url':
                    if (arrange.baseUrl === 'baseUrl')
                        arrange.baseUrl = config.baseUrl;
                    await this.driver.goto(arrange.baseUrl);
                    break;
            }
        }
    }
}