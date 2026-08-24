/**
 * Panel — Claude Design panel pattern. Labeled container with header (name + source path) + body slot.
 *
 * Used in component.mdx + pattern.mdx templates around <Canvas> / live demos.
 * Source: Claude Design components.html `panel-header` + `panel-body`.
 */

import React, { ReactNode } from 'react';

export type PanelProps = {
  name: string;
  source?: string;
  children: ReactNode;
};

export const Panel: React.FC<PanelProps> = ({ name, source, children }) => (
  <div className="harness-panel">
    <div className="harness-panel-header">
      <span className="harness-panel-name">{name}</span>
      {source && (
        <a
          className="harness-panel-source"
          href={`vscode://file/${encodeURIComponent(source)}`}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${source}`}
        >
          <code>{source}</code>
        </a>
      )}
    </div>
    <div className="harness-panel-body">{children}</div>
  </div>
);
