<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Category Path Finder</h1>

        <div class="space-y-4">
          <div>
            <label for="category-select" class="block text-sm font-medium text-gray-700 mb-2">
              Select a category:
            </label>
            <select
              id="category-select"
              v-model="selectedCategory"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="category-selector"
            >
              <option value="">Choose a category...</option>
              <option v-for="category in allCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <button
            @click="findPath"
            :disabled="!selectedCategory"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            data-testid="find-path-button"
          >
            Find Category Path
          </button>

          <div class="mt-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-3">Test All Categories:</h2>
            <button
              @click="testAllCategories"
              class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              data-testid="test-all-button"
            >
              Test All Categories
            </button>
          </div>

          <div class="mt-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-3">Category Structure:</h2>
            <div class="bg-gray-100 p-4 rounded-md">
              <pre class="text-sm text-gray-700 overflow-x-auto">{{
                JSON.stringify(categories, null, 2)
              }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Dialog -->
    <div
      v-if="showDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeDialog"
      data-testid="dialog-overlay"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        @click.stop
        data-testid="dialog-content"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">{{ dialogTitle }}</h3>
          <button
            @click="closeDialog"
            class="text-gray-400 hover:text-gray-600 focus:outline-none"
            data-testid="close-dialog-button"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div class="text-gray-600" data-testid="dialog-message">
          <pre class="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-3 rounded">{{
            dialogMessage
          }}</pre>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="closeDialog"
            class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, type Ref, type ComputedRef } from 'vue'
  import type { Category, TestCase, CategoryPath } from '../types/category'

  // Category data with proper typing
  const categories: Category[] = [
    {
      name: 'category1',
      subcategories: [
        {
          name: 'category2',
          subcategories: [],
        },
        {
          name: 'category3',
          subcategories: [
            {
              name: 'category4',
              subcategories: [],
            },
          ],
        },
      ],
    },
    {
      name: 'category5',
      subcategories: [],
    },
  ]

  // Reactive state with proper typing
  const selectedCategory: Ref<string> = ref('')
  const showDialog: Ref<boolean> = ref(false)
  const dialogTitle: Ref<string> = ref('')
  const dialogMessage: Ref<string> = ref('')

  // Get category path function with proper TypeScript typing
  const getCategoryPath = (
    categories: Category[] = [],
    categoryName: string = ''
  ): CategoryPath => {
    if (!categories.length || !categoryName.trim()) {
      return null
    }

    let result: string[] = []

    const findPath = (category: Category, path: string[]): void => {
      const newPath: string[] = [...path, category.name]

      if (category.name === categoryName) {
        result = newPath
        return
      }

      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.some((subcategory: Category) => {
          findPath(subcategory, newPath)
          return subcategory.name === categoryName
        })
      }
    }

    categories.some((category: Category) => {
      findPath(category, [])
      return category.name === categoryName
    })

    return result.length > 0 ? `/${result.join('/')}` : null
  }

  // Get all category names for the dropdown with proper typing
  const allCategories: ComputedRef<string[]> = computed(() => {
    const categoryNames: string[] = []

    const extractNames = (categoryList: Category[]): void => {
      categoryList.forEach((category: Category) => {
        categoryNames.push(category.name)
        if (category.subcategories && category.subcategories.length > 0) {
          extractNames(category.subcategories)
        }
      })
    }

    extractNames(categories)
    return categoryNames.sort()
  })

  // Find path for selected category
  const findPath = (): void => {
    if (!selectedCategory.value) return

    const path: CategoryPath = getCategoryPath(categories, selectedCategory.value)
    dialogTitle.value = 'Category Path Result'
    dialogMessage.value = `Category: ${selectedCategory.value}\nPath: ${path || 'Not found'}`
    showDialog.value = true
  }

  // Test all categories with proper typing
  const testAllCategories = (): void => {
    const testCases: TestCase[] = [
      { category: 'category4', expected: '/category1/category3/category4' },
      { category: 'category2', expected: '/category1/category2' },
      { category: 'category5', expected: '/category5' },
      { category: 'category1', expected: '/category1' },
      { category: 'category10', expected: '/category10' },
    ]

    const results: string[] = []

    testCases.forEach(({ category, expected }: TestCase) => {
      const actual: CategoryPath = getCategoryPath(categories, category)
      const status: 'PASS' | 'FAIL' = actual === expected ? 'PASS' : 'FAIL'
      const statusIcon: string = status === 'PASS' ? '✅' : '❌'
      results.push(`${statusIcon} ${status} ${category}: ${actual} (expected: ${expected})`)
    })

    // Test non-existent category
    const nonExistent: CategoryPath = getCategoryPath(categories, 'nonexistent')
    const nonExistentStatus: 'PASS' | 'FAIL' = nonExistent === null ? 'PASS' : 'FAIL'
    const nonExistentIcon: string = nonExistentStatus === 'PASS' ? '✅' : '❌'
    results.push(
      `${nonExistentIcon} ${nonExistentStatus} nonexistent: ${nonExistent} (expected: null)`
    )

    // Test empty string
    const emptyString: CategoryPath = getCategoryPath(categories, '')
    const emptyStringStatus: 'PASS' | 'FAIL' = emptyString === null ? 'PASS' : 'FAIL'
    const emptyStringIcon: string = emptyStringStatus === 'PASS' ? '✅' : '❌'
    results.push(
      `${emptyStringIcon} ${emptyStringStatus} empty string: ${emptyString} (expected: null)`
    )

    dialogTitle.value = 'Test Results'
    dialogMessage.value = results.join('\n')
    showDialog.value = true
  }

  // Close dialog
  const closeDialog = (): void => {
    showDialog.value = false
  }

  // Export for testing with proper typing
  defineExpose({
    getCategoryPath,
    categories,
    selectedCategory,
    findPath,
    testAllCategories,
    showDialog,
    dialogMessage,
    dialogTitle,
    closeDialog,
  })
</script>
