export interface Report {
  id: string
  keyword: 'Suite'
  name: string
  uri: string
  elements: Element[]
}

export interface Element {
  id: string
  keyword: 'Test'
  name: string
  steps: Step[]
}

export interface Step {
  keyword: 'Arrange ' | 'Act ' | 'Assert '
  name: Act | Arrange | Assert
  result: Result
  embeddings?: Embedding[]
}

export interface Result {
  status: 'passed' | 'failed' | 'undetermined'
  duration: number
}

export interface Embedding {
  data: string
  mime_type: 'base64:image/png' | 'text/plain'
}