/**
 * Local Slider stub — visually approximates shadcn/ui's canonical Slider.
 * https://ui.shadcn.com/docs/components/slider
 *
 * shadcn ships Slider over `@radix-ui/react-slider` with multi-thumb + range
 * support. This stub uses a styled native `<input type="range">` for the
 * single-thumb case (covers ~90% of usage). The public API mirrors the Radix
 * surface for the supported props (`min`, `max`, `step`, `value`,
 * `defaultValue`, `disabled`, `onValueChange`).
 */
import { useId, useState, type InputHTMLAttributes } from 'react';

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'defaultValue'> & {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

export function Slider({
  id,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  disabled,
  onValueChange,
  style,
  ...rest
}: SliderProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const [internal, setInternal] = useState<number>(defaultValue ?? min);
  const current = value ?? internal;
  const percent = ((current - min) / (max - min)) * 100;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        height: '1.25rem',
        ...style,
      }}
    >
      <input
        {...rest}
        type="range"
        id={inputId}
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={(e) => {
          const next = Number(e.currentTarget.value);
          setInternal(next);
          onValueChange?.(next);
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
          position: 'relative',
          width: '100%',
          height: '0.25rem',
          background: 'var(--muted)',
          borderRadius: '999px',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${percent}%`,
            background: 'var(--primary)',
            borderRadius: '999px',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: `calc(${percent}% - 0.5rem)`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '1rem',
            height: '1rem',
            borderRadius: '50%',
            background: 'var(--background)',
            border: '2px solid var(--primary)',
            boxShadow: '0 1px 2px rgb(0 0 0 / 0.1)',
            transition: 'border-color 120ms ease',
          }}
        />
      </span>
    </span>
  );
}
