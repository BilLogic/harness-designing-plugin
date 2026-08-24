/**
 * Local Dialog stub — visually approximates shadcn/ui's canonical Dialog.
 * https://ui.shadcn.com/docs/components/dialog
 *
 * shadcn ships Dialog over `@radix-ui/react-dialog` with portal + focus trap +
 * scroll lock + Esc-to-close. This stub uses a controlled `<dialog>`-like
 * surface backed by React state; the public API mirrors Radix where it
 * matters (`open`, `defaultOpen`, `onOpenChange`).
 *
 * Composition: Dialog (root) wraps DialogContent (the panel). The content
 * slots in DialogHeader / DialogTitle / DialogDescription / DialogFooter.
 */
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from 'react';
import { X } from 'lucide-react';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  baseId: string;
};
const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(component: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error(`<${component}> must live inside <Dialog>.`);
  return ctx;
}

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
};

export function Dialog({ open: controlled, defaultOpen, onOpenChange, children }: DialogProps) {
  const [internal, setInternal] = useState(!!defaultOpen);
  const open = controlled ?? internal;
  const baseId = useId();

  const setOpen = (next: boolean) => {
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen, baseId }}>
      {children}
    </DialogContext.Provider>
  );
}

export type DialogTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

/**
 * Triggers the dialog open. Renders a `<button>` — wrap your visible
 * trigger element as a child (e.g., `<DialogTrigger><Button>Open</Button></DialogTrigger>`)
 * and the wrapper passes through the click handler.
 */
export function DialogTrigger({ onClick, style, children, ...rest }: DialogTriggerProps) {
  const { setOpen } = useDialog('DialogTrigger');
  return (
    <button
      {...rest}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
      style={{
        display: 'inline-flex',
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export type DialogContentProps = HTMLAttributes<HTMLDivElement>;

export function DialogContent({ style, children, ...rest }: DialogContentProps) {
  const { open, setOpen, baseId } = useDialog('DialogContent');
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgb(0 0 0 / 0.5)',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
        zIndex: 50,
      }}
      onClick={() => setOpen(false)}
    >
      <div
        {...rest}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          background: 'var(--popover)',
          color: 'var(--popover-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 8px 24px -8px rgb(0 0 0 / 0.25)',
          padding: '1.5rem',
          ...style,
        }}
      >
        {/* Pass title/desc IDs down via dataset; the children Header / Title / Description pick them up. */}
        <div data-dialog-title-id={titleId} data-dialog-desc-id={descId}>
          {children}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          style={{
            position: 'absolute',
            top: '0.875rem',
            right: '0.875rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--muted-foreground)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: 'calc(var(--radius) - 0.375rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export function DialogHeader({ style, children, ...rest }: DialogHeaderProps) {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        marginBottom: '1rem',
        textAlign: 'left',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function DialogTitle({ style, children, ...rest }: DialogTitleProps) {
  const { baseId } = useDialog('DialogTitle');
  return (
    <h2
      {...rest}
      id={`${baseId}-title`}
      style={{
        margin: 0,
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        lineHeight: 1.25,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function DialogDescription({ style, children, ...rest }: DialogDescriptionProps) {
  const { baseId } = useDialog('DialogDescription');
  return (
    <p
      {...rest}
      id={`${baseId}-desc`}
      style={{
        margin: 0,
        fontSize: 'var(--text-sm)',
        color: 'var(--muted-foreground)',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export function DialogFooter({ style, children, ...rest }: DialogFooterProps) {
  return (
    <div
      {...rest}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '1.25rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
