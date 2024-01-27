
import reporter from 'cucumber-html-reporter';
import { TestConfig } from '../core/types/config.types';
import os from 'os';

export default function generateReport(config: TestConfig) {
    let options: reporter.Options = {
        theme: 'bootstrap',
        jsonFile: 'results.json',
        output: 'results.html',
        reportSuiteAsScenarios: false,
        scenarioTimestamp: true,
        launchReport: true,
        metadata: {
            'Version': '1.0.0',
            'Test Environment': config.environment,
            'Browser': config.browser,
            'Headless': `${config.headless}`,
            'Device': config.device,
            'Platform': os.platform(),
            'Executed On': 'Local',
            'Executed At': new Date().toLocaleString()
        }
    }
    reporter.generate(options);
}