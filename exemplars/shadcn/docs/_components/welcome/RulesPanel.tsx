import type { ReactNode } from 'react';

export interface RulesPanelProps {
  rules: string[];
  /** Override the intro line shown left of the list. */
  intro?: ReactNode;
}

const DEFAULT_INTRO = (
  <>
    Sourced from <code>AGENTS.md</code>.
    <br />
    Apply to every output.
  </>
);

/**
 * Renders rules as MDX-light strings: a leading bold sentence followed by a
 * clause. We split on the first period after a leading bold marker.
 */
function renderRule(rule: string) {
  // Match pattern: "**Bold lead.** clause text..." OR "**Bold lead** clause..."
  const m = rule.match(/^\*\*([^*]+?)\*\*\.?\s*(.*)$/);
  if (m) {
    const [, lead, rest] = m;
    return (
      <>
        <strong>{lead}.</strong> {rest}
      </>
    );
  }
  return <>{rule}</>;
}

export function RulesPanel({ rules, intro = DEFAULT_INTRO }: RulesPanelProps) {
  if (!rules || rules.length === 0) {
    return (
      <section className="hd-section" data-hd-id="welcome-rules">
        <h2 className="hd-section-title">Non-negotiable rules</h2>
        <div className="hd-rules-panel">
          <p className="hd-card-meta">
            No rules declared yet — extract from AGENTS.md or author in
            <code> index-manifest.json:rules</code>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="hd-section" data-hd-id="welcome-rules">
      <h2 className="hd-section-title">Non-negotiable rules</h2>
      <div className="hd-rules-panel">
        <div className="hd-rules-intro">{intro}</div>
        <ol className="hd-rules-list">
          {rules.slice(0, 8).map((r, i) => (
            <li key={i}>{renderRule(r)}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
