/**
 * MiniSpacingBars — bars rendered at actual `--space-N` widths.
 *
 * Renders unconditionally; the browser handles missing var() with a 0-width
 * fallback, which still labels the row but visually disappears. Empty-state
 * placeholder only shows when EVERY token resolves to nothing (rare).
 */
import { useEffect, useRef, useState } from 'react';

export interface MiniSpacingBarsProps {
  /** Numeric token suffixes to render. */
  tokens?: number[];
}

const DEFAULT_TOKENS = [1, 2, 3, 4, 6, 8];

export function MiniSpacingBars({ tokens = DEFAULT_TOKENS }: MiniSpacingBarsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<{ n: number; value: string }[] | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(document.documentElement);
    const out = tokens.map((n) => {
      const v = cs.getPropertyValue(`--space-${n}`).trim();
      return v ? { n, value: v } : null;
    }).filter(Boolean) as { n: number; value: string }[];
    setResolved(out);
  }, [tokens]);

  // Initial render before useEffect runs — render everything optimistically
  const list = resolved ?? tokens.map((n) => ({ n, value: '' }));

  if (resolved && resolved.length === 0) {
    return <div className="hd-mini-empty">No --space-* tokens detected</div>;
  }

  return (
    <div ref={ref} className="hd-mini-spacing-bars" role="img" aria-label="Spacing scale preview">
      {list.map(({ n }) => (
        <div key={n} className="hd-mini-spacing-row">
          <div
            className="hd-mini-spacing-bar"
            style={{ width: `var(--space-${n})` }}
          />
          <span className="hd-mini-spacing-label">space-{n}</span>
        </div>
      ))}
    </div>
  );
}
