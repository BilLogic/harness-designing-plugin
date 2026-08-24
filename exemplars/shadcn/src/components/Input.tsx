/**
 * Local Input stub — visually approximates shadcn/ui's canonical Input.
 * https://ui.shadcn.com/docs/components/input
 */
import type { InputHTMLAttributes } from 'react';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ style, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      style={{
        display: 'flex',
        height: '2.25rem',
        width: '100%',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--input)',
        background: 'transparent',
        padding: '0.25rem 0.75rem',
        fontSize: '0.875rem',
        color: 'var(--foreground)',
        fontFamily: 'var(--font-sans)',
        outlineColor: 'var(--ring)',
        outlineOffset: '2px',
        ...style,
      }}
    />
  );
}
