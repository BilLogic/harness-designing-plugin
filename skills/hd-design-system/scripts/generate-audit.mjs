#!/usr/bin/env node
/**
 * generate-audit.mjs — render docs/context/design-system/0-welcome/Audit.mdx
 *
 * Reads sub-agent audit_findings (cached in index-manifest.json) + merges with
 * any new findings passed in --findings-json. Marks resolved findings as such.
 *
 * Usage:
 *   node generate-audit.mjs --repo <path> [--findings-json <path>]
 *
 * Inputs (read):
 *   <repo>/docs/context/design-system/index-manifest.json (audit_findings_cache)
 *   --findings-json (optional): JSON file with new findings array from sub-agent
 *
 * Outputs (write):
 *   <repo>/docs/context/design-system/0-welcome/Audit.mdx
 *   <repo>/docs/context/design-system/index-manifest.json (updated audit_findings_cache)
 *
 * See references/audit-format.md for finding type enum + suggested-action vocabulary.
 *
 * Exit 0 on success; non-zero on I/O failure.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { parseArgs } from 'node:util';

const args = parseArgs({
  options: {
    repo: { type: 'string', default: process.cwd() },
    'findings-json': { type: 'string' },
  },
}).values;

const REPO = resolve(args.repo);
const DS_ROOT = join(REPO, 'docs', 'context', 'design-system');
const MANIFEST_PATH = join(DS_ROOT, 'index-manifest.json');

if (!existsSync(MANIFEST_PATH)) {
  console.error(`error: ${MANIFEST_PATH} does not exist. Run /hd:design-system establish first.`);
  process.exit(2);
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
const cached = manifest.audit_findings_cache || [];
const newFindings = args['findings-json'] && existsSync(args['findings-json'])
  ? JSON.parse(readFileSync(args['findings-json'], 'utf8'))
  : [];

// Merge by id; resolve cached findings that aren't in new findings
const byHash = new Map();
for (const f of cached) byHash.set(f.id, f);
const newHashes = new Set(newFindings.map(f => f.id));

// Mark cached-and-not-in-new as resolved
const now = new Date().toISOString();
for (const [id, f] of byHash) {
  if (!newHashes.has(id) && !f.resolved_at) {
    f.resolved_at = now;
  }
}

// Add new findings (and clear resolved_at on any that re-appeared)
for (const f of newFindings) {
  byHash.set(f.id, { ...f, resolved_at: undefined });
}

const allFindings = [...byHash.values()];
const active = allFindings.filter(f => !f.resolved_at);
const resolved = allFindings.filter(f => f.resolved_at);

// Group active by type, sorted by severity
const FINDING_TYPES = [
  'discrepancy',
  'redundancy',
  'orphan-token',
  'inline-value',
  'naming-inconsistency',
  'doc-fragment',
];
const TYPE_TITLES = {
  discrepancy: 'Discrepancies',
  redundancy: 'Redundancies',
  'orphan-token': 'Orphan tokens',
  'inline-value': 'Inline value candidates (tokenize)',
  'naming-inconsistency': 'Naming inconsistencies',
  'doc-fragment': 'Doc fragments to surface',
};
const SEVERITY_RANK = { high: 3, medium: 2, low: 1 };

const grouped = {};
for (const t of FINDING_TYPES) {
  grouped[t] = active.filter(f => f.type === t)
    .sort((a, b) => (SEVERITY_RANK[b.severity] || 0) - (SEVERITY_RANK[a.severity] || 0));
}

// Render
let out = `import { Meta } from '@storybook/blocks';
import { AuditFinding } from '../../../.storybook/harness-blocks';

<Meta title="Welcome/Audit" />

# Audit findings

Generated ${now} · ${active.length} active · ${resolved.length} resolved

`;

if (active.length === 0) {
  out += `✅ No findings — your DS is clean. Run \`/hd:design-system evolve\` after changes to re-scan.

`;
} else {
  for (const t of FINDING_TYPES) {
    const findings = grouped[t];
    if (findings.length === 0) continue;
    out += `## ${TYPE_TITLES[t]} (${findings.length})\n\n`;
    for (const f of findings) {
      out += `<AuditFinding\n`;
      out += `  type=${JSON.stringify(f.type)}\n`;
      out += `  severity=${JSON.stringify(f.severity)}\n`;
      out += `  subject=${JSON.stringify(f.subject || '')}\n`;
      out += `  locations={${JSON.stringify(f.locations || [])}}\n`;
      if (f.evidence) out += `  evidence={${JSON.stringify(f.evidence)}}\n`;
      if (f.suggested_action) out += `  suggestedAction={${JSON.stringify(f.suggested_action)}}\n`;
      out += `/>\n\n`;
    }
  }
}

if (resolved.length > 0) {
  out += `## Resolved findings (${resolved.length})\n\n<details><summary>Show resolved</summary>\n\n`;
  for (const f of resolved) {
    out += `- ~~${f.type}: ${f.subject || '(no subject)'}~~ — resolved ${f.resolved_at}\n`;
  }
  out += `\n</details>\n\n`;
}

out += `---

*Run \`/hd:design-system evolve\` to re-scan. Each suggested-action button opens the relevant file or writes a TODO.*
`;

const AUDIT_PATH = join(DS_ROOT, '0-welcome', 'Audit.mdx');
mkdirSync(dirname(AUDIT_PATH), { recursive: true });
writeFileSync(AUDIT_PATH, out);

// Write back merged cache
manifest.audit_findings_cache = allFindings;
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`✓ wrote ${relative(REPO, AUDIT_PATH)} (${active.length} active, ${resolved.length} resolved)`);
