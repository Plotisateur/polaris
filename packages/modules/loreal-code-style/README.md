# @polaris/code-style

> Shared code style configuration for L'Oréal projects

This package provides shared ESLint, Prettier, and TypeScript configurations to ensure consistent code quality and formatting across all Polaris modules and L'Oréal projects.

## 📦 Installation

```bash
npm install --save-dev @polaris/code-style eslint prettier typescript
```

## 🚀 Usage

### ESLint

Create `eslint.config.js` in your project root:

```js
import codeStyle from '@polaris/code-style/eslint';

export default codeStyle;
```

Or extend with custom rules:

```js
import codeStyle from '@polaris/code-style/eslint';

export default [
  ...codeStyle,
  {
    rules: {
      // Your custom rules
    },
  },
];
```

### Prettier

Create `.prettierrc.js` in your project root:

```js
import codeStyle from '@polaris/code-style/prettier';

export default codeStyle;
```

### TypeScript

For **Node.js/Backend** projects, create `tsconfig.json`:

```json
{
  "extends": "@polaris/code-style/tsconfig",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

For **React/Frontend** projects, create `tsconfig.json`:

```json
{
  "extends": "@polaris/code-style/tsconfig-react",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit"
  }
}
```

## 🎯 What's Included

### ESLint Rules

- **TypeScript strict rules**: Enforces type safety with no-explicit-any warnings, consistent type imports
- **Import ordering**: Automatically organizes imports by type (builtin → external → internal → relative)
- **React best practices**: Hooks rules, prop-types disabled (using TypeScript instead)
- **Code quality**: Complexity limits (15), max depth (4), max lines (500), max params (5)
- **L'Oréal specific**:
  - ⚠️ Warns on `console.log` usage (use `@polaris/logger` instead)
  - 🚫 Blocks `console.debug` (allows `console.warn` and `console.error`)
  - ✅ Enforces `type` imports for better tree-shaking

### Prettier Configuration

- **100 character** line width
- **Single quotes** for strings
- **Semicolons** required
- **2 spaces** indentation
- **Trailing commas** in ES5 (objects, arrays)
- **LF** line endings (Unix-style)

### TypeScript Configuration

#### Base (`tsconfig.base.json`)
- **Strict mode** enabled
- **ES2022** target with **ESNext** modules
- **Bundler** module resolution
- **Source maps** and **declaration maps** enabled
- **No unused** locals or parameters
- **No unchecked indexed access** (strict array/object access)

#### React (`tsconfig.react.json`)
- Extends base configuration
- Adds **DOM** and **DOM.Iterable** libraries
- **JSX** support with `react-jsx` transform
- **Node types** included

## 🔧 Git Hooks Setup (Optional)

Install lint-staged and husky for pre-commit checks:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Create `.husky/pre-commit`:

```bash
#!/bin/sh
npx lint-staged
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

## 📚 VS Code Integration

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

## 🎨 Philosophy

This configuration enforces:

1. **Type Safety**: Strict TypeScript with no implicit any, enforced type imports
2. **Code Quality**: Complexity and size limits to encourage maintainable code
3. **Consistency**: Automatic formatting removes style debates
4. **L'Oréal Standards**: Enforces usage of Polaris modules (@polaris/logger over console.log)
5. **Developer Experience**: Auto-fix on save, pre-commit hooks prevent bad code from entering the repo

## 📖 Related Packages

- [@polaris/authentication](../loreal-authentication) - Authentication middleware and React hooks
- [@polaris/logger](../loreal-logger) - Structured logging (use instead of console.log!)

## 📄 License

ISC - L'Oréal
