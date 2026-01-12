import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

type InitOptions = {
  template: string;
  yes: boolean;
};

export async function initCommand(
  projectName: string | undefined,
  options: InitOptions
): Promise<void> {
  console.log(chalk.bold.blue('\n🌟 Welcome to Polaris L\'Oréal Framework!\n'));

  // Prompt for project name if not provided
  let name = projectName;
  if (!name) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-loreal-app',
      },
    ]);
    name = answers.projectName;
  }

  if (!name) {
    console.log(chalk.red('\n❌ Project name is required!\n'));
    process.exit(1);
  }

  const projectPath = join(process.cwd(), name);

  // Check if directory exists
  if (existsSync(projectPath)) {
    console.log(chalk.red(`\n❌ Directory "${name}" already exists!\n`));
    process.exit(1);
  }

  // Prompt for template only
  let template = options.template;
  
  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Which template would you like to use?',
        choices: [
          { name: 'Backend only (Express API)', value: 'backend' },
          { name: 'Frontend only (React App)', value: 'frontend' },
          { name: 'Full Stack (React + Express)', value: 'fullstack' },
        ],
        default: 'backend',
      },
    ]);
    template = answers.template;
  }

  const spinner = ora(`Creating project "${name}"...`).start();

  try {
    // Create project directory
    mkdirSync(projectPath, { recursive: true });

    const repos = {
      backend: 'https://github.com/loreal-techaccelerator-modules/project-template-back.git',
      frontend: 'https://github.com/loreal-techaccelerator-modules/project-template-front.git',
    };

    // Clone backend template
    if (template === 'backend' || template === 'fullstack') {
      spinner.text = 'Cloning backend template...';
      const backendPath = template === 'fullstack' ? join(projectPath, 'backend') : projectPath;
      execSync(`git clone --depth 1 ${repos.backend} "${backendPath}"`, { stdio: 'pipe' });
      
      // Remove .git directory
      rmSync(join(backendPath, '.git'), { recursive: true, force: true });
    }

    // Clone frontend template
    if (template === 'frontend' || template === 'fullstack') {
      spinner.text = 'Cloning frontend template...';
      const frontendPath = template === 'fullstack' ? join(projectPath, 'frontend') : projectPath;
      execSync(`git clone --depth 1 ${repos.frontend} "${frontendPath}"`, { stdio: 'pipe' });
      
      // Remove .git directory
      rmSync(join(frontendPath, '.git'), { recursive: true, force: true });
    }

    // Create workspace config for fullstack
    if (template === 'fullstack') {
      const workspaceConfig = {
        name,
        version: '1.0.0',
        private: true,
        workspaces: ['frontend', 'backend'],
        scripts: {
          'dev:frontend': 'npm run dev --workspace=frontend',
          'dev:backend': 'npm run dev --workspace=backend',
          'dev': 'npm run dev:backend & npm run dev:frontend',
          'build': 'npm run build --workspaces',
        },
      };
      writeFileSync(join(projectPath, 'package.json'), JSON.stringify(workspaceConfig, null, 2));
    }

    // Create README
    const readmeContent = `# ${name}

Created with Polaris L'Oréal Framework

## Getting Started

\`\`\`bash
# Install dependencies
${template === 'fullstack' ? 'npm install' : 'npm install'}

# Run development server
npm run dev
\`\`\`

${template === 'fullstack' ? `
## Workspace Structure

- \`frontend/\` - React application
- \`backend/\` - Express API

## Available Scripts

- \`npm run dev\` - Start both frontend and backend
- \`npm run dev:frontend\` - Start frontend only
- \`npm run dev:backend\` - Start backend only
- \`npm run build\` - Build all workspaces
` : ''}

## Add Polaris Modules

\`\`\`bash
# Add authentication
polaris add loreal-authentication

# Add logger
polaris add loreal-logger
\`\`\`
`;

    writeFileSync(join(projectPath, 'README.md'), readmeContent);
    
    // Create .npmrc for Polaris registry
    const npmrcContent = `# Polaris Modules Registry (Google Artifact Registry)
@polaris:registry=https://europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/
//europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/:always-auth=true
`;
    writeFileSync(join(projectPath, '.npmrc'), npmrcContent);

    spinner.succeed(chalk.green(`Project "${name}" created successfully!`));

    // Success message
    console.log(chalk.bold('\n✨ Next steps:\n'));
    console.log(chalk.cyan(`  cd ${name}`));
    console.log(chalk.cyan('  npx google-artifactregistry-auth  # Authenticate with Google registry'));
    if (template === 'fullstack') {
      console.log(chalk.cyan('  npm install'));
      console.log(chalk.cyan('  npm run dev'));
    } else {
      console.log(chalk.cyan('  npm install'));
      console.log(chalk.cyan('  npm run dev'));
    }
    
    console.log(chalk.bold('\n� Add modules:\n'));
    console.log(chalk.gray('  polaris add loreal-authentication'));
    console.log(chalk.gray('  polaris add loreal-logger'));
    console.log();
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}
