/**
 * Local Separator stub — visually approximates shadcn/ui's canonical Separator.
 * https://ui.shadcn.com/docs/components/separator
 *
 * Decorative by default (`role="presentation"`). When semantically meaningful,
 * pass `decorative={false}` to surface an `<hr>` with proper ARIA semantics.
 */
import type { HTMLAttributes } from 'react';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export type SeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'> & {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
};

export function Separator({
  orientation = 'horizontal',
  decorative = true,
  style,
  ...rest
}: SeparatorProps) {
  return (
    <div
      {...rest}
      role={decorative ? 'presentation' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      style={{
        background: 'var(--border)',
        flexShrink: 0,
        ...(orientation === 'horizontal'
          ? { width: '100%', height: '1px' }
          : { width: '1px', height: '100%' }),
        ...style,
      }}
    />
  );
}
