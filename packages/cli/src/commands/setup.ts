import chalk from 'chalk';
import ora from 'ora';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

export async function setupCommand(): Promise<void> {
  console.log(chalk.bold.blue('\n🔧 Setting up Polaris in existing project...\n'));

  const spinner = ora('Configuring project...').start();

  try {
    const projectPath = process.cwd();
    const npmrcPath = join(projectPath, '.npmrc');
    const packageJsonPath = join(projectPath, 'package.json');

    // Create package.json if it doesn't exist
    if (!existsSync(packageJsonPath)) {
      const packageJson = {
        name: 'my-project',
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'node index.js',
          start: 'node index.js'
        },
        dependencies: {}
      };
      writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      spinner.text = 'Created package.json';
    }

    // Check if .npmrc already exists
    if (existsSync(npmrcPath)) {
      spinner.info(chalk.yellow('.npmrc already exists, skipping...'));
    } else {
      // Create .npmrc with Polaris registry configuration
      const npmrcContent = `# Polaris Modules Registry (Google Artifact Registry)
@polaris:registry=https://europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/
//europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/:always-auth=true
`;
      writeFileSync(npmrcPath, npmrcContent);
      spinner.text = 'Created .npmrc configuration';
    }

    // Authenticate with Google Artifact Registry
    spinner.text = 'Authenticating with Google Artifact Registry...';
    try {
      execSync('npx google-artifactregistry-auth', {
        stdio: 'pipe',
        cwd: projectPath,
      });
    } catch (error) {
      spinner.warn(chalk.yellow('Authentication failed. Please run manually:'));
      console.log(chalk.cyan('  npx google-artifactregistry-auth\n'));
    }

    spinner.succeed(chalk.green('Polaris setup complete!'));

    // Success message
    console.log(chalk.bold('\n✨ Your project is now configured for Polaris!\n'));
    console.log(chalk.bold('📦 Add modules:\n'));
    console.log(chalk.cyan('  polaris add loreal-authentication'));
    console.log(chalk.cyan('  polaris add loreal-logger'));
    console.log();
    console.log(chalk.bold('📚 Documentation:\n'));
    console.log(chalk.gray('  https://github.com/loreal-techaccelerator-modules\n'));

  } catch (error) {
    spinner.fail(chalk.red('Setup failed'));
    console.error(error);
    process.exit(1);
  }
}
