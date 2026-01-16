# {{PROJECT_NAME}}

React application with Vite, TypeScript, React Router, and **Tailwind CSS v4**.

## Features

- ⚡ **Vite 6** - Fast build tool
- ⚛️ **React 19** - Latest React
- 🎨 **Tailwind CSS v4** - New `@import` syntax, no config file
- 🧩 **shadcn/ui** - Pre-configured
- 🛣️ **React Router v7** - Client-side routing
- 🧪 **Vitest** - Fast testing

## Tailwind CSS v4

This template uses **Tailwind CSS v4** with the new syntax:

```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #0f172a;
  --radius: 0.5rem;
}
```

**No `tailwind.config.js` needed!** Everything is in CSS.

## shadcn/ui

Add components on demand:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code
