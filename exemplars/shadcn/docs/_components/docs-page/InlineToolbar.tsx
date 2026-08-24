/**
 * Inline toolbar shown under the page title — Theme picker + LTR/RTL switch +
 * Copy Page button. Port of Fluent's globalTogglesContainer.
 *
 * Both controls are LIVE — they update Storybook's globals via the addons
 * channel, which triggers the per-story decorator (in `.storybook/preview.ts`)
 * to toggle `.dark` and `dir` on `<html>`. The DOM is also updated
 * synchronously so the docs chrome flips instantly without waiting for the
 * next story render.
 *
 * IMPORTANT: emit `UPDATE_GLOBALS` ONLY in event handlers — never in a
 * `useEffect`. Emitting causes Storybook to re-render the docs page, which
 * remounts this component; an effect would emit again on remount and loop.
 */
import { addons } from '@storybook/preview-api';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CopyPageButton } from './CopyPageButton';

const UPDATE_GLOBALS = 'updateGlobals';

type Theme = 'light' | 'dark';
type Direction = 'ltr' | 'rtl';

function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', t === 'dark');
  }
  try {
    addons.getChannel().emit(UPDATE_GLOBALS, { globals: { theme: t } });
  } catch {
    /* preview channel not yet ready — DOM toggle still works for this iframe */
  }
}

function applyDirection(d: Direction) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('dir', d);
  }
  try {
    addons.getChannel().emit(UPDATE_GLOBALS, { globals: { direction: d } });
  } catch {
    /* see above */
  }
}

export interface InlineToolbarProps {
  theme: Theme;
  direction: Direction;
}

export function InlineToolbar({
  theme: initialTheme,
  direction: initialDirection,
}: InlineToolbarProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keep local state in sync if Storybook globals change from outside (e.g.
  // user opens Storybook's top toolbar). NEVER emit from this effect — that
  // would loop since our own emit triggers a re-render that re-mounts us.
  useEffect(() => {
    if (initialTheme !== theme) setTheme(initialTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTheme]);

  useEffect(() => {
    if (initialDirection !== direction) setDirection(initialDirection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDirection]);

  // Close dropdown on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  const pickTheme = (t: Theme) => {
    setTheme(t);
    setOpen(false);
    applyTheme(t);
  };

  const toggleDirection = () => {
    const next: Direction = direction === 'ltr' ? 'rtl' : 'ltr';
    setDirection(next);
    applyDirection(next);
  };

  return (
    <div className="hd-inline-toolbar">
      {/* Theme picker — real dropdown that updates Storybook globals. */}
      <div className="hd-theme-picker-wrap" ref={dropdownRef}>
        <button
          type="button"
          className="hd-theme-picker"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {theme === 'dark' ? <Moon size={14} aria-hidden /> : <Sun size={14} aria-hidden />}
          <span style={{ textTransform: 'capitalize' }}>{theme}</span>
          <ChevronDown size={14} aria-hidden />
        </button>
        {open && (
          <ul className="hd-theme-picker-menu" role="listbox">
            {(['light', 'dark'] as const).map((opt) => (
              <li key={opt} role="option" aria-selected={theme === opt}>
                <button
                  type="button"
                  className={
                    theme === opt
                      ? 'hd-theme-picker-item hd-theme-picker-item--active'
                      : 'hd-theme-picker-item'
                  }
                  onClick={() => pickTheme(opt)}
                >
                  {opt === 'dark' ? <Moon size={14} aria-hidden /> : <Sun size={14} aria-hidden />}
                  <span style={{ textTransform: 'capitalize' }}>{opt}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* LTR/RTL toggle — clickable button, updates Storybook globals. */}
      <button
        type="button"
        className="hd-dir-switch"
        onClick={toggleDirection}
        aria-label={`Switch direction to ${direction === 'ltr' ? 'RTL' : 'LTR'}`}
      >
        <span className={direction === 'ltr' ? 'hd-dir-active' : 'hd-dir-inactive'}>LTR</span>
        <span
          className="hd-dir-toggle"
          data-active={direction === 'rtl' ? 'true' : 'false'}
          aria-hidden="true"
        >
          <span className="hd-dir-toggle-knob" />
        </span>
        <span className={direction === 'rtl' ? 'hd-dir-active' : 'hd-dir-inactive'}>RTL</span>
      </button>

      <div className="hd-toolbar-spacer" />

      <CopyPageButton />
    </div>
  );
}
