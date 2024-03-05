export interface TestConfig {
  browser: string
  headless: boolean
  viewport: Viewport
  environment: string
  device: string
  url: string
  defaultWaitSeconds: number
  report: Report
}

export interface Viewport {
  width: number
  height: number
}

export interface Report {
  theme: "bootstrap" | "hierarchy" | "foundation" | "simple"
  json: string
  html: string
  title: string
  launch: boolean
}
