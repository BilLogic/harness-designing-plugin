#!/usr/bin/env node
/**
 * validate.mjs — read-only validation of docs/context/design-system/ harness
 *
 * See references/validate-rules.md for the rule catalog. Exit 0 = pass,
 * 1 = ≥1 high-severity finding, 2 = I/O failure.
 *
 * Usage:
 *   node validate.mjs --repo <path> [--json]
 *
 * With --json, output is machine-readable for /hd:review l1 to consume.
 * Without --json, output is human-readable.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, basename, resolve, relative, dirname } from 'node:path';
import { parseArgs } from 'node:util';

const args = parseArgs({
  options: {
    repo: { type: 'string', default: process.cwd() },
    json: { type: 'boolean', default: false },
  },
}).values;

const REPO = resolve(args.repo);
const DS_ROOT = join(REPO, 'docs', 'context', 'design-system');

if (!existsSync(DS_ROOT)) {
  console.error(`error: ${DS_ROOT} does not exist`);
  process.exit(2);
}

const findings = [];

function record(rule, severity, evidence) {
  findings.push({ rule, severity, evidence });
}

// --- helpers ---------------------------------------------------------------

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
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

const ALL_MDX = walkMdx(DS_ROOT);
const STATUS_ENUM = ['empty', 'placeholder', 'in-progress', 'filled', 'deprecated'];

// --- Rule: frontmatter-present (HIGH) --------------------------------------

for (const path of ALL_MDX) {
  const content = readFileSync(path, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) {
    record('frontmatter-present', 'high', { path: relative(REPO, path) });
  }
}

// --- Rule: frontmatter-status-enum (HIGH) ----------------------------------
// --- Rule: frontmatter-todos-int (MEDIUM) ----------------------------------

for (const path of ALL_MDX) {
  const content = readFileSync(path, 'utf8');
  const fm = parseFrontmatter(content);
  if (!fm) continue;  // already flagged above
  if (fm.status && !STATUS_ENUM.includes(fm.status)) {
    record('frontmatter-status-enum', 'high', {
      path: relative(REPO, path),
      bad_value: fm.status,
    });
  }
  if (fm.todos !== undefined) {
    const n = parseInt(fm.todos, 10);
    if (Number.isNaN(n) || n < 0) {
      record('frontmatter-todos-int', 'medium', {
        path: relative(REPO, path),
        bad_value: fm.todos,
      });
    }
  }
}

// --- Rule: index-to-file (HIGH) + file-to-index (MEDIUM) -------------------

const COMPONENTS_INDEX_PATH = join(DS_ROOT, '4-components', 'components-index.json');
let componentsIndex = [];
if (existsSync(COMPONENTS_INDEX_PATH)) {
  try {
    componentsIndex = JSON.parse(readFileSync(COMPONENTS_INDEX_PATH, 'utf8'));
  } catch (e) {
    record('index-to-file', 'high', {
      path: relative(REPO, COMPONENTS_INDEX_PATH),
      reason: 'unparseable JSON: ' + e.message,
    });
  }
}

const componentsDir = join(DS_ROOT, '4-components');
const onDiskComponentNames = new Set();
if (existsSync(componentsDir)) {
  for (const f of readdirSync(componentsDir)) {
    if (f.endsWith('.mdx')) {
      const name = basename(f, '.mdx').toLowerCase();
      if (!['inventory', 'cheat-sheet', 'patterns'].includes(name)) {
        onDiskComponentNames.add(name);
      }
    }
  }
}

for (const c of componentsIndex) {
  if (!c.name) continue;
  if (!onDiskComponentNames.has(c.name.toLowerCase())) {
    record('index-to-file', 'high', {
      component: c.name,
      expected: `4-components/${c.name.toLowerCase()}.mdx`,
    });
  }
}

const indexNamesLower = new Set(componentsIndex.map(c => c.name?.toLowerCase()).filter(Boolean));
for (const name of onDiskComponentNames) {
  if (!indexNamesLower.has(name)) {
    record('file-to-index', 'medium', {
      file: `4-components/${name}.mdx`,
      reason: 'no entry in components-index.json',
    });
  }
}

// --- Rule: tokens-consumed-non-empty (MEDIUM) ------------------------------

for (const c of componentsIndex) {
  if (!c.name) continue;
  if (!c.tokens_consumed || c.tokens_consumed.length === 0) {
    record('tokens-consumed-non-empty', 'medium', { component: c.name });
  }
}

// --- Rule: ia-sync (HIGH) --------------------------------------------------

for (const path of ALL_MDX) {
  const rel = relative(DS_ROOT, path);
  const parts = rel.split('/');
  if (parts[0] === '0-welcome') continue;  // welcome doesn't need numbered prefix in title
  const folder = parts[0];
  const content = readFileSync(path, 'utf8');
  const metaMatch = content.match(/<Meta[^>]*\btitle=["']([^"']+)["']/);
  if (metaMatch) {
    const title = metaMatch[1];
    const titleParts = title.split('/');
    if (titleParts.length >= 1) {
      const expectedSection = folder.replace(/^\d+-/, '');  // strip number prefix
      const actualSection = titleParts[0].toLowerCase().replace(/[\s-]/g, '');
      const expected = expectedSection.toLowerCase().replace(/[\s-]/g, '');
      if (actualSection !== expected) {
        record('ia-sync', 'high', {
          file: relative(REPO, path),
          expected_section: expectedSection,
          actual_title: title,
        });
      }
    }
  }
}

// --- Rule: no-img-in-md (HIGH) ---------------------------------------------

const componentMdxFiles = walkMdx(componentsDir);
for (const path of componentMdxFiles) {
  const content = readFileSync(path, 'utf8');
  // Match raw <img tags (not <FigmaFrame> or other custom components)
  const imgMatches = content.match(/<img\s/g);
  if (imgMatches && imgMatches.length > 0) {
    record('no-img-in-md', 'high', {
      file: relative(REPO, path),
      occurrences: imgMatches.length,
    });
  }
}

// --- Rule: variant-combo-rule (LOW) ----------------------------------------
// Heuristic: components with >10 variant combinations should use axes table

for (const c of componentsIndex) {
  const variantCount = (c.variants?.length || 1) * (c.states?.length || 1) * 1;
  if (variantCount > 10 && c.doc) {
    const docPath = join(REPO, c.doc);
    if (existsSync(docPath)) {
      const content = readFileSync(docPath, 'utf8');
      // Look for "## Variants" or "## Types" section followed by a table
      // If the table has >10 rows, that's a violation
      const variantsSection = content.match(/##\s+(Variants|Types)([\s\S]*?)(\n##\s|\Z)/);
      if (variantsSection) {
        const tableMatch = variantsSection[2].match(/\|[^\n]*\|\n\|[\s\-:|]+\|\n((?:\|[^\n]*\|\n?){11,})/);
        if (tableMatch) {
          record('variant-combo-rule', 'low', {
            component: c.name,
            note: `${variantCount} combinations; should use axes table`,
          });
        }
      }
    }
  }
}

// --- output ----------------------------------------------------------------

const summary = {
  high: findings.filter(f => f.severity === 'high').length,
  medium: findings.filter(f => f.severity === 'medium').length,
  low: findings.filter(f => f.severity === 'low').length,
};
const exitCode = summary.high > 0 ? 1 : 0;

if (args.json) {
  console.log(JSON.stringify({
    rubric: 'hd-design-system-validate',
    exit_code: exitCode,
    summary,
    findings,
  }, null, 2));
} else {
  // Human-readable
  const RULES = [
    'frontmatter-present', 'frontmatter-status-enum', 'frontmatter-todos-int',
    'index-to-file', 'file-to-index', 'tokens-consumed-non-empty',
    'ia-sync', 'no-img-in-md', 'variant-combo-rule',
  ];
  for (const rule of RULES) {
    const rf = findings.filter(f => f.rule === rule);
    if (rf.length === 0) {
      console.log(`✓ ${rule}`);
    } else {
      const sev = rf[0].severity.toUpperCase();
      console.log(`✗ ${rule} (${sev}) — ${rf.length} finding${rf.length === 1 ? '' : 's'}`);
      for (const f of rf) {
        console.log(`  - ${JSON.stringify(f.evidence)}`);
      }
    }
  }
  console.log('─────');
  console.log(`${findings.length} findings (${summary.high} HIGH, ${summary.medium} MEDIUM, ${summary.low} LOW). Exit ${exitCode}.`);
}

process.exit(exitCode);
