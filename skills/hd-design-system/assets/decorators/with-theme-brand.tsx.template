/**
 * with-theme-brand — applies theme + brand globals via the team's ThemeProvider.
 *
 * Replace the import below with your actual ThemeProvider. The decorator reads
 * `theme` and `brand` from Storybook globals and passes them to the provider.
 *
 * Source pattern: Fluent UI's `withFluentProvider`
 * (https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-storybook-addon).
 */

import React from 'react';
// TODO: replace with your project's ThemeProvider
// import { ThemeProvider } from '{{TEAM_THEME_PROVIDER_PATH}}';

export const withThemeBrand = (Story, context) => {
  const { theme = 'light', brand = 'default' } = context.globals;

  // Fallback when team hasn't wired their ThemeProvider yet — apply data-* attrs
  // on a wrapper div so CSS vars can target [data-theme="dark"] etc.
  return (
    <div data-theme={theme} data-brand={brand} className="harness-theme-root">
      {/* Once team wires their provider:
          <ThemeProvider theme={theme} brand={brand}>
            <Story />
          </ThemeProvider>
      */}
      <Story />
    </div>
  );
};
