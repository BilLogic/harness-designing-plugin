/**
 * Local Card stub — visually approximates Fluent UI v9 Card.
 * Mirrors composition from https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-card
 *
 * appearance: filled (default) | filled-alternative | outline | subtle
 */
import type { HTMLAttributes, ReactNode } from 'react';

export type CardAppearance = 'filled' | 'filled-alternative' | 'outline' | 'subtle';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  appearance?: CardAppearance;
  children?: ReactNode;
}

const appearanceStyles: Record<CardAppearance, React.CSSProperties> = {
  filled: {
    background: 'var(--colorNeutralBackground1)',
    border: 'var(--strokeWidthThin) solid var(--colorNeutralStroke1)',
    boxShadow: 'var(--shadow4)',
  },
  'filled-alternative': {
    background: 'var(--colorNeutralBackground2)',
    border: 'var(--strokeWidthThin) solid var(--colorNeutralStroke1)',
    boxShadow: 'var(--shadow4)',
  },
  outline: {
    background: 'var(--colorNeutralBackground1)',
    border: 'var(--strokeWidthThin) solid var(--colorNeutralStroke2)',
    boxShadow: 'none',
  },
  subtle: {
    background: 'var(--colorNeutralBackground2)',
    border: 'var(--strokeWidthThin) solid transparent',
    boxShadow: 'none',
  },
};

export function Card({ appearance = 'filled', style, children, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacingHorizontalM)',
        padding: 'var(--spacingHorizontalL)',
        borderRadius: 'var(--borderRadiusMedium)',
        ...appearanceStyles[appearance],
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ style, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'var(--spacingHorizontalXS)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardPreview({ style, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      style={{
        margin: 'calc(var(--spacingHorizontalL) * -1)',
        marginBottom: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardFooter({ style, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        gap: 'var(--spacingHorizontalS)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
