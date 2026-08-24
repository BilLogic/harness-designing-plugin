import type { ComponentType } from 'react';
import type { MdxModule, Status } from '../types';
import { SectionHeader } from './SectionHeader';
import { PageCard } from './PageCard';
import { aggregateStatus, filenameToTitle, filterByDir, pageHref } from './utils';
import { MiniSwatchRow } from './previews/MiniSwatchRow';
import { MiniTypeStack } from './previews/MiniTypeStack';
import { MiniSpacingBars } from './previews/MiniSpacingBars';

export interface StylesSectionProps {
  pages: Record<string, MdxModule>;
}

const PREVIEW_BY_FILENAME: Record<string, ComponentType<any>> = {
  'color.mdx': MiniSwatchRow,
  'typography.mdx': MiniTypeStack,
  'spacing.mdx': MiniSpacingBars,
};

export function StylesSection({ pages }: StylesSectionProps) {
  const items = filterByDir(pages, '2-styles');
  if (items.length === 0) return null;

  const stats = aggregateStatus(items);
  const countLabel = countSummary(stats);

  return (
    <section className="hd-section" data-hd-id="welcome-styles">
      <SectionHeader
        number="2"
        title="Styles"
        intro="Visual values rendered live from `tokens.css` — color roles, type ramp, spacing scale, elevation, iconography."
        count={countLabel}
      />
      <div className="hd-styles-grid">
        {items.map((item) => {
          const fm = item.frontmatter ?? {};
          const status: Status = (fm.status ?? 'empty') as Status;
          const title = filenameToTitle(item.filename);
          const Preview = PREVIEW_BY_FILENAME[item.filename];
          const preview = Preview ? <Preview {...(fm.preview_args ?? {})} /> : null;
          return (
            <PageCard
              key={item.path}
              href={pageHref('2-styles', item.filename)}
              status={status}
              kicker={fm.kicker ?? 'Styles'}
              title={title}
              description={fm.description}
              chips={fm.chips}
              preview={preview}
            />
          );
        })}
      </div>
    </section>
  );
}

function countSummary(stats: ReturnType<typeof aggregateStatus>): string {
  const parts: string[] = [`${stats.filled}/${stats.total} filled`];
  if (stats.inProgress) parts.push(`${stats.inProgress} in progress`);
  if (stats.placeholder) parts.push(`${stats.placeholder} placeholder`);
  if (stats.empty) parts.push(`${stats.empty} empty`);
  return parts.join(' · ');
}
