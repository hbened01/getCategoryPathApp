import { describe, it, expect, beforeEach } from "vitest"
import { mount, type VueWrapper } from "@vue/test-utils"
import CategoryPathFinder from "./CategoryPathFinder.vue"
import type { Category, CategoryPath } from "./types/category"

// Define the component instance type
type CategoryPathFinderInstance = {
  getCategoryPath: (categories: Category[], categoryName: string) => CategoryPath
  categories: Category[]
  selectedCategory: string
  findPath: () => void
  testAllCategories: () => void
  showDialog: boolean
  dialogMessage: string
  dialogTitle: string
  closeDialog: () => void
}

describe("CategoryPathFinder", () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(CategoryPathFinder)
  })

  describe("getCategoryPath function", () => {
    const categories: Category[] = [
      {
        name: "category1",
        subcategories: [
          {
            name: "category2",
            subcategories: [],
          },
          {
            name: "category3",
            subcategories: [
              {
                name: "category4",
                subcategories: [],
              },
            ],
          },
        ],
      },
      {
        name: "category5",
        subcategories: [],
      },
    ]

    it("should find path for deeply nested category", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "category4")
      expect(result).toBe("/category1/category3/category4")
    })

    it("should find path for direct subcategory", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "category2")
      expect(result).toBe("/category1/category2")
    })

    it("should find path for root level category", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "category5")
      expect(result).toBe("/category5")
    })

    it("should find path for parent category", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "category1")
      expect(result).toBe("/category1")
    })

    it("should return null for non-existent category", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "nonexistent")
      expect(result).toBe(null)
    })

    it("should handle empty categories array", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath([], "category1")
      expect(result).toBe(null)
    })

    it("should handle empty category name", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "")
      expect(result).toBe(null)
    })

    it("should handle whitespace-only category name", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "   ")
      expect(result).toBe(null)
    })

    it("should be case sensitive", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(categories, "Category1")
      expect(result).toBe(null)
    })
  })

  describe("Component UI", () => {
    it("should render the component", () => {
      expect(wrapper.find("h1").text()).toBe("Category Path Finder")
    })

    it("should have a category selector", () => {
      const selector = wrapper.find('[data-testid="category-selector"]')
      expect(selector.exists()).toBe(true)
    })

    it("should populate selector with all categories", () => {
      const selector = wrapper.find('[data-testid="category-selector"]')
      const options = selector.findAll("option")

      // Should have default option plus all categories
      expect(options.length).toBeGreaterThan(1)

      // Check if specific categories are present
      const optionTexts: string[] = options.map((option) => option.text())
      expect(optionTexts).toContain("category1")
      expect(optionTexts).toContain("category2")
      expect(optionTexts).toContain("category3")
      expect(optionTexts).toContain("category4")
      expect(optionTexts).toContain("category5")
    })

    it("should have find path button disabled initially", () => {
      const button = wrapper.find('[data-testid="find-path-button"]')
      expect(button.attributes("disabled")).toBeDefined()
    })

    it("should enable find path button when category is selected", async () => {
      const selector = wrapper.find('[data-testid="category-selector"]')
      await selector.setValue("category1")

      const button = wrapper.find('[data-testid="find-path-button"]')
      expect(button.attributes("disabled")).toBeUndefined()
    })

    it("should have test all button", () => {
      const button = wrapper.find('[data-testid="test-all-button"]')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe("Test All Categories")
    })

    it("should display category structure", () => {
      const structureSection = wrapper.find("h2")
      expect(structureSection.text()).toContain("Test All Categories")
    })
  })

  describe("Dialog functionality", () => {
    it("should not show dialog initially", () => {
      const dialog = wrapper.find('[data-testid="dialog-overlay"]')
      expect(dialog.exists()).toBe(false)
    })

    it("should show dialog when find path is clicked", async () => {
      const selector = wrapper.find('[data-testid="category-selector"]')
      await selector.setValue("category1")

      const button = wrapper.find('[data-testid="find-path-button"]')
      await button.trigger("click")

      const vm = wrapper.vm as CategoryPathFinderInstance
      expect(vm.showDialog).toBe(true)
    })

    it("should show correct path in dialog", async () => {
      const selector = wrapper.find('[data-testid="category-selector"]')
      await selector.setValue("category4")

      const button = wrapper.find('[data-testid="find-path-button"]')
      await button.trigger("click")

      const vm = wrapper.vm as CategoryPathFinderInstance
      expect(vm.dialogMessage).toContain("/category1/category3/category4")
    })

    it("should close dialog when close button is clicked", async () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      // Open dialog first
      vm.showDialog = true
      await wrapper.vm.$nextTick()

      const closeButton = wrapper.find('[data-testid="close-dialog-button"]')
      await closeButton.trigger("click")

      expect(vm.showDialog).toBe(false)
    })

    it("should close dialog when overlay is clicked", async () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      // Open dialog first
      vm.showDialog = true
      await wrapper.vm.$nextTick()

      const overlay = wrapper.find('[data-testid="dialog-overlay"]')
      await overlay.trigger("click")

      expect(vm.showDialog).toBe(false)
    })
  })

  describe("Test all functionality", () => {
    it("should run all tests when test all button is clicked", async () => {
      const button = wrapper.find('[data-testid="test-all-button"]')
      await button.trigger("click")

      const vm = wrapper.vm as CategoryPathFinderInstance
      expect(vm.showDialog).toBe(true)
      expect(vm.dialogMessage).toContain("✅ PASS")
      expect(vm.dialogMessage).toContain("category4: /category1/category3/category4")
      expect(vm.dialogMessage).toContain("category2: /category1/category2")
      expect(vm.dialogMessage).toContain("category5: /category5")
      expect(vm.dialogMessage).toContain("category1: /category1")
      expect(vm.dialogMessage).toContain("nonexistent: null")
    })

    it("should test edge cases in test all functionality", async () => {
      const button = wrapper.find('[data-testid="test-all-button"]')
      await button.trigger("click")

      const vm = wrapper.vm as CategoryPathFinderInstance
      expect(vm.dialogMessage).toContain("empty string: null")
    })
  })

  describe("Edge cases and TypeScript specific tests", () => {
    it("should handle category selection and deselection", async () => {
      const selector = wrapper.find('[data-testid="category-selector"]')
      const vm = wrapper.vm as CategoryPathFinderInstance

      // Select a category
      await selector.setValue("category1")
      expect(vm.selectedCategory).toBe("category1")

      // Deselect
      await selector.setValue("")
      expect(vm.selectedCategory).toBe("")
    })

    it("should handle multiple dialog operations", async () => {
      const vm = wrapper.vm as CategoryPathFinderInstance

      // First operation
      const selector = wrapper.find('[data-testid="category-selector"]')
      await selector.setValue("category1")

      const findButton = wrapper.find('[data-testid="find-path-button"]')
      await findButton.trigger("click")

      expect(vm.showDialog).toBe(true)

      // Close dialog
      vm.closeDialog()
      await wrapper.vm.$nextTick()

      expect(vm.showDialog).toBe(false)

      // Second operation
      const testButton = wrapper.find('[data-testid="test-all-button"]')
      await testButton.trigger("click")

      expect(vm.showDialog).toBe(true)
    })

    it("should maintain type safety for categories array", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      expect(Array.isArray(vm.categories)).toBe(true)
      expect(vm.categories.length).toBeGreaterThan(0)

      // Check that each category has the required properties
      vm.categories.forEach((category: Category) => {
        expect(typeof category.name).toBe("string")
        expect(Array.isArray(category.subcategories)).toBe(true)
      })
    })
  })

  describe("TypeScript type checking", () => {
    it("should properly type the getCategoryPath return value", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const result: CategoryPath = vm.getCategoryPath(vm.categories, "category1")

      // TypeScript should ensure result is string | null
      expect(typeof result === "string" || result === null).toBe(true)
    })

    it("should properly handle typed category structure", () => {
      const vm = wrapper.vm as CategoryPathFinderInstance
      const testCategory: Category = {
        name: "test",
        subcategories: [],
      }

      const result: CategoryPath = vm.getCategoryPath([testCategory], "test")
      expect(result).toBe("/test")
    })
  })
})
