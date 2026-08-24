/**
 * GridVisualization — 12-column grid demo with gutters.
 * Reads --grid-gutter, --grid-margin, --breakpoint-* from CSS.
 */

import React from 'react';

export const GridVisualization: React.FC = () => {
  const cols = 12;
  return (
    <div
      className="harness-grid-viz"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 'var(--grid-gutter, 16px)',
        padding: 'var(--grid-margin, 16px)',
        background: 'var(--color-surface-container-lowest, #fafafa)',
        border: '1px solid var(--color-outline-variant, #ddd)',
      }}
    >
      {Array.from({ length: cols }, (_, i) => (
        <div
          key={i}
          className="harness-grid-col"
          style={{
            background: 'var(--color-primary-state-08, rgba(79,70,229,0.08))',
            padding: '24px 4px',
            textAlign: 'center',
            fontSize: '11px',
            border: '1px dashed var(--color-primary, #4f46e5)',
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};
