
import reporter from 'cucumber-html-reporter';
import { TestConfig } from '../core/types/config.types';
import os from 'os';

export default function generateReport(config: TestConfig) {
    const options: reporter.Options = {
        theme: config.reportTheme,
        jsonFile: config.reportJson,
        output: config.reportPath,
        brandTitle: config.reportTitle,
        launchReport: config.reportLaunch,
        reportSuiteAsScenarios: false,
        scenarioTimestamp: true,
        metadata: {
            'Version': '1.0.0',
            'Test Environment': config.environment,
            'Browser': config.browser,
            'Headless': config.headless ? 'Yes' : 'No',
            'Device': config.device,
            'Platform': os.platform(),
            'Executed On': 'Local',
            'Executed At': new Date().toLocaleString()
        }
    }
    reporter.generate(options);
}