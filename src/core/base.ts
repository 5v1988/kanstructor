import { Page } from "@playwright/test";

class Base {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }
}