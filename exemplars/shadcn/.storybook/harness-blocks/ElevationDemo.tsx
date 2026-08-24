/**
 * ElevationDemo — card with --elevation-light-{1-5} shadow applied.
 */

import React from 'react';

export type ElevationDemoProps = {
  level: 1 | 2 | 3 | 4 | 5;
};

export const ElevationDemo: React.FC<ElevationDemoProps> = ({ level }) => (
  <div className="harness-elevation-demo">
    <div
      className="harness-elevation-card"
      style={{
        boxShadow: `var(--elevation-light-${level}, 0 ${level}px ${level * 2}px rgba(0,0,0,0.1))`,
        background: 'var(--color-surface, #fff)',
        padding: '24px',
        borderRadius: '8px',
      }}
    >
      <code>elevation-light-{level}</code>
      <p className="harness-elevation-desc">
        {level === 1 && 'Subtle lift — flat cards, hover state'}
        {level === 2 && 'Cards, raised buttons'}
        {level === 3 && 'Floating elements, dropdowns'}
        {level === 4 && 'Modal dialogs, popovers'}
        {level === 5 && 'Top-of-stack overlays'}
      </p>
    </div>
  </div>
);
