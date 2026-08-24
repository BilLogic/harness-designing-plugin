/**
 * Local Badge stub — visually approximates shadcn/ui's canonical Badge.
 * https://ui.shadcn.com/docs/components/badge
 *
 * shadcn ships Badge as a CVA-driven span with four variants. This stub
 * mirrors the variant axes (`default` · `secondary` · `destructive` · `outline`)
 * and consumes shadcn tokens directly.
 */
import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children?: ReactNode;
};

const VARIANT_STYLE: Record<BadgeVariant, React.CSSProperties> = {
  default: {
    background: 'var(--primary)',
    color: 'var(--primary-foreground)',
    borderColor: 'transparent',
  },
  secondary: {
    background: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    borderColor: 'transparent',
  },
  destructive: {
    background: 'var(--destructive)',
    color: 'var(--destructive-foreground)',
    borderColor: 'transparent',
  },
  outline: {
    background: 'transparent',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
  },
};

export function Badge({ variant = 'default', style, children, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        height: '1.25rem',
        padding: '0 0.5rem',
        borderRadius: '999px',
        border: '1px solid',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        ...VARIANT_STYLE[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
