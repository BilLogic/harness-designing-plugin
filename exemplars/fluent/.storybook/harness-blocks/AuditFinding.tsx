/**
 * AuditFinding — one row in Audit.mdx. Type tag + severity color + file:line list +
 * optional side-by-side preview + suggested action button.
 *
 * Source: harness-specific (audit-format.md spec).
 */

import React, { ReactNode, useState } from 'react';

export type AuditFindingType =
  | 'discrepancy'
  | 'redundancy'
  | 'orphan-token'
  | 'inline-value'
  | 'naming-inconsistency'
  | 'doc-fragment';

export type AuditFindingProps = {
  type: AuditFindingType;
  severity: 'high' | 'medium' | 'low';
  subject: string;
  locations: { path: string; line?: number }[];
  evidence?: {
    values?: string[];
    preview_left?: string;
    preview_right?: string;
    candidate_token_name?: string;
    convention_violation?: string;
  };
  suggestedAction?: {
    verb: string;
    target: string;
    details: string;
  };
};

const SEVERITY_COLOR = { high: '#c1453a', medium: '#e6a700', low: '#888' };
const TYPE_LABEL = {
  discrepancy: 'Discrepancy',
  redundancy: 'Redundancy',
  'orphan-token': 'Orphan token',
  'inline-value': 'Inline value',
  'naming-inconsistency': 'Naming',
  'doc-fragment': 'Doc fragment',
};

export const AuditFinding: React.FC<AuditFindingProps> = ({
  type,
  severity,
  subject,
  locations,
  evidence,
  suggestedAction,
}) => {
  const [copied, setCopied] = useState(false);

  const onAction = () => {
    if (!suggestedAction) return;
    const cmd = `code -g ${suggestedAction.target}`;
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`harness-audit-finding harness-audit-severity-${severity}`}
      style={{
        padding: '12px 16px',
        margin: '12px 0',
        borderLeft: `4px solid ${SEVERITY_COLOR[severity]}`,
        background: 'var(--color-surface-container-lowest, #fafafa)',
        borderRadius: '4px',
      }}
    >
      <div className="harness-audit-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span
          className="harness-audit-type-tag"
          style={{
            padding: '2px 8px',
            background: SEVERITY_COLOR[severity],
            color: 'white',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {TYPE_LABEL[type]}
        </span>
        <code className="harness-audit-subject" style={{ flex: 1 }}>{subject}</code>
        <span className="harness-audit-severity-badge" style={{ fontSize: '11px', color: SEVERITY_COLOR[severity], textTransform: 'uppercase' }}>
          {severity}
        </span>
      </div>

      <ul className="harness-audit-locations" style={{ margin: '8px 0', paddingLeft: '24px', fontSize: '12px' }}>
        {locations.map((loc, i) => (
          <li key={i}>
            <a
              href={`vscode://file/${encodeURIComponent(loc.path)}${loc.line ? `:${loc.line}` : ''}`}
              style={{ color: 'inherit' }}
            >
              <code>{loc.path}{loc.line ? `:${loc.line}` : ''}</code>
            </a>
          </li>
        ))}
      </ul>

      {evidence?.values && (
        <div className="harness-audit-evidence" style={{ display: 'flex', gap: '12px', margin: '8px 0' }}>
          {evidence.values.map((v, i) => (
            <code key={i} style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', borderRadius: '3px' }}>{v}</code>
          ))}
        </div>
      )}

      {evidence?.preview_left && evidence?.preview_right && (
        <div className="harness-audit-side-by-side" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '8px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: evidence.preview_left }} />
          <div dangerouslySetInnerHTML={{ __html: evidence.preview_right }} />
        </div>
      )}

      {suggestedAction && (
        <div className="harness-audit-action" style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px' }}>
          <strong style={{ fontSize: '12px' }}>Suggested:</strong>{' '}
          <span style={{ fontSize: '13px' }}>{suggestedAction.details}</span>
          <button
            onClick={onAction}
            style={{
              marginLeft: '12px',
              padding: '4px 10px',
              background: 'var(--color-primary, #4f46e5)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : `${suggestedAction.verb} → ${suggestedAction.target}`}
          </button>
        </div>
      )}
    </div>
  );
};
