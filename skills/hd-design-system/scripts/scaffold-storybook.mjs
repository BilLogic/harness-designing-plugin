#!/usr/bin/env node
/**
 * scaffold-storybook.mjs — writes .storybook/* config + decorators + harness-blocks
 *
 * Called by /hd:design-system establish at Step 2 (Storybook foundation).
 *
 * Inputs:
 *   --repo <path>          target repo root (default: cwd)
 *   --framework <id>       @storybook/<framework>-<bundler>; default react-vite
 *   --modes <list>         comma-separated theme modes (default: light,dark)
 *   --brands <list>        comma-separated brand names (default: default)
 *   --existing <handling>  no-existing | adopt | preserve (default: no-existing)
 *   --dry-run              print planned writes without executing
 *
 * Reads templates from:
 *   ../assets/storybook/main.js.template
 *   ../assets/storybook/preview.js.template
 *   ../assets/decorators/*.tsx.template (6 files)
 *   ../assets/harness-blocks/*.tsx (15 files; copied verbatim, not templated)
 *   ../assets/harness-blocks/harness-styles.css
 *
 * Writes to:
 *   <repo>/.storybook/main.js
 *   <repo>/.storybook/preview.js
 *   <repo>/.storybook/decorators/<name>.tsx (6 files)
 *   <repo>/.storybook/harness-blocks/<Name>.tsx (15 files)
 *   <repo>/.storybook/harness-blocks/harness-styles.css
 *   <repo>/.storybook/harness-blocks/index.ts (re-exports)
 *
 * Idempotent: never overwrites if file exists unless --force. Diff preview shown
 * by the calling skill, not this script.
 *
 * Exit 0 on success; non-zero on I/O failure.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, '..', 'assets');

const args = parseArgs({
  options: {
    repo: { type: 'string', default: process.cwd() },
    framework: { type: 'string', default: '@storybook/react-vite' },
    modes: { type: 'string', default: 'light,dark' },
    brands: { type: 'string', default: 'default' },
    existing: { type: 'string', default: 'no-existing' },
    'dry-run': { type: 'boolean', default: false },
    force: { type: 'boolean', default: false },
  },
}).values;

const REPO = resolve(args.repo);
const STORYBOOK_DIR = join(REPO, '.storybook');
const MODES = JSON.stringify(args.modes.split(',').map(s => s.trim()));
const BRANDS = JSON.stringify(args.brands.split(',').map(s => s.trim()));

if (args.existing === 'preserve') {
  console.log('preserve mode → skipping Storybook scaffold');
  process.exit(0);
}

function substitute(content) {
  return content
    .replaceAll('{{FRAMEWORK}}', args.framework)
    .replaceAll('{{MODES}}', MODES)
    .replaceAll('{{BRANDS}}', BRANDS)
    .replaceAll('{{TEAM_THEME_PROVIDER_PATH}}', '../src/theme/ThemeProvider');
}

function mkdir(path) {
  if (!existsSync(path)) {
    if (args['dry-run']) {
      console.log(`mkdir ${path}`);
    } else {
      mkdirSync(path, { recursive: true });
    }
  }
}

function writeIfMissing(path, content) {
  if (existsSync(path) && !args.force) {
    console.log(`skip (exists): ${path}`);
    return;
  }
  if (args['dry-run']) {
    console.log(`write ${path} (${content.length} bytes)`);
    return;
  }
  mkdir(dirname(path));
  writeFileSync(path, content);
  console.log(`write ${path}`);
}

function copyIfMissing(src, dst) {
  if (existsSync(dst) && !args.force) {
    console.log(`skip (exists): ${dst}`);
    return;
  }
  if (args['dry-run']) {
    console.log(`copy ${src} → ${dst}`);
    return;
  }
  mkdir(dirname(dst));
  copyFileSync(src, dst);
  console.log(`copy ${src} → ${dst}`);
}

// 1. main.js + preview.js (templated)
mkdir(STORYBOOK_DIR);
const mainTpl = readFileSync(join(ASSETS, 'storybook', 'main.js.template'), 'utf8');
const previewTpl = readFileSync(join(ASSETS, 'storybook', 'preview.js.template'), 'utf8');
writeIfMissing(join(STORYBOOK_DIR, 'main.js'), substitute(mainTpl));
writeIfMissing(join(STORYBOOK_DIR, 'preview.js'), substitute(previewTpl));

// 2. Decorators (templated — substitute team-specific paths)
const decoratorsSrc = join(ASSETS, 'decorators');
const decoratorsDst = join(STORYBOOK_DIR, 'decorators');
mkdir(decoratorsDst);
for (const f of readdirSync(decoratorsSrc)) {
  if (!f.endsWith('.tsx.template')) continue;
  const tpl = readFileSync(join(decoratorsSrc, f), 'utf8');
  const outName = f.replace(/\.template$/, '');
  writeIfMissing(join(decoratorsDst, outName), substitute(tpl));
}

// 3. Harness blocks (verbatim copy; users edit in their .storybook/)
const blocksSrc = join(ASSETS, 'harness-blocks');
const blocksDst = join(STORYBOOK_DIR, 'harness-blocks');
mkdir(blocksDst);
if (existsSync(blocksSrc)) {
  for (const f of readdirSync(blocksSrc)) {
    const srcPath = join(blocksSrc, f);
    if (statSync(srcPath).isFile()) {
      copyIfMissing(srcPath, join(blocksDst, f));
    }
  }
}

console.log('\n✓ Storybook scaffold complete');
console.log(`  framework: ${args.framework}`);
console.log(`  modes:     ${args.modes}`);
console.log(`  brands:    ${args.brands}`);
console.log('\nRecommended next:');
console.log('  npm install --save-dev @storybook/addon-a11y @storybook/addon-docs storybook-design-token');
console.log('  npm run storybook');
