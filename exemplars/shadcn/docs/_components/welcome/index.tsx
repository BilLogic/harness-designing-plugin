import type { ComponentType } from 'react';
import type {
  AuditFindings,
  ComponentEntry,
  ManifestSchema,
  MdxModule,
  PackageJson,
} from '../types';
import { SystemCard } from './SystemCard';
import { FoundationsSection } from './FoundationsSection';
import { StylesSection } from './StylesSection';
import { ComponentsSection } from './ComponentsSection';
import { SourceOfTruth } from './SourceOfTruth';
import { RulesPanel } from './RulesPanel';
import './welcome.css';

export interface WelcomeProps {
  pkg: PackageJson;
  manifest: ManifestSchema;
  components: ComponentEntry[];
  pages: Record<string, MdxModule>;
  audit?: AuditFindings;
  /** Optional map of component name → lazy import for live previews. */
  componentPreviews?: Record<string, () => Promise<{ [key: string]: ComponentType<any> }>>;
}

export function Welcome({
  pkg,
  manifest,
  components,
  pages,
  componentPreviews,
}: WelcomeProps) {
  const f = manifest.folders_enabled;
  return (
    <div className="hd-welcome">
      <SystemCard pkg={pkg} manifest={manifest} />

      {f.foundations && <FoundationsSection pages={pages} />}
      {f.styles && <StylesSection pages={pages} />}
      {f.components && (
        <ComponentsSection
          components={components}
          pages={pages}
          previewMap={componentPreviews}
        />
      )}

      <SourceOfTruth paths={manifest.source_of_truth_paths} />
      <RulesPanel rules={manifest.rules} />
    </div>
  );
}
