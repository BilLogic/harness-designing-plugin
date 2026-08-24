/**
 * Local Checkbox stub — visually approximates shadcn/ui's canonical Checkbox.
 * https://ui.shadcn.com/docs/components/checkbox
 *
 * shadcn ships Checkbox as a wrapper over `@radix-ui/react-checkbox` with
 * indeterminate support. This stub renders a styled native input plus a
 * tick / dash glyph; the public API matches the Radix surface where it
 * matters (`checked`, `defaultChecked`, `disabled`, `onCheckedChange`).
 */
import { useId, type InputHTMLAttributes } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> & {
  /** Tri-state: `true` | `false` | `'indeterminate'`. Falls back to the native input behavior when unspecified. */
  checked?: boolean | 'indeterminate';
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({
  id,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  style,
  ...rest
}: CheckboxProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const isIndeterminate = checked === 'indeterminate';
  const isChecked = checked === true || (checked === undefined ? undefined : false);

  // Visible state — what the styled box paints.
  const visibleState: 'on' | 'off' | 'mixed' =
    isIndeterminate ? 'mixed' : isChecked === true ? 'on' : isChecked === false ? 'off' : defaultChecked ? 'on' : 'off';

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1rem',
        height: '1rem',
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style,
      }}
    >
      <input
        {...rest}
        type="checkbox"
        id={inputId}
        checked={isChecked === undefined ? undefined : isChecked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-checked={isIndeterminate ? 'mixed' : undefined}
        onChange={(e) => onCheckedChange?.(e.currentTarget.checked)}
        ref={(node) => {
          if (node) node.indeterminate = isIndeterminate;
        }}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          margin: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      <span
        aria-hidden
        style={{
          width: '1rem',
          height: '1rem',
          borderRadius: 'calc(var(--radius) - 0.25rem)',
          border: '1px solid var(--input)',
          background: visibleState === 'off' ? 'transparent' : 'var(--primary)',
          color: 'var(--primary-foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          transition: 'background 120ms ease, border-color 120ms ease',
        }}
      >
        {visibleState === 'on' && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2.5 6.25 5 8.75 9.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {visibleState === 'mixed' && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M3 6h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </span>
  );
}
