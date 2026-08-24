/**
 * Local Button stub — visually approximates shadcn/ui's canonical Button.
 * Mirrors variants/sizes from https://ui.shadcn.com/docs/components/button
 * (default, secondary, destructive, outline, ghost, link × sm, default, lg, icon).
 *
 * Not an `npm install @shadcn/ui` import — that's the point. The exemplar
 * stays self-contained so reviewers can read the full surface in one place.
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  default: {
    background: 'var(--primary)',
    color: 'var(--primary-foreground)',
  },
  secondary: {
    background: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
  },
  destructive: {
    background: 'var(--destructive)',
    color: 'var(--destructive-foreground)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--foreground)',
  },
  link: {
    background: 'transparent',
    color: 'var(--primary)',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  default: { height: '2.25rem', padding: '0 1rem', fontSize: '0.875rem' },
  sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.875rem' },
  lg: { height: '2.5rem', padding: '0 2rem', fontSize: '1rem' },
  icon: { height: '2.25rem', width: '2.25rem', padding: 0, fontSize: '0.875rem' },
};

export function Button({
  variant = 'default',
  size = 'default',
  style,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap',
        borderRadius: 'var(--radius)',
        fontWeight: 500,
        border: 'none',
        cursor: 'pointer',
        transition: 'opacity 150ms',
        fontFamily: 'var(--font-sans)',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
