import type { MdxModule } from '../types';
import { Icon, resolveFoundationsIcon } from '../icons';
import { SectionHeader } from './SectionHeader';
import { PageCard } from './PageCard';
import { aggregateStatus, filenameToTitle, filterByDir, formatDate, pageHref } from './utils';

export interface FoundationsSectionProps {
  pages: Record<string, MdxModule>;
}

export function FoundationsSection({ pages }: FoundationsSectionProps) {
  const items = filterByDir(pages, '1-foundations');
  if (items.length === 0) return null;

  const stats = aggregateStatus(items);
  const countLabel = countSummary(stats);

  return (
    <section className="hd-section" data-hd-id="welcome-foundations">
      <SectionHeader
        number="1"
        title="Foundations"
        intro="The WHY of the system — design commitments, accessibility, voice, layout, and the token model."
        count={countLabel}
      />
      <div className="hd-foundations-grid">
        {items.map((item) => {
          const fm = item.frontmatter ?? {};
          const status = (fm.status ?? 'empty') as never;
          const title = filenameToTitle(item.filename);
          const iconName = resolveFoundationsIcon(item.filename, fm.icon);
          const meta = (() => {
            switch (fm.status) {
              case 'filled':
                return fm.last_filled ? `Last filled ${formatDate(fm.last_filled)}` : 'Filled';
              case 'in-progress':
                return fm.todos != null ? `${fm.todos} todos remaining` : 'In progress';
              case 'placeholder':
                return 'Placeholder';
              default:
                return 'Empty';
            }
          })();
          const kicker = (
            <span className="hd-page-card-kicker-row">
              <Icon name={iconName} size={14} />
              <span>{fm.kicker ?? 'Foundation'}</span>
            </span>
          );
          return (
            <PageCard
              key={item.path}
              href={pageHref('1-foundations', item.filename)}
              status={status}
              kicker={kicker}
              title={title}
              description={fm.description}
              chips={fm.chips}
              metaLine={meta}
              compact
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
