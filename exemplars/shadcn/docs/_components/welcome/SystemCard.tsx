import type { ManifestSchema, PackageJson } from '../types';
import { deriveStack, formatDate } from './utils';

export interface SystemCardProps {
  pkg: PackageJson;
  manifest: ManifestSchema;
}

export function SystemCard({ pkg, manifest }: SystemCardProps) {
  const title = manifest.display_name ?? pkg.name;
  const lastFilled = formatDate(manifest.last_filled_at);
  const stack = deriveStack(pkg, manifest);

  const tokenCounts = manifest.counts.tokens ?? {};
  const tokenLabel = [
    tokenCounts.color ? `${tokenCounts.color} role pairs` : null,
    tokenCounts.space ? `${tokenCounts.space} spacing` : null,
    tokenCounts.type ? `${tokenCounts.type} type` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const componentLabel = (() => {
    const documented = manifest.counts.components;
    const internal = manifest.counts.internal_components;
    if (documented == null && internal == null) return '';
    const parts: string[] = [];
    if (documented != null) parts.push(`${documented} documented`);
    if (internal != null) parts.push(`${internal} internal`);
    return parts.join(' · ');
  })();

  const themesLabel = manifest.tokens.modes?.length ? manifest.tokens.modes.join(' · ') : '—';

  const metaItems: { label: string; value: string }[] = [];
  if (stack) metaItems.push({ label: 'Stack', value: stack });
  if (tokenLabel) metaItems.push({ label: 'Tokens', value: tokenLabel });
  if (componentLabel) metaItems.push({ label: 'Components', value: componentLabel });
  if (themesLabel) metaItems.push({ label: 'Themes', value: themesLabel });

  return (
    <header className="hd-system-card" data-hd-id="welcome-system-card">
      <div className="hd-system-card-eyebrow">
        <span className="hd-eyebrow-left">{pkg.name} · Design System Reference</span>
        {lastFilled && <span className="hd-eyebrow-right">Last refreshed {lastFilled}</span>}
      </div>
      <h1 className="hd-system-card-title">{title}</h1>
      <p className="hd-system-card-lede">{manifest.lede}</p>
      {metaItems.length > 0 && (
        <dl className="hd-system-card-meta">
          {metaItems.map((m) => (
            <div key={m.label} className="hd-meta-item">
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
