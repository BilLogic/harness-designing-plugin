/**
 * with-aria-live — injects an ARIA live region for assistive-technology testing.
 *
 * Source: Fluent UI react-storybook-addon (verbatim pattern).
 * Lets a11y testers verify that components announce changes correctly.
 */

import React from 'react';

export const withAriaLive = (Story, context) => (
  <>
    <div
      id="aria-live-region"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    />
    <Story />
  </>
);
