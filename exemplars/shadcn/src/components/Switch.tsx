/**
 * Local Switch stub — visually approximates shadcn/ui's canonical Switch.
 * https://ui.shadcn.com/docs/components/switch
 *
 * shadcn ships Switch as a wrapper over `@radix-ui/react-switch`. This stub
 * uses a styled native checkbox for state + a translating thumb for the
 * switch metaphor; the public API matches the Radix surface where it matters
 * (`checked`, `defaultChecked`, `disabled`, `onCheckedChange`).
 */
import { useId, type InputHTMLAttributes } from 'react';

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  id,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  style,
  ...rest
}: SwitchProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const isOn = checked === undefined ? !!defaultChecked : checked;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '2.25rem',
        height: '1.25rem',
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style,
      }}
    >
      <input
        {...rest}
        type="checkbox"
        role="switch"
        id={inputId}
        checked={checked === undefined ? undefined : checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.currentTarget.checked)}
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
          width: '2.25rem',
          height: '1.25rem',
          borderRadius: '999px',
          background: isOn ? 'var(--primary)' : 'var(--input)',
          opacity: disabled ? 0.5 : 1,
          transition: 'background 160ms ease',
          position: 'relative',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: '50%',
            left: isOn ? 'calc(100% - 1.0625rem)' : '0.1875rem',
            transform: 'translateY(-50%)',
            width: '0.875rem',
            height: '0.875rem',
            borderRadius: '50%',
            background: 'var(--background)',
            boxShadow: '0 1px 2px rgb(0 0 0 / 0.15)',
            transition: 'left 160ms ease',
          }}
        />
      </span>
    </span>
  );
}
