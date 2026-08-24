/**
 * TextAndOutline — text + outline color tokens (4 rows).
 */

import React from 'react';

const TOKENS = [
  { var: '--color-on-surface', label: 'on-surface', usage: 'Body text on surface' },
  { var: '--color-on-surface-variant', label: 'on-surface-variant', usage: 'Secondary text' },
  { var: '--color-outline', label: 'outline', usage: 'Borders, dividers' },
  { var: '--color-outline-variant', label: 'outline-variant', usage: 'Subtle borders' },
];

export const TextAndOutline: React.FC = () => (
  <div className="harness-text-outline">
    {TOKENS.map((t) => (
      <div key={t.var} className="harness-text-outline-row">
        <span className="harness-text-outline-swatch" style={{ background: `var(${t.var})` }} />
        <code className="harness-text-outline-name">{t.label}</code>
        <span className="harness-text-outline-usage">{t.usage}</span>
      </div>
    ))}
  </div>
);
