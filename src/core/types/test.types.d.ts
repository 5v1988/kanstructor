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
    action: 'type' | 'click' | 'press' | 'clear' | 'select' | 'snapshot' | 'save' | 'hover'
    pause?: number
    value: string
    type?: 'textContents' | 'innerText' | 'innerHTML' 
    path: string
  }
  
  export interface Assert {
    name: string
    type: 'element' | 'snapshot' | 'text'
    pause?: number
    locator: string
    state: 'visible' | 'invisible' | 'enable' | 'disable' | 'containText'
    text: string
    original: string
    reference: string
  }