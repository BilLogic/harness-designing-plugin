/**
 * SpacingDemo — padding visualization at element / card / section / modal level.
 */

import React from 'react';

export type SpacingDemoProps = {
  level: 'element' | 'card' | 'section' | 'modal';
};

const PADDING_BY_LEVEL = {
  element: 'var(--spacing-element-padding, 8px)',
  card: 'var(--spacing-card-padding, 16px)',
  section: 'var(--spacing-section-padding, 32px)',
  modal: 'var(--spacing-modal-padding, 24px)',
};

export const SpacingDemo: React.FC<SpacingDemoProps> = ({ level }) => (
  <div className={`harness-spacing-demo harness-spacing-demo-${level}`}>
    <div
      className="harness-spacing-demo-outer"
      style={{
        padding: PADDING_BY_LEVEL[level],
        background: 'var(--color-primary-state-08, rgba(79, 70, 229, 0.08))',
        border: '1px dashed var(--color-primary, #4f46e5)',
      }}
    >
      <div
        className="harness-spacing-demo-inner"
        style={{
          padding: '8px 16px',
          background: 'var(--color-surface, #fff)',
          border: '1px solid var(--color-outline-variant, #ddd)',
        }}
      >
        <code>{level} content</code>
      </div>
    </div>
    <div className="harness-spacing-demo-label">
      <code>{level}</code> padding: <code>{PADDING_BY_LEVEL[level]}</code>
    </div>
  </div>
);
