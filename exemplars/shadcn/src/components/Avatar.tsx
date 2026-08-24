/**
 * Local Avatar stub — visually approximates shadcn/ui's canonical Avatar.
 * https://ui.shadcn.com/docs/components/avatar
 *
 * Composition primitive: Avatar (root) wraps AvatarImage (the photo) and
 * AvatarFallback (the initials shown if the image fails to load). The root
 * provides shape, size, and ring styling.
 */
import {
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from 'react';

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
};

const SIZE: Record<NonNullable<AvatarProps['size']>, number> = {
  sm: 32,
  md: 40,
  lg: 56,
};

export function Avatar({ size = 'md', style, children, ...rest }: AvatarProps) {
  const dim = SIZE[size];
  return (
    <span
      {...rest}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: dim,
        height: dim,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'var(--muted)',
        color: 'var(--muted-foreground)',
        fontSize: dim < 40 ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * Image element. Hides itself if the source fails to load — the parent
 * Avatar's AvatarFallback then surfaces.
 */
export function AvatarImage({ onError, style, ...rest }: AvatarImageProps) {
  const [failed, setFailed] = useState(false);
  // Reset failure state when src changes.
  useEffect(() => setFailed(false), [rest.src]);

  if (failed) return null;

  return (
    <img
      {...rest}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }}
    />
  );
}

export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement>;

/** Initials or icon shown when the image isn't available. */
export function AvatarFallback({ style, children, ...rest }: AvatarFallbackProps) {
  return (
    <span
      {...rest}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Sits behind AvatarImage so it shows when the image fails or isn't supplied.
        zIndex: 0,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
