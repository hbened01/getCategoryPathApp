# Vue 3 Category Path Finder

A modern Vue 3 application built with TypeScript and Composition API that finds paths in nested category structures.

## Features

- 🚀 Vue 3 with Composition API
- 📘 Full TypeScript support
- 🎨 Tailwind CSS for styling
- 🧪 Comprehensive testing with Vitest
- 🔍 Interactive category path finder
- 📱 Responsive design
- ♿ Accessibility features

## Tech Stack

- **Framework**: Vue 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Vue Test Utils
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/hbened01/getCategoryPathApp.git
cd getCategoryPathApp
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier

## Usage

The application provides an interface to:

1. **Select Categories**: Choose from a dropdown of available categories
2. **Find Paths**: Get the full path to any category in the nested structure
3. **Test All**: Run comprehensive tests on all categories
4. **View Results**: See results in a modal dialog

### Example Category Structure

\`\`\`javascript
const categories = [
  {
    name: 'category1',
    subcategories: [
      {
        name: 'category2',
        subcategories: []
      },
      {
        name: 'category3',
        subcategories: [
          {
            name: 'category4',
            subcategories: []
          }
        ]
      }
    ]
  },
  {
    name: 'category5',
    subcategories: []
  }
];
\`\`\`

### Expected Outputs

- `category4` → `/category1/category3/category4`
- `category2` → `/category1/category2`
- `category5` → `/category5`
- `category1` → `/category1`

## Testing

The project includes comprehensive tests covering:

- Unit tests for the `getCategoryPath` function
- Component tests for UI interactions
- Integration tests for dialog functionality
- Edge case testing
- TypeScript type safety tests

Run tests with:
\`\`\`bash
npm run test
\`\`\`

## Project Structure

\`\`\`
src/
├── components/
│   └── CategoryPathFinder.vue
├── types/
│   └── category.ts
├── tests/
│   └── CategoryPathFinder.test.ts
├── App.vue
├── main.ts
└── style.css
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
