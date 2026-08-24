/**
 * with-direction — applies direction global as `dir` attribute.
 * LTR / RTL toggle for testing internationalization.
 */

import React from 'react';

export const withDirection = (Story, context) => {
  const { direction = 'ltr' } = context.globals;
  return (
    <div dir={direction} style={{ display: 'contents' }}>
      <Story />
    </div>
  );
};
