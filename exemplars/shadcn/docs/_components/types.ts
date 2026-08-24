/**
 * Shared types for the welcome page.
 * Mirror of the JSON schemas in `welcome-template-spec.md`.
 */

export type Status = 'empty' | 'placeholder' | 'in-progress' | 'filled';

export interface PageFrontmatter {
  status?: Status;
  description?: string;
  last_filled?: string;
  todos?: number;
  category?: string;
  chips?: string[];
  kicker?: string;
  preview?: string;
  preview_args?: Record<string, unknown>;
  icon?: string;
  thumbnail?: string;
}

export interface ComponentEntry {
  name: string;
  doc: string;
  path: string;
  status: Status;
  category?: string;
  variants?: string[];
  states?: string[];
  chips?: string[];
  preview?: string | null;
  preview_args?: Record<string, unknown>;
  /**
   * When a component family is documented as a folder (Fluent's pattern), list
   * the canonical sibling order. Optional — single-page components omit this.
   */
  siblings?: string[];
}

export interface SourceOfTruthPath {
  tier: '1' | '2' | '3';
  label: string;
  path: string;
  purpose: string;
}

export interface ManifestSchema {
  spec_version: string;
  scenario: 'starter' | 'figma-only' | 'code-and-figma' | 'code-only';
  display_name?: string;
  lede: string;
  last_filled_at: string;
  tokens: {
    tiers: string[];
    modes: string[];
    brands?: string[];
    source_of_truth: string;
  };
  folders_enabled: {
    foundations: boolean;
    styles: boolean;
    assets: boolean;
    components: boolean;
    patterns: boolean;
    data_viz: boolean;
    specs: boolean;
  };
  counts: {
    tokens: { color?: number; space?: number; type?: number; elevation?: number; icon?: number };
    foundation_pages?: number;
    style_pages?: number;
    components?: number;
    internal_components?: number;
  };
  rules: string[];
  source_of_truth_paths: SourceOfTruthPath[];
  tracker_stats?: {
    filled: number;
    in_progress: number;
    empty: number;
    last: string;
  };
}

export interface AuditFinding {
  type:
    | 'discrepancy'
    | 'redundancy'
    | 'orphan-token'
    | 'inline-value'
    | 'naming-inconsistency'
    | 'doc-fragment';
  severity: 'high' | 'medium' | 'low';
}

export interface AuditFindings {
  last_run: string;
  findings: AuditFinding[];
}

export interface PackageJson {
  name: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface MdxModule {
  default?: unknown;
  frontmatter?: PageFrontmatter;
}
