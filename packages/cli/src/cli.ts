#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { setupCommand } from './commands/setup.js';
import { getVersion } from './utils/version.js';

const program = new Command();

program
  .name('polaris')
  .description("L'Oréal Polaris Framework CLI - Scaffold and enhance your projects")
  .version(getVersion());

// polaris init command
program
  .command('init')
  .description('Initialize a new Polaris project')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use (express-api, react-app)', 'express-api')
  .option('-y, --yes', 'Skip prompts and use defaults', false)
  .action(initCommand);

// polaris setup command
program
  .command('setup')
  .description('Configure an existing project to use Polaris modules')
  .action(setupCommand);

// polaris add command
program
  .command('add')
  .description('Add a Polaris module to your project')
  .argument('<module>', 'Module name (e.g., loreal-logger, loreal-authentication)')
  .option('-y, --yes', 'Skip prompts and use defaults', false)
  .action(addCommand);

// polaris list command
program
  .command('list')
  .description('List all available Polaris modules')
  .action(() => {
    console.log('\n📦 Available Polaris Modules:\n');
    console.log('✅ Published:');
    console.log('  • loreal-logger              - Winston + Sentry logging');
    console.log('  • loreal-authentication      - Google IAP authentication\n');
    console.log('🔜 In Development:');
    console.log("  • loreal-code-style          - ESLint + Prettier for L'Oréal");
    console.log('  • loreal-testing             - Vitest + Playwright setup');
    console.log('  • loreal-prisma-orm-setup    - Prisma ORM configuration');
    console.log('  • loreal-e2e-api             - Express API scaffolding');
    console.log('  • loreal-design-system       - React component library');
    console.log('  • loreal-authorization       - RBAC + ABAC');
    console.log('  • loreal-emails              - Email templates');
    console.log('  • loreal-analytics           - GA + custom tracking');
    console.log('  • loreal-feature-flag        - Feature flag management\n');
  });

program.parse();
