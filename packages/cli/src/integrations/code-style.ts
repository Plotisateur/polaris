import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { IntegrationContext } from './logger.js';

export async function integrateCodeStyle(context: IntegrationContext): Promise<void> {
  const { projectPath, template } = context;

  if (template === 'backend') {
    await integrateCodeStyleProject(projectPath);
  } else if (template === 'frontend') {
    await integrateCodeStyleProject(projectPath);
  } else if (template === 'fullstack') {
    await integrateCodeStyleProject(join(projectPath, 'apps/backend'));
    await integrateCodeStyleProject(join(projectPath, 'apps/frontend'));
  }
}

async function integrateCodeStyleProject(projectPath: string): Promise<void> {
  // 1. Create eslint.config.js
  const eslintConfigPath = join(projectPath, 'eslint.config.js');
  if (!existsSync(eslintConfigPath)) {
    const eslintContent = `import polarisConfig from '@polaris/code-style';

export default polarisConfig;
`;
    writeFileSync(eslintConfigPath, eslintContent);
  }

  // 2. Create .prettierrc
  const prettierConfigPath = join(projectPath, '.prettierrc');
  if (!existsSync(prettierConfigPath)) {
    const prettierContent = `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
`;
    writeFileSync(prettierConfigPath, prettierContent);
  }

  // 3. Create .prettierignore
  const prettierIgnorePath = join(projectPath, '.prettierignore');
  if (!existsSync(prettierIgnorePath)) {
    const prettierIgnoreContent = `node_modules
dist
build
coverage
.next
*.log
`;
    writeFileSync(prettierIgnorePath, prettierIgnoreContent);
  }
}
