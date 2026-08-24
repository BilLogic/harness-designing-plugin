#!/usr/bin/env node
/**
 * generate-tracker.mjs — render docs/context/design-system/0-welcome/Tracker.mdx
 *
 * Algorithm (4 phases, see references/tracker-format.md):
 *   1. Read index-manifest.json for scenario + folder enablement
 *   2. Walk every .mdx; collect status frontmatter + count <!-- TODO --> markers
 *   3. Cross-check components-index.json ↔ files for orphans
 *   4. Compute next-5 actions ranked by importance × ease
 *
 * Usage:
 *   node generate-tracker.mjs --repo <path>
 *
 * Inputs (read):
 *   <repo>/docs/context/design-system/index-manifest.json
 *   <repo>/docs/context/design-system/4-components/components-index.json
 *   <repo>/docs/context/design-system/<n>-<folder>/*.mdx
 *
 * Output (write):
 *   <repo>/docs/context/design-system/0-welcome/Tracker.mdx
 *
 * Exit 0 on success; non-zero on I/O failure.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, basename, dirname, resolve, relative } from 'node:path';
import { parseArgs } from 'node:util';

const args = parseArgs({
  options: { repo: { type: 'string', default: process.cwd() } },
}).values;

const REPO = resolve(args.repo);
const DS_ROOT = join(REPO, 'docs', 'context', 'design-system');

if (!existsSync(DS_ROOT)) {
  console.error(`error: ${DS_ROOT} does not exist. Run /hd:design-system establish first.`);
  process.exit(2);
}

const MANIFEST_PATH = join(DS_ROOT, 'index-manifest.json');
const manifest = existsSync(MANIFEST_PATH)
  ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
  : { scenario: 'starter', folders_enabled: {}, storybook: { enabled: false } };

const COMPONENTS_INDEX_PATH = join(DS_ROOT, '4-components', 'components-index.json');
const componentsIndex = existsSync(COMPONENTS_INDEX_PATH)
  ? JSON.parse(readFileSync(COMPONENTS_INDEX_PATH, 'utf8'))
  : [];

// ----- Phase 1: enabled folders -----
const enabledFolders = [
  '0-welcome',
  '1-foundations',
  '2-styles',
  '3-assets',
  '4-components',
  ...(manifest.folders_enabled?.patterns ? ['5-patterns'] : []),
  ...(manifest.folders_enabled?.data_viz ? ['6-data-viz'] : []),
  ...(manifest.folders_enabled?.specs ? ['7-specs'] : []),
];

// ----- Phase 2: walk + collect -----
function walkMdx(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkMdx(p));
    else if (entry.endsWith('.mdx')) out.push(p);
  }
  return out;
}

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

function countTodos(content) {
  const matches = content.match(/<!--\s*TODO/g);
  return matches ? matches.length : 0;
}

function inferStatus(fm, todos, exists) {
  if (!exists) return 'empty';
  if (fm.status && ['empty', 'placeholder', 'in-progress', 'filled'].includes(fm.status)) {
    return fm.status;
  }
  if (todos === 0) return 'filled';
  if (fm.last_filled) return 'in-progress';
  return 'placeholder';
}

const files = [];
for (const folder of enabledFolders) {
  const folderPath = join(DS_ROOT, folder);
  const mdxFiles = walkMdx(folderPath);
  for (const path of mdxFiles) {
    const content = readFileSync(path, 'utf8');
    const fm = parseFrontmatter(content);
    const todos = countTodos(content);
    files.push({
      folder,
      path: relative(REPO, path),
      name: basename(path, '.mdx'),
      status: inferStatus(fm, todos, true),
      last_filled: fm.last_filled || '—',
      todos,
    });
  }
}

// ----- Phase 3: cross-check -----
const componentNamesInIndex = new Set(componentsIndex.map(c => c.name?.toLowerCase()).filter(Boolean));
const componentNamesOnDisk = new Set(
  files.filter(f => f.folder === '4-components')
    .map(f => f.name.toLowerCase())
);
const SPECIAL = new Set(['inventory', 'cheat-sheet', 'patterns', 'components-index']);
const orphansInIndex = [...componentNamesInIndex].filter(n => !componentNamesOnDisk.has(n));
const orphansOnDisk = [...componentNamesOnDisk].filter(n => !componentNamesInIndex.has(n) && !SPECIAL.has(n));

const componentsWithoutTokens = componentsIndex.filter(c =>
  !c.tokens_consumed || c.tokens_consumed.length === 0
).map(c => c.name);

// ----- Phase 4: next-actions ranking -----
function importance(file) {
  if (file.folder === '4-components') {
    const idx = componentsIndex.find(c => c.name?.toLowerCase() === file.name.toLowerCase());
    return idx?.tokens_consumed?.length ?? 1;
  }
  // Foundations / styles get importance 5 (load-bearing for many components)
  if (file.folder === '1-foundations' || file.folder === '2-styles') return 5;
  return 1;
}

function ease(file) {
  return 1 / (1 + file.todos * 0.5);
}

const nextActions = files
  .filter(f => f.status !== 'filled')
  .map(f => ({ ...f, score: importance(f) * ease(f) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);

// ----- Phase 5: render -----
const STATUS_EMOJI = {
  empty: '⬜',
  placeholder: '📋',
  'in-progress': '🟡',
  filled: '✅',
};

function progressBar(pct) {
  const filled = Math.round(pct / 5);  // 20-cell bar
  return '█'.repeat(filled) + '░'.repeat(20 - filled);
}

const total = files.length;
const filledCount = files.filter(f => f.status === 'filled').length;
const inProgressCount = files.filter(f => f.status === 'in-progress').length;
const placeholderCount = files.filter(f => f.status === 'placeholder').length;
const emptyCount = files.filter(f => f.status === 'empty').length;
const overallPct = total === 0 ? 0 : Math.round(((filledCount + inProgressCount * 0.5) / total) * 100);

// Section table
const sectionRows = [];
for (const folder of enabledFolders) {
  const inFolder = files.filter(f => f.folder === folder);
  if (inFolder.length === 0 && folder !== '0-welcome') {
    sectionRows.push(`| ${folder} | 0 | 0 | 0 | 0 | (not enabled or empty) |`);
    continue;
  }
  const fF = inFolder.filter(f => f.status === 'filled').length;
  const iF = inFolder.filter(f => f.status === 'in-progress').length;
  const eF = inFolder.filter(f => f.status === 'empty').length;
  const pF = inFolder.filter(f => f.status === 'placeholder').length;
  sectionRows.push(`| ${folder} | ${fF} | ${iF} | ${eF} | ${pF} | ${inFolder.length} |`);
}

// Component detail table
const componentDetail = files
  .filter(f => f.folder === '4-components')
  .filter(f => !SPECIAL.has(f.name))
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(f => {
    const idx = componentsIndex.find(c => c.name?.toLowerCase() === f.name.toLowerCase());
    const sbUrl = idx?.storybook_url ? `[link](${idx.storybook_url})` : '—';
    return `| ${f.name} | ${STATUS_EMOJI[f.status]} ${f.status} | ${f.todos} | ${f.last_filled} | ${sbUrl} |`;
  })
  .join('\n');

// IA sync bullets
const syncBullets = [];
if (orphansInIndex.length === 0 && orphansOnDisk.length === 0) {
  syncBullets.push('- ✅ All `components-index.json` entries have matching `.mdx` files');
} else {
  if (orphansInIndex.length) syncBullets.push(`- ⚠ Index orphan: ${orphansInIndex.join(', ')} (in components-index.json but no matching .mdx)`);
  if (orphansOnDisk.length) syncBullets.push(`- ⚠ File orphan: ${orphansOnDisk.join(', ')} (on disk but missing from components-index.json)`);
}
if (componentsWithoutTokens.length === 0) {
  syncBullets.push('- ✅ All components have non-empty `tokens_consumed[]`');
} else {
  syncBullets.push(`- ⚠ Missing tokens_consumed: ${componentsWithoutTokens.join(', ')}`);
}

// Next actions
const nextActionLines = nextActions.length === 0
  ? ['- ✅ No outstanding actions — your DS is fully filled.']
  : nextActions.map((f, i) => `${i + 1}. ${STATUS_EMOJI[f.status]} \`${f.path}\` (${f.todos} TODOs, importance ${importance(f)})`);

// Compose Tracker.mdx
const out = `import { Meta } from '@storybook/blocks';

<Meta title="Welcome/Fill Tracker" />

# Harness Fill Tracker

Generated ${new Date().toISOString()} · scenario: \`${manifest.scenario}\` · Storybook ${manifest.storybook?.enabled ? 'wired' : 'not enabled'}

## Overall: ${overallPct}% filled

\`${progressBar(overallPct)}\` ${filledCount} of ${total} files

## By section

| Section | Filled | In progress | Empty | Placeholder | Total |
|---|---|---|---|---|---|
${sectionRows.join('\n')}

## Component coverage detail

<details><summary>Components (${files.filter(f => f.folder === '4-components' && f.status === 'filled' && !SPECIAL.has(f.name)).length} filled / ${files.filter(f => f.folder === '4-components' && f.status === 'in-progress' && !SPECIAL.has(f.name)).length} in-progress / ${files.filter(f => f.folder === '4-components' && f.status === 'placeholder' && !SPECIAL.has(f.name)).length} placeholder)</summary>

| Component | Status | TODOs | Last filled | Storybook |
|---|---|---|---|---|
${componentDetail || '| (no components yet) | | | | |'}

</details>

## IA sync health

${syncBullets.join('\n')}

## Next 5 actions (computed by importance × ease)

${nextActionLines.join('\n')}

---

*Run \`/hd:design-system tracker\` to regenerate. Run \`/hd:design-system validate\` to check for drift.*
`;

const TRACKER_PATH = join(DS_ROOT, '0-welcome', 'Tracker.mdx');
mkdirSync(dirname(TRACKER_PATH), { recursive: true });
writeFileSync(TRACKER_PATH, out);
console.log(`✓ wrote ${relative(REPO, TRACKER_PATH)} (${total} files, ${overallPct}% filled)`);
