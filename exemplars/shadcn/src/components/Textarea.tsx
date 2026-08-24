/**
 * Local Textarea stub — visually approximates shadcn/ui's canonical Textarea.
 * https://ui.shadcn.com/docs/components/textarea
 */
import type { TextareaHTMLAttributes } from 'react';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ style, rows = 3, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      rows={rows}
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '4.5rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--input)',
        background: 'transparent',
        padding: '0.5rem 0.75rem',
        fontSize: 'var(--text-sm)',
        color: 'var(--foreground)',
        fontFamily: 'var(--font-sans)',
        lineHeight: 1.5,
        outlineColor: 'var(--ring)',
        outlineOffset: '2px',
        resize: 'vertical',
        ...style,
      }}
    />
  );
}
