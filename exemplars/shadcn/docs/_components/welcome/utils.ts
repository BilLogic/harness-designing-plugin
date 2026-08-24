import type { ManifestSchema, PackageJson, MdxModule } from '../types';

/**
 * Derive a short slash-separated stack label from package.json deps.
 * Order: framework → bundler → CSS framework → token format.
 */
export function deriveStack(pkg: PackageJson, manifest: ManifestSchema): string {
  const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
  const has = (name: string) => name in all;
  const ver = (name: string) => all[name] ?? '';
  const major = (name: string) => {
    const v = ver(name).match(/(\d+)/);
    return v ? parseInt(v[1], 10) : 0;
  };

  const parts: string[] = [];
  // Framework
  if (has('react')) {
    const m = major('react');
    parts.push(m ? `React ${m}` : 'React');
  } else if (has('svelte')) {
    const m = major('svelte');
    parts.push(m ? `Svelte ${m}` : 'Svelte');
  } else if (has('vue')) {
    const m = major('vue');
    parts.push(m ? `Vue ${m}` : 'Vue');
  } else if (has('@angular/core')) {
    parts.push('Angular');
  } else if (has('lit')) {
    parts.push('Lit');
  }

  // Bundler
  if (has('next')) parts.push('Next.js');
  else if (has('vite')) parts.push('Vite');
  else if (has('webpack')) parts.push('Webpack');

  // CSS framework
  if (has('tailwindcss')) {
    const m = major('tailwindcss');
    parts.push(m === 4 ? 'Tailwind v4' : m === 3 ? 'Tailwind v3' : 'Tailwind');
  }

  // Token format — heuristic: scan tokens.css for OKLCH if available; else infer from deps
  if (manifest.tokens?.tiers?.includes('primitive') || manifest.scenario === 'code-only') {
    // Cheap detection — we trust the manifest writer to set this up downstream.
    // For now, assume OKLCH if Tailwind v4 present (its current default).
    if (has('tailwindcss') && major('tailwindcss') >= 4) parts.push('OKLCH');
  }

  return parts.length > 0 ? parts.join(' · ') : pkg.name;
}

/** Filename → Title Case ("button.mdx" → "Button"; "filled-button.mdx" → "Filled button"). */
export function filenameToTitle(filename: string): string {
  const base = filename.replace(/\.mdx?$/, '');
  const words = base.split(/[-_]/);
  return words
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Format ISO date as "Mon DD" or "Mon DD, YYYY" (current year omitted). */
export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString('en-US', opts);
}

/** Filter pages map by directory prefix.
 *
 * Sort order: numeric `kicker` suffix (e.g., "Foundation 02" → 2) first,
 * fallback to filename alphabetically. This means team-authored kicker order
 * drives the welcome page ordering, with filename as tiebreaker.
 */
export function filterByDir(
  pages: Record<string, MdxModule>,
  dirPrefix: string,
): { path: string; filename: string; frontmatter: any }[] {
  return Object.entries(pages)
    .filter(([path]) => path.includes(`/${dirPrefix}/`) || path.endsWith(`/${dirPrefix}`))
    .map(([path, mod]) => ({
      path,
      filename: path.split('/').pop() ?? path,
      frontmatter: (mod as any).frontmatter ?? {},
    }))
    .sort((a, b) => {
      const ka = kickerOrdinal(a.frontmatter.kicker);
      const kb = kickerOrdinal(b.frontmatter.kicker);
      if (ka !== kb) return ka - kb;
      return a.filename.localeCompare(b.filename);
    });
}

function kickerOrdinal(kicker?: string): number {
  if (!kicker) return Number.MAX_SAFE_INTEGER;
  const m = kicker.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
}

/** Convert a page filename to its Storybook docs ID. */
export function pageHref(folder: string, filename: string): string {
  const base = filename.replace(/\.mdx?$/, '');
  // Storybook 8 lowercases + replaces / with - + replaces spaces with -
  const id = `${folder}-${base}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  return `?path=/docs/${id}--docs`;
}

/** Aggregate per-page status counts across a directory. */
export function aggregateStatus(
  pages: { frontmatter: { status?: string } }[],
): { filled: number; inProgress: number; placeholder: number; empty: number; total: number } {
  const result = { filled: 0, inProgress: 0, placeholder: 0, empty: 0, total: pages.length };
  for (const p of pages) {
    switch (p.frontmatter.status) {
      case 'filled':
        result.filled++;
        break;
      case 'in-progress':
        result.inProgress++;
        break;
      case 'placeholder':
        result.placeholder++;
        break;
      case 'empty':
      default:
        result.empty++;
        break;
    }
  }
  return result;
}
