/**
 * Local Label stub — visually approximates shadcn/ui's canonical Label.
 * https://ui.shadcn.com/docs/components/label
 *
 * shadcn ships Label as a thin wrapper over `@radix-ui/react-label` with
 * `peer-disabled` styling. The harness exemplar avoids the Radix runtime
 * dependency; the rules are identical: pair every form field with a Label
 * via `htmlFor`.
 */
import type { LabelHTMLAttributes, ReactNode } from 'react';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
};

export function Label({ style, children, ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        lineHeight: 1,
        color: 'var(--foreground)',
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </label>
  );
}
