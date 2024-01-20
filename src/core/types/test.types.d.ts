export interface Test {
  name: string
  exclude: boolean
  arrange: Arrange[]
  act: Act[]
  assert: Assert[]
}

export interface Arrange {
  name: 'baseUrl'
  baseUrl: string
}

export interface Act {
  name: string
  id: number
  refId: number
  action: 'type' | 'check' | 'uncheck' | 'click' | 'doubleclick' | 'press' |'clear' | 'select' | 'snapshot' | 'extract' | 'hover' | 'focus' | 'upload' | 'download'
  pause?: number
  locator: string
  value: string
  extractType?: 'textContents' | 'innerText' | 'innerHTML'
  dir: string
  path: string
}

export interface Assert {
  name: string
  id: number
  refId: number
  type: 'element' | 'snapshot' | 'text'
  pause?: number
  locator: string
  state: 'visible' | 'invisible' | 'enabled' | 'disabled' | 'checked' | 'unchecked' | 'containText'
  text: string
  original: string
  reference: string
}