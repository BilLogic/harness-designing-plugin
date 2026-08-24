/**
 * Local Skeleton stub — visually approximates shadcn/ui's canonical Skeleton.
 * https://ui.shadcn.com/docs/components/skeleton
 *
 * Pulse-animated placeholder shape. Use to reserve layout space while data
 * loads — preserves perceived performance and avoids layout shift.
 */
import type { HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ style, ...rest }: SkeletonProps) {
  return (
    <div
      {...rest}
      aria-hidden
      style={{
        background: 'var(--muted)',
        borderRadius: 'var(--radius)',
        animation: 'hd-skeleton-pulse 1.6s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

// Inject the keyframes once. We can't rely on a stylesheet import for a
// shadcn-flavored stub, so attach to the document at module-eval time.
if (typeof document !== 'undefined' && !document.getElementById('hd-skeleton-keyframes')) {
  const style = document.createElement('style');
  style.id = 'hd-skeleton-keyframes';
  style.textContent = `@keyframes hd-skeleton-pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`;
  document.head.appendChild(style);
}
