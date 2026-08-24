/**
 * MiniSwatchRow — renders a row of color swatches read live from CSS custom
 * properties on `:root`. Each swatch shows the actual color value.
 */
import { useEffect, useRef, useState } from 'react';

export interface MiniSwatchRowProps {
  /** Token names without the `--` prefix. Default reads shadcn's role pairs. */
  tokens?: string[];
  /** Show the foreground sibling beneath each fill. */
  pairs?: boolean;
}

const DEFAULT_TOKENS = [
  'primary',
  'secondary',
  'destructive',
  'muted',
  'accent',
  'border',
  'background',
  'foreground',
  'card',
  'popover',
];

export function MiniSwatchRow({ tokens = DEFAULT_TOKENS, pairs = true }: MiniSwatchRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<{ token: string; value: string; fg?: string }[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    const cs = getComputedStyle(document.documentElement);
    const out = tokens.map((token) => {
      const value = cs.getPropertyValue(`--${token}`).trim();
      const fg = pairs ? cs.getPropertyValue(`--${token}-foreground`).trim() : '';
      return value ? { token, value, fg: fg || undefined } : null;
    }).filter(Boolean) as { token: string; value: string; fg?: string }[];
    setResolved(out);
  }, [tokens, pairs]);

  return (
    <div ref={ref} className="hd-mini-swatch-row" role="img" aria-label="Color tokens preview">
      {resolved.map(({ token, value, fg }) => (
        <div key={token} className="hd-mini-swatch" title={`--${token} ${value}`}>
          <div
            className="hd-mini-swatch-fill"
            style={{ background: `var(--${token})` }}
          />
          {fg && (
            <div
              className="hd-mini-swatch-fg"
              style={{ background: `var(--${token}-foreground)` }}
            />
          )}
        </div>
      ))}
      {resolved.length === 0 && (
        <div className="hd-mini-empty">No --color-* tokens detected</div>
      )}
    </div>
  );
}
