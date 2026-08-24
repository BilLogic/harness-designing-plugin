/**
 * Local Button stub — visually approximates Fluent UI v9 Button.
 * Mirrors API surface from https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-button
 *
 * appearance: primary | outline | subtle | transparent | secondary (default)
 * size: small | medium (default) | large
 */
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonAppearance = 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  children?: ReactNode;
}

const appearanceStyles: Record<ButtonAppearance, React.CSSProperties> = {
  secondary: {
    background: 'var(--colorNeutralBackground1)',
    color: 'var(--colorNeutralForeground1)',
    border: 'var(--strokeWidthThin) solid var(--colorNeutralStroke1)',
  },
  primary: {
    background: 'var(--colorBrandBackground)',
    color: 'var(--colorNeutralForegroundOnBrand)',
    border: 'var(--strokeWidthThin) solid transparent',
  },
  outline: {
    background: 'transparent',
    color: 'var(--colorNeutralForeground1)',
    border: 'var(--strokeWidthThin) solid var(--colorNeutralStroke1)',
  },
  subtle: {
    background: 'transparent',
    color: 'var(--colorNeutralForeground2)',
    border: 'var(--strokeWidthThin) solid transparent',
  },
  transparent: {
    background: 'transparent',
    color: 'var(--colorNeutralForeground2)',
    border: 'var(--strokeWidthThin) solid transparent',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  small: { height: '24px', padding: '0 var(--spacingHorizontalS)', fontSize: 'var(--fontSizeBase200)' },
  medium: { height: '32px', padding: '0 var(--spacingHorizontalM)', fontSize: 'var(--fontSizeBase300)' },
  large: { height: '40px', padding: '0 var(--spacingHorizontalL)', fontSize: 'var(--fontSizeBase400)' },
};

export function Button({
  appearance = 'secondary',
  size = 'medium',
  style,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacingHorizontalS)',
        whiteSpace: 'nowrap',
        borderRadius: 'var(--borderRadiusMedium)',
        fontWeight: 'var(--fontWeightSemibold)' as React.CSSProperties['fontWeight'],
        fontFamily: 'var(--fontFamilyBase)',
        cursor: 'pointer',
        transition: 'background 80ms',
        ...appearanceStyles[appearance],
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
