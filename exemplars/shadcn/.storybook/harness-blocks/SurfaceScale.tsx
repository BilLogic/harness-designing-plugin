/**
 * SurfaceScale — 5-step surface tier scale (lowest → highest).
 * Reads --color-surface-container-{lowest|low|medium|high|highest}.
 */

import React from 'react';

const TIERS = ['lowest', 'low', 'medium', 'high', 'highest'] as const;

export const SurfaceScale: React.FC = () => (
  <div className="harness-surface-scale">
    {TIERS.map((tier) => {
      const v = `--color-surface-container-${tier}`;
      return (
        <div
          key={tier}
          className="harness-surface-tier"
          style={{ background: `var(${v})` }}
          title={v}
        >
          <span className="harness-surface-label">surface-container-{tier}</span>
        </div>
      );
    })}
  </div>
);
