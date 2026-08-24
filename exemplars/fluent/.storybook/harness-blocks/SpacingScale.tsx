/**
 * SpacingScale — numeric scale visualization (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64).
 * Auto-detects naming pattern from CSS vars (--spacing-N or --space-{xs,sm,md,...}).
 */

import React, { useEffect, useState, useRef } from 'react';

const NUMERIC_TOKENS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16];
const SEMANTIC_TOKENS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

export const SpacingScale: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [tokens, setTokens] = useState<{ name: string; value: string }[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(ref.current);
    const out: { name: string; value: string }[] = [];
    for (const n of NUMERIC_TOKENS) {
      const v = cs.getPropertyValue(`--spacing-${n}`).trim();
      if (v) out.push({ name: `spacing-${n}`, value: v });
    }
    if (out.length === 0) {
      for (const s of SEMANTIC_TOKENS) {
        const v = cs.getPropertyValue(`--space-${s}`).trim();
        if (v) out.push({ name: `space-${s}`, value: v });
      }
    }
    setTokens(out);
  }, []);

  return (
    <div ref={ref} className="harness-spacing-scale">
      {tokens.length === 0 && <p className="harness-empty">No spacing tokens detected. Define <code>--spacing-N</code> or <code>--space-{'{xs,sm,...}'}</code> in your CSS.</p>}
      {tokens.map((t) => (
        <div key={t.name} className="harness-spacing-row">
          <code className="harness-spacing-name">{t.name}</code>
          <div
            className="harness-spacing-bar"
            style={{ width: t.value, height: '12px', background: 'var(--color-primary, #4f46e5)' }}
          />
          <span className="harness-spacing-value">{t.value}</span>
        </div>
      ))}
    </div>
  );
};
