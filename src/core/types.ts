export interface Test {
    name: string
    browser: string
    exclude: true
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
    action: 'type' | 'click' | 'clear' | 'select' | 'snapshot'
    pause?: number
    value: string
    path: string
  }
  
  export interface Assert {
    name: string
    type: 'element' | 'snapshot' | 'text'
    locator: string
    state: 'visible' | 'invisible' | 'enable' | 'disable'
    text: string
    path: string
  }