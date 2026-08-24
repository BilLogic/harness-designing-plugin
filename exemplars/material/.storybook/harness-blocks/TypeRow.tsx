/**
 * TypeRow — live sample text + spec column for a typography token.
 * Reads `--md-sys-typescale-{token}-{font|size|line-height|weight}` (Material 3 naming)
 * OR custom naming pattern from index-manifest.
 *
 * Source: Claude Design color_and_type.html type-row pattern.
 */

import React, { useEffect, useState, useRef } from 'react';

export type TypeRowProps = {
  token: string;
  sample?: string;
};

const PROPS = ['font', 'size', 'line-height', 'weight', 'tracking'] as const;

export const TypeRow: React.FC<TypeRowProps> = ({
  token,
  sample = 'The quick brown fox jumps over the lazy dog',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(ref.current);
    const out: Record<string, string> = {};
    for (const p of PROPS) {
      const v = cs.getPropertyValue(`--md-sys-typescale-${token}-${p}`).trim();
      out[p] = v || '—';
    }
    setResolved(out);
  }, [token]);

  return (
    <div ref={ref} className="harness-type-row" data-token={token}>
      <div
        className="harness-type-sample"
        style={{
          fontFamily: `var(--md-sys-typescale-${token}-font, inherit)`,
          fontSize: `var(--md-sys-typescale-${token}-size, inherit)`,
          lineHeight: `var(--md-sys-typescale-${token}-line-height, inherit)`,
          fontWeight: `var(--md-sys-typescale-${token}-weight, inherit)` as any,
          letterSpacing: `var(--md-sys-typescale-${token}-tracking, inherit)`,
        }}
      >
        {sample}
      </div>
      <div className="harness-type-spec">
        <code className="harness-type-name">{token}</code>
        <dl>
          {PROPS.map((p) => (
            <React.Fragment key={p}>
              <dt>{p}</dt>
              <dd>{resolved[p] || '—'}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    </div>
  );
};
