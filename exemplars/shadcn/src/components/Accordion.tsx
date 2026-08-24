/**
 * Local Accordion stub — visually approximates shadcn/ui's canonical Accordion.
 * https://ui.shadcn.com/docs/components/accordion
 *
 * Composition primitive: Accordion (root) wraps multiple AccordionItem,
 * each with an AccordionTrigger and AccordionContent. Two modes — `single`
 * (one open at a time, optional `collapsible`) and `multiple` (any subset).
 */
import {
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useId,
  useState,
} from 'react';
import { ChevronDown } from 'lucide-react';

type AccordionContextValue = {
  open: string[];
  toggle: (value: string) => void;
};
const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error(`<${component}> must live inside <Accordion>.`);
  return ctx;
}

type ItemContextValue = { value: string; itemBaseId: string };
const ItemContext = createContext<ItemContextValue | null>(null);

function useItem(component: string): ItemContextValue {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error(`<${component}> must live inside <AccordionItem>.`);
  return ctx;
}

export type AccordionType = 'single' | 'multiple';

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  type?: AccordionType;
  /** When `type='single'`, controls whether the open item can be collapsed. */
  collapsible?: boolean;
  defaultValue?: string | string[];
  children?: ReactNode;
};

export function Accordion({
  type = 'single',
  collapsible = false,
  defaultValue,
  style,
  children,
  ...rest
}: AccordionProps) {
  const initial = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
      ? [defaultValue]
      : [];
  const [open, setOpen] = useState<string[]>(initial);

  const toggle = (value: string) => {
    setOpen((prev) => {
      const isOpen = prev.includes(value);
      if (type === 'single') {
        if (isOpen) return collapsible ? [] : prev;
        return [value];
      }
      return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
    });
  };

  return (
    <AccordionContext.Provider value={{ open, toggle }}>
      <div
        {...rest}
        style={{
          width: '100%',
          ...style,
        }}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function AccordionItem({ value, style, children, ...rest }: AccordionItemProps) {
  const itemBaseId = useId();
  return (
    <ItemContext.Provider value={{ value, itemBaseId }}>
      <div
        {...rest}
        style={{
          borderBottom: '1px solid var(--border)',
          ...style,
        }}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function AccordionTrigger({ style, children, ...rest }: AccordionTriggerProps) {
  const { open, toggle } = useAccordion('AccordionTrigger');
  const { value, itemBaseId } = useItem('AccordionTrigger');
  const isOpen = open.includes(value);
  const triggerId = `${itemBaseId}-trigger`;
  const contentId = `${itemBaseId}-content`;

  return (
    <h3 style={{ margin: 0 }}>
      <button
        {...rest}
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={(e) => {
          rest.onClick?.(e);
          toggle(value);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.875rem 0',
          background: 'transparent',
          border: 'none',
          color: 'var(--foreground)',
          fontFamily: 'inherit',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          textAlign: 'left',
          cursor: 'pointer',
          outlineColor: 'var(--ring)',
          outlineOffset: '2px',
          ...style,
        }}
      >
        <span>{children}</span>
        <ChevronDown
          size={16}
          aria-hidden
          style={{
            transition: 'transform 160ms ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--muted-foreground)',
            flexShrink: 0,
          }}
        />
      </button>
    </h3>
  );
}

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

export function AccordionContent({ style, children, ...rest }: AccordionContentProps) {
  const { open } = useAccordion('AccordionContent');
  const { value, itemBaseId } = useItem('AccordionContent');
  const isOpen = open.includes(value);
  const triggerId = `${itemBaseId}-trigger`;
  const contentId = `${itemBaseId}-content`;

  return (
    <div
      {...rest}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!isOpen}
      style={{
        paddingBottom: isOpen ? '1rem' : 0,
        fontSize: 'var(--text-sm)',
        color: 'var(--muted-foreground)',
        lineHeight: 1.5,
        ...style,
      }}
    >
      {isOpen ? children : null}
    </div>
  );
}
