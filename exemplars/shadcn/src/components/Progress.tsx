/**
 * Local Progress stub — visually approximates shadcn/ui's canonical Progress.
 * https://ui.shadcn.com/docs/components/progress
 *
 * Determinate progress bar (`value` 0-100) or indeterminate (`value === null`).
 * Renders an ARIA progressbar with proper `aria-valuenow` semantics.
 */
import type { HTMLAttributes } from 'react';

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'> & {
  /** 0-100. Pass `null` for indeterminate. */
  value?: number | null;
  max?: number;
};

export function Progress({ value = 0, max = 100, style, ...rest }: ProgressProps) {
  const isIndeterminate = value === null;
  const clamped = isIndeterminate ? 0 : Math.max(0, Math.min(value ?? 0, max));
  const percent = isIndeterminate ? 33 : (clamped / max) * 100;

  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{
        position: 'relative',
        width: '100%',
        height: '0.5rem',
        background: 'var(--muted)',
        borderRadius: '999px',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: isIndeterminate ? '40%' : `${percent}%`,
          background: 'var(--primary)',
          borderRadius: '999px',
          transition: isIndeterminate ? undefined : 'width 240ms ease',
          animation: isIndeterminate ? 'hd-progress-indeterminate 1.5s ease-in-out infinite' : undefined,
        }}
      />
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('hd-progress-keyframes')) {
  const style = document.createElement('style');
  style.id = 'hd-progress-keyframes';
  style.textContent = `@keyframes hd-progress-indeterminate { 0% { transform: translateX(-100%) } 100% { transform: translateX(250%) } }`;
  document.head.appendChild(style);
}
