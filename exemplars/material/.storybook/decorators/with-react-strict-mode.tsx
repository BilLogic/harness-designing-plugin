/**
 * with-react-strict-mode — wraps story in React.StrictMode when toggled on.
 *
 * Source: Fluent UI react-storybook-addon (verbatim pattern).
 * Helps catch double-render side effects + deprecated API usage.
 */

import React, { StrictMode } from 'react';

export const withReactStrictMode = (Story, context) => {
  const { strictMode = 'off' } = context.globals;
  if (strictMode === 'on') {
    return (
      <StrictMode>
        <Story />
      </StrictMode>
    );
  }
  return <Story />;
};
