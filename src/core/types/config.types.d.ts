export interface TestConfig {
    browser: 'chrome' | 'firefox' | 'webkit'
    headless: boolean
    device: string
    url: string
    defaultWaitSeconds: number
  }
  