export interface SectionHeaderProps {
  number?: string;
  title: string;
  intro?: string;
  count?: string;
}

/**
 * Section header — Claude Design pattern: number + title (nowrap) on the
 * left, count strip on the right, optional 1-sentence intro below the title.
 */
export function SectionHeader({ number, title, intro, count }: SectionHeaderProps) {
  return (
    <div className="hd-section-header">
      <div className="hd-section-header-row">
        <h2 className="hd-section-title">
          {number && <span className="hd-section-number">{number}</span>}
          {title}
        </h2>
        {count && <span className="hd-section-count">{count}</span>}
      </div>
      {intro && <p className="hd-section-intro">{intro}</p>}
    </div>
  );
}
