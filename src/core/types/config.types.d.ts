export interface TestConfig {
    browser: 'chrome' | 'firefox' | 'webkit'
    headless: boolean
    device: string
    base_url: string
    default_wait_seconds: number
  }
  