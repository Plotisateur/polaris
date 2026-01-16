import chalk from 'chalk';
import ora from 'ora';

type AddOptions = {
  yes: boolean;
};

type ModuleInfo = {
  name: string;
  packageName: string;
  displayName: string;
  description: string;
  published: boolean;
};

const AVAILABLE_MODULES: Record<string, ModuleInfo> = {
  'loreal-code-style': {
    name: 'loreal-code-style',
    packageName: '@polaris/code-style',
    displayName: 'Code Style',
    description: "ESLint + Prettier configurations for L'Oréal standards",
    published: false,
  },
  'loreal-logger': {
    name: 'loreal-logger',
    packageName: '@polaris/logger',
    displayName: 'Logger',
    description: 'Structured logging with Winston + Sentry integration',
    published: true,
  },
  'loreal-testing': {
    name: 'loreal-testing',
    packageName: '@polaris/testing',
    displayName: 'Testing',
    description: 'Vitest + Testing Library + Playwright setup',
    published: false,
  },
  'loreal-authentication': {
    name: 'loreal-authentication',
    packageName: '@polaris/authentication',
    displayName: 'Authentication',
    description: 'OIDC, Entra ID, and Google IAP authentication providers',
    published: true,
  },
  'loreal-authorization': {
    name: 'loreal-authorization',
    packageName: '@polaris/authorization',
    displayName: 'Authorization',
    description: 'Role-based and attribute-based access control (RBAC + ABAC)',
    published: false,
  },
  'loreal-emails': {
    name: 'loreal-emails',
    packageName: '@polaris/emails',
    displayName: 'Emails',
    description: 'Email templates with SendGrid/Resend integration',
    published: false,
  },
  'loreal-analytics': {
    name: 'loreal-analytics',
    packageName: '@polaris/analytics',
    displayName: 'Analytics',
    description: 'Google Analytics + custom event tracking',
    published: false,
  },
  'loreal-prisma-orm-setup': {
    name: 'loreal-prisma-orm-setup',
    packageName: '@polaris/prisma-orm-setup',
    displayName: 'Prisma ORM Setup',
    description: 'Database setup with Prisma ORM',
    published: false,
  },
  'loreal-e2e-api': {
    name: 'loreal-e2e-api',
    packageName: '@polaris/e2e-api',
    displayName: 'E2E API Generator',
    description: 'Express API scaffolding with OpenAPI generation',
    published: false,
  },
  'loreal-feature-flag': {
    name: 'loreal-feature-flag',
    packageName: '@polaris/feature-flag',
    displayName: 'Feature Flags',
    description: 'Feature flag management system',
    published: false,
  },
  'loreal-design-system': {
    name: 'loreal-design-system',
    packageName: '@polaris/design-system',
    displayName: 'Design System',
    description: 'React component library with Tailwind CSS',
    published: false,
  },
};

export async function addCommand(moduleName: string, options: AddOptions): Promise<void> {
  const silent = options.yes;
  
  if (!silent) {
    console.log(chalk.bold.blue(`\n🔧 Adding module: ${moduleName}\n`));
  }

  // Check if .npmrc exists, if not run setup automatically
  const { existsSync } = await import('fs');
  const path = await import('path');
  const npmrcPath = path.join(process.cwd(), '.npmrc');

  if (!existsSync(npmrcPath)) {
    if (!silent) {
      console.log(chalk.yellow('⚠️  Project not configured for Polaris. Running setup...\n'));
    }
    const { setupCommand } = await import('./setup.js');
    await setupCommand();
    if (!silent) {
      console.log(); // Empty line
    }
  }

  const module = AVAILABLE_MODULES[moduleName];
  if (!module) {
    console.log(chalk.red(`❌ Module "${moduleName}" not found!\n`));
    console.log(chalk.yellow('Available modules:'));
    Object.keys(AVAILABLE_MODULES).forEach((key) => {
      const mod = AVAILABLE_MODULES[key];
      if (mod) {
        console.log(chalk.cyan(`  • ${key}`) + chalk.gray(` - ${mod.description}`));
      }
    });
    console.log();
    process.exit(1);
  }

  let spinner;
  if (!silent) {
    spinner = ora(`Installing ${module.displayName}...`).start();
  }

  try {
    const { execSync } = await import('child_process');

    const installCommand = `npm install ${module.packageName}`;

    execSync(installCommand, {
      stdio: silent ? 'pipe' : 'inherit',
      cwd: process.cwd(),
    });

    if (spinner) {
      spinner.succeed(chalk.green(`${module.displayName} installed successfully!`));
    }

    if (!silent && moduleName === 'loreal-logger') {
      console.log(chalk.bold('📝 Example:\n'));
      console.log(chalk.gray(`  import { log } from '${module.packageName}';`));
      console.log(chalk.gray(`  `));
      console.log(chalk.gray(`  log.info('User logged in', { userId: '123' });`));
      console.log(chalk.gray(`  log.error('Error occurred', new Error('...'));`));
      console.log();
    }
  } catch (error) {
    if (spinner) {
      spinner.fail(chalk.red('Failed to add module'));
    }
    if (!silent) {
      console.error(error);
    }
    process.exit(1);
  }
}
