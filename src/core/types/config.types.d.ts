export interface TestConfig {
    browser: 'chrome' | 'firefox' | 'webkit'
    headless: boolean
    device: string
    baseUrl: string
    defaultWaitSeconds: number
  }
  