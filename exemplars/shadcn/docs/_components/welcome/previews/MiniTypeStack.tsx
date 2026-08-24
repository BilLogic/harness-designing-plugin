/**
 * MiniTypeStack — three live type samples at the actual computed sizes from
 * `--text-*` tokens. Renders unconditionally; the browser falls back to its
 * default size when a var is missing.
 */

export interface MiniTypeStackProps {
  /** Token suffixes to render, top-to-bottom. */
  tokens?: string[];
}

const DEFAULT_TOKENS = ['2xl', 'base', 'xs'];

const SAMPLES: Record<string, string> = {
  '4xl': 'Display large',
  '3xl': 'Display',
  '2xl': 'Heading',
  xl: 'Subheading',
  lg: 'Body large',
  base: 'Body',
  sm: 'Caption',
  xs: 'Micro',
};

export function MiniTypeStack({ tokens = DEFAULT_TOKENS }: MiniTypeStackProps) {
  return (
    <div className="hd-mini-type-stack" role="img" aria-label="Typography preview">
      {tokens.map((t) => (
        <div
          key={t}
          className="hd-mini-type-line"
          style={{ fontSize: `var(--text-${t}, 1rem)` }}
        >
          {SAMPLES[t] ?? t}
        </div>
      ))}
    </div>
  );
}
