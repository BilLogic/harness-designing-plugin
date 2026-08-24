/**
 * SwatchRow — 5-swatch role grouping for color tokens.
 * Reads `--color-{scheme}`, `--color-{scheme}-text`, `--color-on-{scheme}`,
 * `--color-{scheme}-container`, `--color-on-{scheme}-container` from CSS.
 *
 * Source: Claude Design color_and_type.html swatch-row pattern.
 */

import React, { useEffect, useState, useRef } from 'react';

export type SwatchRowProps = {
  scheme: string;
};

const ROLES = ['', '-text', '-on', '-container', '-on-container'] as const;
const ROLE_LABELS = {
  '': 'main',
  '-text': 'text',
  '-on': 'on-main',
  '-container': 'container',
  '-on-container': 'on-container',
};

function roleVarName(scheme: string, role: string) {
  if (role === '-on') return `--color-on-${scheme}`;
  if (role === '-on-container') return `--color-on-${scheme}-container`;
  return `--color-${scheme}${role}`;
}

export const SwatchRow: React.FC<SwatchRowProps> = ({ scheme }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(ref.current);
    const out: Record<string, string> = {};
    for (const role of ROLES) {
      const v = cs.getPropertyValue(roleVarName(scheme, role)).trim();
      out[role] = v || '—';
    }
    setResolved(out);
  }, [scheme]);

  return (
    <div ref={ref} className="harness-swatch-row" data-scheme={scheme}>
      {ROLES.map((role) => {
        const varName = roleVarName(scheme, role);
        const value = resolved[role] || '—';
        const bg = `var(${varName})`;
        return (
          <div
            key={role}
            className="harness-swatch"
            style={{ background: bg }}
            title={`${varName}: ${value}`}
          >
            <span className="harness-swatch-label">{ROLE_LABELS[role]}</span>
            <span className="harness-swatch-value">{value}</span>
          </div>
        );
      })}
    </div>
  );
};
