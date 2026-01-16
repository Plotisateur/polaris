import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { integrateModule, type IntegrationContext } from '../integrations/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  // Prompt for template - always ask if not provided as option
  let template = options.template;
  
  if (!template) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Which template would you like to use?',
        choices: [
          { name: 'Backend (Express API)', value: 'backend' },
          { name: 'Frontend (React App)', value: 'frontend' },
        ],
      },
    ]);
    template = answers.template;
  }

  const spinner = ora(`Creating project "${name}"...`).start();

  try {
    // Create project directory
    mkdirSync(projectPath, { recursive: true });

    // Get templates directory path (relative to dist/)
    const templatesDir = join(__dirname, '../templates');

    // Helper function to copy template and replace placeholders
    const copyTemplate = (templateName: string, targetPath: string) => {
      const templatePath = join(templatesDir, templateName);
      
      if (!existsSync(templatePath)) {
        throw new Error(`Template "${templateName}" not found at ${templatePath}`);
      }

      cpSync(templatePath, targetPath, { recursive: true });

      // Replace {{PROJECT_NAME}} placeholders in package.json and index.html
      const filesToReplace = ['package.json', 'README.md', 'index.html'];
      filesToReplace.forEach((file) => {
        const filePath = join(targetPath, file);
        if (existsSync(filePath)) {
          let content = readFileSync(filePath, 'utf-8');
          content = content.replace(/\{\{PROJECT_NAME\}\}/g, name);
          writeFileSync(filePath, content);
        }
      });
    };

    // Copy template based on selection
    if (template === 'backend') {
      spinner.text = 'Creating backend structure...';
      copyTemplate('backend', projectPath);
    } else if (template === 'frontend') {
      spinner.text = 'Creating frontend structure...';
      copyTemplate('frontend', projectPath);
    } else if (template === 'fullstack') {
      spinner.text = 'Creating fullstack structure...';
      copyTemplate('fullstack', projectPath);
      
      // Copy frontend and backend into apps/ directory
      const appsPath = join(projectPath, 'apps');
      copyTemplate('frontend', join(appsPath, 'frontend'));
      copyTemplate('backend', join(appsPath, 'backend'));
      
      // Replace placeholders in nested apps with proper names
      ['frontend', 'backend'].forEach((appType) => {
        const appPath = join(appsPath, appType);
        const appName = `${name}-${appType}`;
        const filesToReplace = ['package.json', 'README.md', 'index.html'];
        filesToReplace.forEach((file) => {
          const filePath = join(appPath, file);
          if (existsSync(filePath)) {
            let content = readFileSync(filePath, 'utf-8');
            content = content.replace(/\{\{PROJECT_NAME\}\}/g, appName);
            writeFileSync(filePath, content);
          }
        });
      });
    }
    
    // Create .npmrc for Polaris registry
    const npmrcContent = `# Polaris Modules Registry (Google Artifact Registry)
@polaris:registry=https://europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/
//europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/:always-auth=true
`;
    writeFileSync(join(projectPath, '.npmrc'), npmrcContent);
    
    // For fullstack, also create .npmrc in apps subdirectories
    if (template === 'fullstack') {
      writeFileSync(join(projectPath, 'apps/frontend', '.npmrc'), npmrcContent);
      writeFileSync(join(projectPath, 'apps/backend', '.npmrc'), npmrcContent);
    }

    spinner.stop();

    // Ask if user wants to add modules
    let addedModules: string[] = [];
    if (!options.yes) {
      console.log(chalk.bold('\n📦 Would you like to add any Polaris modules?\n'));
      
      // Define available modules based on template
      let moduleChoices: { name: string; value: string }[] = [];
      
      if (template === 'backend') {
        moduleChoices = [
          { name: 'Code Style (ESLint + Prettier)', value: 'code-style' },
          { name: 'Logger (Winston)', value: 'logger' },
          { name: 'Authentication (Entra ID, IAP, OIDC)', value: 'authentication' },
        ];
      } else if (template === 'frontend') {
        moduleChoices = [
          { name: 'Code Style (ESLint + Prettier)', value: 'code-style' },
          { name: 'Authentication (Auth Context)', value: 'authentication' },
        ];
      } else if (template === 'fullstack') {
        moduleChoices = [
          { name: 'Code Style (ESLint + Prettier)', value: 'code-style' },
          { name: 'Logger (Winston)', value: 'logger' },
          { name: 'Authentication (Entra ID, IAP, OIDC)', value: 'authentication' },
        ];
      }
      
      const { addModules } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'addModules',
          message: 'Select modules to install:',
          choices: moduleChoices,
        },
      ]);

      if (addModules.length > 0) {
        console.log();
        
        // Determine target directories based on template
        let targetDirs: { path: string; type: 'backend' | 'frontend' | 'fullstack' }[] = [];
        
        if (template === 'fullstack') {
          // For fullstack, install in both apps
          targetDirs = [
            { path: join(projectPath, 'apps', 'frontend'), type: 'frontend' },
            { path: join(projectPath, 'apps', 'backend'), type: 'backend' },
          ];
        } else {
          // For single template, install in root
          targetDirs = [{ path: projectPath, type: template as 'backend' | 'frontend' }];
        }
        
        for (const module of addModules) {
          const moduleName = module === 'code-style' ? 'loreal-code-style' : module === 'logger' ? 'loreal-logger' : 'loreal-authentication';
          const displayName = module === 'code-style' ? 'Code Style' : module === 'logger' ? 'Logger' : 'Authentication';
          
          for (const target of targetDirs) {
            const moduleSpinner = ora(`${displayName}`).start();
            
            try {
              // Save current directory
              const originalCwd = process.cwd();
              
              // Change to target directory
              process.chdir(target.path);
              
              // Skip npm install for:
              // - authentication on frontend (we only create context)
              // - logger on frontend (we only create console wrapper)
              const shouldInstallPackage = !(
                (module === 'authentication' && target.type === 'frontend') ||
                (module === 'logger' && target.type === 'frontend')
              );
              
              if (shouldInstallPackage) {
                // Import and run add command
                const { addCommand } = await import('./add.js');
                await addCommand(moduleName, { yes: true });
              }
              
              // Integrate module into template with correct type
              const integrationContext: IntegrationContext = {
                projectPath: target.path,
                template: target.type,
              };
              await integrateModule(module, integrationContext);
              
              // Restore directory
              process.chdir(originalCwd);
              
              moduleSpinner.succeed(displayName);
            } catch (error) {
              moduleSpinner.fail(displayName);
            }
          }
          
          addedModules.push(module);
        }
      }
    }

    spinner.succeed(chalk.green(`Project "${name}" created successfully!`));

    // Success message
    console.log(chalk.bold('\n✨ Next steps:\n'));
    console.log(chalk.cyan(`  cd ${name}`));
    console.log(chalk.cyan('  npx google-artifactregistry-auth'));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));
    
    if (addedModules.length === 0) {
      console.log(chalk.bold('\n📦 Add modules later:\n'));
      console.log(chalk.gray('  polaris add loreal-authentication'));
      console.log(chalk.gray('  polaris add loreal-logger'));
      console.log(chalk.gray('  polaris add loreal-code-style'));
    }
    console.log();
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}
