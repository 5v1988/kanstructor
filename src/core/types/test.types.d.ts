export interface Suite {
  description: string,
  tests: Test[]
}

export interface Test {
  name: string
  description: string
  exclude: boolean
  arrange: Arrange[]
  act: Act[]
  assert: Assert[]
}

export interface Arrange {
  name: string
  action: 'openUrl' | 'setValue'
  url: string
  pause?: number
  key: string
  value: string
}

export interface Act {
  name: string
  id: number
  refId: number
  action: 'type' | 'check' | 'uncheck' | 'click' | 'doubleclick' | 'press' |'clear' | 'select' | 'snapshot' | 'extract' | 'hover' | 'focus' | 'upload' | 'download' | 'setValue'
  pause?: number
  locator: string
  role: 'textbox' | 'checkbox' | 'radio' | 'link' | 'option'
  text: string
  key: string
  value: string
  extractType?: 'textContents' | 'innerText' | 'innerHTML'
  dir: string
  path: string
}

export interface Assert {
  name: string
  id: number
  refId: number
  type: 'standard' | 'snapshot' | 'compare' | 'glancing'
  pause?: number
  locator: string
  role: 'textbox' | 'checkbox' | 'radio' | 'link' | 'option' | 'button' | 'slider' | 'switch'
  text: string
  value: string
  expectedValue: string
  state: 'visible' | 'invisible' | 'enabled' | 'disabled' | 'checked' | 'unchecked' | 'containText'
  original: string
  reference: string
  tolerance: number
}