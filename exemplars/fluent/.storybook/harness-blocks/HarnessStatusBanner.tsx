/**
 * HarnessStatusBanner — reads frontmatter status + renders banner with emoji + meta.
 * Auto-injected by HarnessDocsContainer; never used directly in MDX.
 */

import React from 'react';

export type HarnessStatusBannerProps = {
  status?: 'empty' | 'placeholder' | 'in-progress' | 'filled' | 'deprecated';
  lastFilled?: string;
  todos?: number | string;
};

const STATUS_EMOJI = {
  empty: '⬜',
  placeholder: '📋',
  'in-progress': '🟡',
  filled: '✅',
  deprecated: '⚠️',
};

const STATUS_COLOR = {
  empty: '#999',
  placeholder: '#d4a017',
  'in-progress': '#e6a700',
  filled: '#2c8c4a',
  deprecated: '#c1453a',
};

export const HarnessStatusBanner: React.FC<HarnessStatusBannerProps> = ({
  status,
  lastFilled,
  todos,
}) => {
  if (!status) return null;
  const todosNum = typeof todos === 'string' ? parseInt(todos, 10) : (todos ?? 0);
  return (
    <div
      className="harness-status-banner"
      data-status={status}
      style={{
        padding: '8px 12px',
        marginBottom: '24px',
        borderLeft: `4px solid ${STATUS_COLOR[status]}`,
        background: 'var(--color-surface-container-lowest, #fafafa)',
        fontSize: '13px',
        color: 'var(--color-on-surface, #333)',
        borderRadius: '4px',
      }}
    >
      <span style={{ marginRight: '8px' }}>{STATUS_EMOJI[status]}</span>
      <strong>Harness status:</strong> {status}
      {lastFilled && (
        <>
          {' · '}
          last filled <code>{lastFilled}</code>
        </>
      )}
      {todosNum > 0 && (
        <>
          {' · '}
          <strong>{todosNum}</strong> TODO{todosNum === 1 ? '' : 's'} remaining
        </>
      )}
    </div>
  );
};
