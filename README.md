# 🌟 Polaris L'Oréal

> **Internal module system for Node.js projects at L'Oréal**

Polaris provides production-ready, zero-config modules for authentication, logging, and more. Install modules with one command and start building.

---

## 🚀 Installation

**One-time setup** (on any machine):

```bash
# Bash/Zsh (Linux/Mac)
npm config set '@polaris:registry' 'https://europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/' && echo "//europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/:always-auth=true" >> ~/.npmrc && npx google-artifactregistry-auth && npm install -g @polaris/cli

# PowerShell (Windows)
npm config set '@polaris:registry' 'https://europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/'; Add-Content $HOME\.npmrc "//europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/:always-auth=true"; npx google-artifactregistry-auth; npm install -g @polaris/cli
```

**Usage** (in any project):

```bash
polaris add loreal-authentication  # Zero-config IAP authentication
polaris add loreal-logger          # Structured logging
```

---

## 📦 Available Modules

### ✅ Published

- **[@polaris/authentication](packages/modules/loreal-authentication)** - Zero-config Google IAP authentication with Express middleware
- **[@polaris/logger](packages/modules/loreal-logger)** - Structured logging with Winston, Cloud Logging, and Sentry support
- **[@polaris/code-style](packages/modules/loreal-code-style)** - Shared ESLint, Prettier, and TypeScript configuration

### � In Development

- **loreal-authentication** - OIDC, Entra ID, and Google IAP authentication
- **loreal-prisma-orm-setup** - Database setup with Prisma ORM
- **loreal-e2e-api** - Express API scaffolding with OpenAPI generation
- **loreal-design-system** - React component library with Tailwind
- **loreal-authorization** - Role-based and attribute-based access control
- **loreal-emails** - Email templates with SendGrid/Resend
- **loreal-analytics** - Google Analytics + custom event tracking
- **loreal-feature-flag** - Feature flags with LaunchDarkly/custom solution

---

## 🏗️ Development

Want to contribute or publish new modules?

```bash
# Clone and install
git clone <repo>
cd polaris-loreal
pnpm install

# Build all packages
pnpm build

# Publish a new module
cd packages/modules/loreal-<module>
npm publish

# Build CLI
cd packages/cli
pnpm build
npm publish
```

---

## 📁 Project Structure

```
polaris-loreal/
├── packages/
│   ├── cli/                          # @polaris/cli (published)
│   └── modules/
│       ├── loreal-authentication/    # @polaris/authentication (published)
│       └── loreal-logger/            # @polaris/logger (published)
└── examples/                         # Example projects
    └── api-with-auth/                # Express API with IAP + logging
```

---

## 📝 License

**PROPRIETARY** - Internal L'Oréal use only

---

_Built with ❤️ by L'Oréal Engineering_
