export interface Category {
  name: string
  subcategories: Category[]
}

export interface TestCase {
  category: string
  expected: string
}

export interface TestResult {
  category: string
  actual: string | null
  expected: string | null
  status: 'PASS' | 'FAIL'
}

export type CategoryPath = string | null
