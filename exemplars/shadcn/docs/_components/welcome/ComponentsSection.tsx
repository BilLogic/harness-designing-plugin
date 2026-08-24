import { lazy, Suspense, type ComponentType } from 'react';
import type { ComponentEntry, MdxModule } from '../types';
import { Icon } from '../icons';
import { SectionHeader } from './SectionHeader';
import { PageCard } from './PageCard';
import { aggregateStatus, filterByDir, pageHref } from './utils';

export interface ComponentsSectionProps {
  components: ComponentEntry[];
  pages: Record<string, MdxModule>;
  previewMap?: Record<string, () => Promise<{ [key: string]: ComponentType<any> }>>;
}

const CATEGORY_ORDER = [
  'Foundational',
  'Form',
  'Display',
  'Navigation',
  'Feedback',
  'Overlay',
  'Layout',
  'Other',
];

export function ComponentsSection({ components, pages, previewMap }: ComponentsSectionProps) {
  const componentPages = filterByDir(pages, '4-components');
  if (components.length === 0 && componentPages.length === 0) return null;

  const grouped: Record<string, ComponentEntry[]> = {};
  for (const c of components) {
    const cat = c.category && CATEGORY_ORDER.includes(c.category) ? c.category : 'Other';
    (grouped[cat] ??= []).push(c);
  }
  const orderedCats = CATEGORY_ORDER.filter((c) => grouped[c]?.length);

  const inventory = componentPages.find((p) => p.filename === 'inventory.mdx');
  const cheatSheet = componentPages.find((p) => p.filename === 'cheat-sheet.mdx');

  const stats = aggregateStatus(
    components.map((c) => ({ frontmatter: { status: c.status } })),
  );
  const countLabel = countSummary(stats);

  return (
    <section className="hd-section" data-hd-id="welcome-components">
      <SectionHeader
        number="4"
        title="Components"
        intro="Reusable interactive primitives. Grouped by category. Each card opens the full page with variants, states, and API."
        count={countLabel}
      />

      {(inventory || cheatSheet) && (
        <div className="hd-components-special">
          {inventory && (
            <a
              className="hd-special-card"
              href={pageHref('4-components', inventory.filename)}
            >
              <Icon name="page-inventory" size={20} className="hd-special-icon" />
              <div>
                <div className="hd-special-title">Inventory</div>
                <div className="hd-special-meta">
                  {components.length} documented
                  {stats.placeholder > 0 ? ` · ${stats.placeholder} placeholder` : ''}
                </div>
              </div>
            </a>
          )}
          {cheatSheet && (
            <a
              className="hd-special-card"
              href={pageHref('4-components', cheatSheet.filename)}
            >
              <Icon name="page-cheat-sheet" size={20} className="hd-special-icon" />
              <div>
                <div className="hd-special-title">Cheat sheet</div>
                <div className="hd-special-meta">Use case → component lookup</div>
              </div>
            </a>
          )}
        </div>
      )}

      {orderedCats.map((cat) => (
        <div key={cat} className="hd-category-group">
          <div className="hd-category-header">{cat}</div>
          <div className="hd-component-grid">
            {grouped[cat].map((c) => (
              <ComponentCard key={c.name} entry={c} previewMap={previewMap} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function ComponentCard({
  entry,
  previewMap,
}: {
  entry: ComponentEntry;
  previewMap?: ComponentsSectionProps['previewMap'];
}) {
  // Derive folder + filename from the logical doc path. Single-page components
  // resolve to ('4-components', 'button.mdx'); folder components like Card
  // resolve to ('4-components/Card', 'card.mdx') so the slug matches the
  // Storybook docs ID for the canonical sibling page.
  const segments = entry.doc.split('/');
  const filename = segments.pop() ?? `${entry.name.toLowerCase()}.mdx`;
  const folder = segments.length ? segments.join('/') : '4-components';

  const Preview = (() => {
    if (!previewMap || !entry.preview) return null;
    const loader = previewMap[entry.name];
    if (!loader) return null;
    const Component = lazy(async () => {
      const mod = await loader();
      const Comp = mod[entry.preview!] ?? (mod as any).default;
      return { default: Comp as ComponentType<any> };
    });
    return Component;
  })();

  const preview = Preview ? (
    <Suspense fallback={<div className="hd-mini-empty">…</div>}>
      <Preview {...(entry.preview_args ?? {})} />
    </Suspense>
  ) : (
    <div className="hd-mini-empty">No live preview</div>
  );

  return (
    <PageCard
      href={pageHref(folder, filename)}
      status={entry.status}
      kicker={entry.category ?? 'Component'}
      title={entry.name}
      chips={entry.chips}
      preview={preview}
    />
  );
}

function countSummary(stats: ReturnType<typeof aggregateStatus>): string {
  const parts: string[] = [`${stats.filled}/${stats.total} filled`];
  if (stats.inProgress) parts.push(`${stats.inProgress} in progress`);
  if (stats.placeholder) parts.push(`${stats.placeholder} placeholder`);
  if (stats.empty) parts.push(`${stats.empty} empty`);
  return parts.join(' · ');
}
