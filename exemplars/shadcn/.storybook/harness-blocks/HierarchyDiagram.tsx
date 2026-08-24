/**
 * HierarchyDiagram — visual nested boxes showing context hierarchy.
 * Default: Element → Card → Section → Modal (Claude Design spacing pattern).
 */

import React from 'react';

export type HierarchyDiagramProps = {
  levels: string[];
};

export const HierarchyDiagram: React.FC<HierarchyDiagramProps> = ({ levels }) => {
  // Outermost level wraps inner ones; nest from end of array back to start.
  let inner: React.ReactNode = (
    <div className="harness-hierarchy-leaf">leaf</div>
  );
  for (let i = levels.length - 1; i >= 0; i--) {
    inner = (
      <div className={`harness-hierarchy-box harness-hierarchy-level-${i}`}>
        <span className="harness-hierarchy-label">{levels[i]}</span>
        {inner}
      </div>
    );
  }
  return <div className="harness-hierarchy-diagram">{inner}</div>;
};
