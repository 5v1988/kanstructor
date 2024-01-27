export interface TestConfig {
    browser: 'chrome' | 'firefox' | 'webkit'
    headless: boolean
    environment: qa | staging | production
    device: string
    url: string
    defaultWaitSeconds: number
  }
  