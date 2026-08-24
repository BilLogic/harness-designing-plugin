import type { SourceOfTruthPath } from '../types';

export interface SourceOfTruthProps {
  paths: SourceOfTruthPath[];
}

const TIER_ORDER: Record<string, number> = { '1': 0, '2': 1, '3': 2 };

export function SourceOfTruth({ paths }: SourceOfTruthProps) {
  if (!paths || paths.length === 0) {
    return (
      <section className="hd-section" data-hd-id="welcome-source-of-truth">
        <h2 className="hd-section-title">Source of truth</h2>
        <p className="hd-card-meta">No source-of-truth paths declared yet.</p>
      </section>
    );
  }

  const sorted = [...paths].sort((a, b) => {
    const t = (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9);
    if (t !== 0) return t;
    return a.label.localeCompare(b.label);
  });

  return (
    <section className="hd-section" data-hd-id="welcome-source-of-truth">
      <h2 className="hd-section-title">Source of truth</h2>
      <table className="hd-sot-table">
        <thead>
          <tr>
            <th className="hd-sot-tier">Tier</th>
            <th className="hd-sot-label">Label</th>
            <th className="hd-sot-path">Path</th>
            <th className="hd-sot-purpose">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={`${p.tier}-${p.path}`}>
              <td className="hd-sot-tier">
                <span className="hd-tier-badge" data-tier={p.tier}>{`T${p.tier}`}</span>
              </td>
              <td className="hd-sot-label">{p.label}</td>
              <td className="hd-sot-path">
                <a href={`vscode://file/${p.path}`} target="_blank" rel="noopener noreferrer">
                  <code>{p.path}</code>
                </a>
              </td>
              <td className="hd-sot-purpose">{p.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
