/**
 * StateLayerScale — state-08 / state-12 / state-16 layer demos.
 * For interaction states: hover (08%) / focus (12%) / pressed (16%).
 */

import React from 'react';

export type StateLayerScaleProps = {
  role: string;
};

const LAYERS = [
  { suffix: 'state-08', label: 'state-08', usage: 'hover (8%)' },
  { suffix: 'state-12', label: 'state-12', usage: 'focus (12%)' },
  { suffix: 'state-16', label: 'state-16', usage: 'pressed (16%)' },
];

export const StateLayerScale: React.FC<StateLayerScaleProps> = ({ role }) => (
  <div className="harness-state-layer-scale">
    {LAYERS.map((l) => {
      const v = `--color-${role}-${l.suffix}`;
      return (
        <div key={l.suffix} className="harness-state-layer">
          <div className="harness-state-layer-swatch" style={{ background: `var(${v})` }} />
          <code className="harness-state-layer-name">{l.label}</code>
          <span className="harness-state-layer-usage">{l.usage}</span>
        </div>
      );
    })}
  </div>
);
