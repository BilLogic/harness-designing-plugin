/**
 * Local Tooltip stub — visually approximates shadcn/ui's canonical Tooltip.
 * https://ui.shadcn.com/docs/components/tooltip
 *
 * shadcn ships Tooltip over `@radix-ui/react-tooltip` with portal + collision
 * detection. This stub uses a CSS-only hover/focus reveal — covers the visual
 * surface for documentation purposes; real usage should adopt Radix.
 */
import type { HTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export type TooltipProps = HTMLAttributes<HTMLSpanElement> & {
  /** The text shown when the trigger is hovered or focused. */
  content: ReactNode;
  /** Side relative to the trigger. */
  side?: TooltipSide;
  /** The trigger — any focusable element. */
  children: ReactNode;
};

export function Tooltip({
  content,
  side = 'top',
  children,
  style,
  ...rest
}: TooltipProps) {
  const tipId = useId();
  const positionStyle = SIDE_STYLE[side];

  return (
    <span
      {...rest}
      style={{
        position: 'relative',
        display: 'inline-flex',
        ...style,
      }}
    >
      <span aria-describedby={tipId} className="hd-tt-trigger" style={{ display: 'inline-flex' }}>
        {children}
      </span>
      <span
        id={tipId}
        role="tooltip"
        className="hd-tt-bubble"
        style={{
          position: 'absolute',
          padding: '0.25rem 0.5rem',
          background: 'var(--foreground)',
          color: 'var(--background)',
          borderRadius: 'calc(var(--radius) - 0.25rem)',
          fontSize: 'var(--text-xs)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 120ms ease',
          zIndex: 50,
          ...positionStyle,
        }}
      >
        {content}
      </span>
    </span>
  );
}

const SIDE_STYLE: Record<TooltipSide, React.CSSProperties> = {
  top: { bottom: 'calc(100% + 0.375rem)', left: '50%', transform: 'translateX(-50%)' },
  right: { left: 'calc(100% + 0.375rem)', top: '50%', transform: 'translateY(-50%)' },
  bottom: { top: 'calc(100% + 0.375rem)', left: '50%', transform: 'translateX(-50%)' },
  left: { right: 'calc(100% + 0.375rem)', top: '50%', transform: 'translateY(-50%)' },
};

if (typeof document !== 'undefined' && !document.getElementById('hd-tooltip-styles')) {
  const style = document.createElement('style');
  style.id = 'hd-tooltip-styles';
  style.textContent = `
    .hd-tt-trigger:hover + .hd-tt-bubble,
    .hd-tt-trigger:focus-within + .hd-tt-bubble {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}
