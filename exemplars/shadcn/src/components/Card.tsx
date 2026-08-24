/**
 * Local Card stub — visually approximates shadcn/ui's canonical Card composition.
 * https://ui.shadcn.com/docs/components/card
 *
 * shadcn ships Card as a composition: Card / CardHeader / CardTitle /
 * CardDescription / CardContent / CardFooter. We mirror that surface.
 */
import type { HTMLAttributes, ReactNode } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & { children?: ReactNode };

export function Card({ style, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      style={{
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ style, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ style, children, ...rest }: CardProps) {
  return (
    <h3
      {...(rest as unknown as HTMLAttributes<HTMLHeadingElement>)}
      style={{
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.25,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ style, children, ...rest }: CardProps) {
  return (
    <p
      {...(rest as unknown as HTMLAttributes<HTMLParagraphElement>)}
      style={{
        fontSize: '0.875rem',
        color: 'var(--muted-foreground)',
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function CardContent({ style, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      style={{
        padding: '0 1.5rem 1.5rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardFooter({ style, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem 1.5rem',
        gap: '0.5rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
