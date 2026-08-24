/**
 * Local Alert stub — visually approximates shadcn/ui's canonical Alert.
 * https://ui.shadcn.com/docs/components/alert
 *
 * Composition primitive: Alert (root, role=alert) wraps AlertTitle and
 * AlertDescription, with optional leading icon. Two variants — `default`
 * (info) and `destructive` (error / critical).
 */
import type { HTMLAttributes, ReactNode } from 'react';

export type AlertVariant = 'default' | 'destructive';

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  children?: ReactNode;
};

const VARIANT_STYLE: Record<AlertVariant, React.CSSProperties> = {
  default: {
    borderColor: 'var(--border)',
    background: 'var(--background)',
    color: 'var(--foreground)',
  },
  destructive: {
    borderColor: 'var(--destructive)',
    background: 'var(--background)',
    color: 'var(--destructive)',
  },
};

export function Alert({ variant = 'default', style, children, ...rest }: AlertProps) {
  return (
    <div
      {...rest}
      role="alert"
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1.25rem 1fr',
        columnGap: '0.75rem',
        padding: '0.875rem 1rem',
        border: '1px solid',
        borderRadius: 'var(--radius)',
        ...VARIANT_STYLE[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function AlertTitle({ style, children, ...rest }: AlertTitleProps) {
  return (
    <h5
      {...rest}
      style={{
        gridColumn: 2,
        margin: 0,
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        lineHeight: 1.25,
        ...style,
      }}
    >
      {children}
    </h5>
  );
}

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function AlertDescription({ style, children, ...rest }: AlertDescriptionProps) {
  return (
    <p
      {...rest}
      style={{
        gridColumn: 2,
        margin: '0.25rem 0 0',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.5,
        opacity: 0.85,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
