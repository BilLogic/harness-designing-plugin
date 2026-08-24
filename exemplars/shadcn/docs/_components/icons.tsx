/**
 * Icon component — single role-based API, library-specific mapping.
 *
 * For shadcn we use lucide-react. Other exemplars (Material → md-icon, Fluent →
 * @fluentui/react-icons) ship their own version of this file with the same role
 * keys. Component code consuming `<Icon name="filled" />` works unchanged.
 *
 * No emoji ever — every glyph in the welcome surface comes from this map.
 */

import type { LucideIcon } from 'lucide-react';
import {
  // Status
  CheckCircle2,
  Clock,
  Clipboard,
  Circle,
  // Meta blocks
  BarChart3,
  Search,
  // Foundations pages
  BookOpen,
  Accessibility,
  PenLine,
  LayoutGrid,
  Palette,
  // Components meta
  List,
  ListChecks,
  // Generic file fallback
  FileText,
} from 'lucide-react';

type IconName =
  // status pills
  | 'status-filled'
  | 'status-in-progress'
  | 'status-placeholder'
  | 'status-empty'
  // meta blocks
  | 'meta-tracker'
  | 'meta-audit'
  // foundations pages (canonical filenames)
  | 'page-principles'
  | 'page-accessibility'
  | 'page-voice'
  | 'page-layout'
  | 'page-tokens'
  // components meta
  | 'page-inventory'
  | 'page-cheat-sheet'
  // generic fallback
  | 'page-default';

const MAP: Record<IconName, LucideIcon> = {
  'status-filled': CheckCircle2,
  'status-in-progress': Clock,
  'status-placeholder': Clipboard,
  'status-empty': Circle,
  'meta-tracker': BarChart3,
  'meta-audit': Search,
  'page-principles': BookOpen,
  'page-accessibility': Accessibility,
  'page-voice': PenLine,
  'page-layout': LayoutGrid,
  'page-tokens': Palette,
  'page-inventory': List,
  'page-cheat-sheet': ListChecks,
  'page-default': FileText,
};

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  'aria-hidden'?: boolean;
}

export function Icon({ name, size = 16, className, ...rest }: IconProps) {
  const Component = MAP[name] ?? MAP['page-default'];
  return <Component size={size} className={className} aria-hidden={true} {...rest} />;
}

/** Resolve a foundations-page icon by filename, with frontmatter override. */
export function resolveFoundationsIcon(
  filename: string,
  override?: string,
): IconName {
  if (override && (override as IconName) in MAP) return override as IconName;
  const base = filename.replace(/\.mdx?$/, '');
  switch (base) {
    case 'principles':
      return 'page-principles';
    case 'accessibility':
      return 'page-accessibility';
    case 'voice':
    case 'content-voice':
      return 'page-voice';
    case 'layout':
      return 'page-layout';
    case 'tokens':
      return 'page-tokens';
    default:
      return 'page-default';
  }
}

/** Resolve a status icon name from the page status enum. */
export function resolveStatusIcon(status?: string): IconName {
  switch (status) {
    case 'filled':
      return 'status-filled';
    case 'in-progress':
      return 'status-in-progress';
    case 'placeholder':
      return 'status-placeholder';
    case 'empty':
    default:
      return 'status-empty';
  }
}
