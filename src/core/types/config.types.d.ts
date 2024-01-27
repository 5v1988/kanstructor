export interface TestConfig {
    browser: 'chrome' | 'firefox' | 'webkit'
    headless: boolean
    environment: qa | staging | production
    device: string
    url: string
    defaultWaitSeconds: number
    reportTheme: 'bootstrap' | 'simple' | 'foundation' | 'hierarchy'
    reportJson: string
    reportPath: string
    reportTitle: string
    reportLaunch: boolean
  }
  