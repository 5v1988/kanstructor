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
  name: 'openUrl'
  url: string
  pause?: number
}

export interface Act {
  name: string
  id: number
  refId: number
  action: 'type' | 'check' | 'uncheck' | 'click' | 'doubleclick' | 'press' |'clear' | 'select' | 'snapshot' | 'extract' | 'hover' | 'focus' | 'upload' | 'download'
  pause?: number
  locator: string
  role: 'textbox' | 'checkbox' | 'radio' | 'link' | 'option'
  text: string
  value: string
  extractType?: 'textContents' | 'innerText' | 'innerHTML'
  dir: string
  path: string
}

export interface Assert {
  name: string
  id: number
  refId: number
  type: 'standard' | 'snapshot'
  pause?: number
  locator: string
  role: 'textbox' | 'checkbox' | 'radio' | 'link' | 'option'
  text: string
  state: 'visible' | 'invisible' | 'enabled' | 'disabled' | 'checked' | 'unchecked' | 'containText'
  text: string
  original: string
  reference: string
  tolerance: number
}