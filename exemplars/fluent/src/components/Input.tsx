/**
 * Local Input stub — visually approximates Fluent UI v9 Input.
 * Mirrors API from https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-input
 *
 * appearance: outline (default) | underline | filled-darker | filled-lighter
 * size: small | medium (default) | large
 */
import type { InputHTMLAttributes } from 'react';

export type InputAppearance = 'outline' | 'underline' | 'filled-darker' | 'filled-lighter';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  appearance?: InputAppearance;
  inputSize?: InputSize;
}

const appearanceStyles: Record<InputAppearance, React.CSSProperties> = {
  outline: {
    background: 'var(--colorNeutralBackground1)',
    border: 'var(--strokeWidthThin) solid var(--colorNeutralStroke1)',
    borderBottomColor: 'var(--colorNeutralStrokeAccessible)',
  },
  underline: {
    background: 'transparent',
    border: 'none',
    borderBottom: 'var(--strokeWidthThin) solid var(--colorNeutralStrokeAccessible)',
    borderRadius: 0,
  },
  'filled-darker': {
    background: 'var(--colorNeutralBackground3)',
    border: 'var(--strokeWidthThin) solid transparent',
  },
  'filled-lighter': {
    background: 'var(--colorNeutralBackground1)',
    border: 'var(--strokeWidthThin) solid transparent',
  },
};

const sizeStyles: Record<InputSize, React.CSSProperties> = {
  small: { height: '24px', padding: '0 var(--spacingHorizontalS)', fontSize: 'var(--fontSizeBase200)' },
  medium: { height: '32px', padding: '0 var(--spacingHorizontalM)', fontSize: 'var(--fontSizeBase300)' },
  large: { height: '40px', padding: '0 var(--spacingHorizontalL)', fontSize: 'var(--fontSizeBase400)' },
};

export function Input({
  appearance = 'outline',
  inputSize = 'medium',
  style,
  ...rest
}: InputProps) {
  return (
    <input
      {...rest}
      style={{
        width: '240px',
        color: 'var(--colorNeutralForeground1)',
        fontFamily: 'var(--fontFamilyBase)',
        borderRadius: 'var(--borderRadiusMedium)',
        outline: 'none',
        ...appearanceStyles[appearance],
        ...sizeStyles[inputSize],
        ...style,
      }}
    />
  );
}
