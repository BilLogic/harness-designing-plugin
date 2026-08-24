import type { ReactNode } from 'react';
import type { Status } from '../types';
import { StatusPill } from './StatusPill';

export interface PageCardProps {
  href: string;
  status?: Status;
  kicker?: ReactNode;
  title: string;
  description?: string;
  chips?: string[];
  metaLine?: string;
  preview?: ReactNode;
  /** Compact = no preview region; used for foundations / docs cards */
  compact?: boolean;
}

/**
 * Claude-Design-style PageCard — kicker + title + description + chip row,
 * optionally preceded by a tall preview pane. The workhorse card on the
 * welcome page.
 */
export function PageCard({
  href,
  status,
  kicker,
  title,
  description,
  chips,
  metaLine,
  preview,
  compact,
}: PageCardProps) {
  return (
    <a
      className={`hd-page-card${compact ? ' hd-page-card--compact' : ''}`}
      data-status={status}
      href={href}
    >
      {!compact && preview != null && (
        <div className="hd-page-card-preview">{preview}</div>
      )}
      <div className="hd-page-card-body">
        <div className="hd-page-card-row">
          {kicker && <span className="hd-page-card-kicker">{kicker}</span>}
          {status && <StatusPill status={status} />}
        </div>
        <h3 className="hd-page-card-title">{title}</h3>
        {description && <p className="hd-page-card-description">{description}</p>}
        {chips && chips.length > 0 && (
          <div className="hd-page-card-chips">
            {chips.map((c) => (
              <span key={c} className="hd-chip">
                {c}
              </span>
            ))}
          </div>
        )}
        {metaLine && <div className="hd-page-card-meta">{metaLine}</div>}
      </div>
    </a>
  );
}
