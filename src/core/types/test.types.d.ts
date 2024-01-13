export interface Test {
  name: string
  exclude: boolean
  arrange: Arrange[]
  act: Act[]
  assert: Assert[]
}

export interface Arrange {
  name: string
  base_url: string
}

export interface Act {
  name: string
  locator: string
  action: 'type' | 'check' | 'uncheck' | 'click' | 'doubleclick' | 'press' |'clear' | 'select' | 'snapshot' | 'extract' | 'hover' | 'focus' | 'upload' | 'download'
  pause?: number
  value: string
  extractType?: 'textContents' | 'innerText' | 'innerHTML'
  dir: string
  path: string
}

export interface Assert {
  name: string
  type: 'element' | 'snapshot' | 'text'
  pause?: number
  locator: string
  state: 'visible' | 'invisible' | 'enabled' | 'disabled' | 'checked' | 'unchecked' | 'containText'
  text: string
  original: string
  reference: string
}