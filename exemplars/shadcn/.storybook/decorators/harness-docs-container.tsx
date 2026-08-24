/**
 * harness-docs-container — Storybook DocsContainer with HarnessStatusBanner injection.
 *
 * Source pattern: Fluent UI's FluentDocsContainer.
 * Reads frontmatter from the page's source MDX (via parameters.docs.metadata in
 * Storybook 8+) and injects <HarnessStatusBanner> at the top.
 */

import React from 'react';
import { DocsContainer } from '@storybook/blocks';
import { HarnessStatusBanner } from '../harness-blocks/HarnessStatusBanner';

export const HarnessDocsContainer = ({ children, context }) => {
  // Storybook 8+ exposes the page's parsed frontmatter via context.componentStories[0]
  // For now, banner reads from parameters.docs.metadata — set by tooling.
  const metadata = context?.componentStories?.[0]?.parameters?.docs?.metadata || {};
  return (
    <DocsContainer context={context}>
      <HarnessStatusBanner
        status={metadata.status}
        lastFilled={metadata.last_filled}
        todos={metadata.todos}
      />
      {children}
    </DocsContainer>
  );
};
