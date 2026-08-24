/**
 * Local Tabs stub — visually approximates shadcn/ui's canonical Tabs.
 * https://ui.shadcn.com/docs/components/tabs
 *
 * Composition primitive: Tabs (root, controls active value) wraps a TabsList
 * (the role=tablist row), which contains TabsTrigger buttons (role=tab).
 * Sibling TabsContent blocks render only when their `value` matches the
 * active value. Keyboard arrow navigation per WAI-ARIA tabs pattern.
 */
import {
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  registerTrigger: (value: string, ref: HTMLButtonElement | null) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must live inside <Tabs>.`);
  return ctx;
}

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
};

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  style,
  children,
  ...rest
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;
  const baseId = useId();
  const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const setValue = (next: string) => {
    if (controlled === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const registerTrigger = (v: string, ref: HTMLButtonElement | null) => {
    triggerRefs.current.set(v, ref);
  };

  return (
    <TabsContext.Provider value={{ value, setValue, registerTrigger, baseId }}>
      <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', ...style }}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

export function TabsList({ style, children, ...rest }: TabsListProps) {
  return (
    <div
      {...rest}
      role="tablist"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem',
        background: 'var(--muted)',
        color: 'var(--muted-foreground)',
        borderRadius: 'var(--radius)',
        gap: '0.125rem',
        width: 'fit-content',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({ value, style, children, onKeyDown, ...rest }: TabsTriggerProps) {
  const { value: active, setValue, registerTrigger, baseId } = useTabs('TabsTrigger');
  const isActive = active === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    const list = e.currentTarget.parentElement;
    if (!list) return;
    const triggers = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const idx = triggers.indexOf(e.currentTarget);
    if (idx === -1) return;
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % triggers.length;
    if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + triggers.length) % triggers.length;
    if (e.key === 'Home') nextIdx = 0;
    if (e.key === 'End') nextIdx = triggers.length - 1;
    e.preventDefault();
    triggers[nextIdx]?.focus();
    triggers[nextIdx]?.click();
  };

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={tabId}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      ref={(node) => registerTrigger(value, node)}
      onClick={(e) => {
        rest.onClick?.(e);
        setValue(value);
      }}
      onKeyDown={handleKeyDown}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '1.75rem',
        padding: '0 0.75rem',
        border: 'none',
        borderRadius: 'calc(var(--radius) - 0.25rem)',
        background: isActive ? 'var(--background)' : 'transparent',
        color: isActive ? 'var(--foreground)' : 'inherit',
        boxShadow: isActive ? '0 1px 2px rgb(0 0 0 / 0.06)' : 'none',
        fontFamily: 'inherit',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background 120ms ease, color 120ms ease',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabsContent({ value, style, children, ...rest }: TabsContentProps) {
  const { value: active, baseId } = useTabs('TabsContent');
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const isActive = active === value;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      hidden={!isActive}
      style={{
        outline: 'none',
        ...style,
      }}
      tabIndex={0}
    >
      {isActive ? children : null}
    </div>
  );
}
