/**
 * Shadcn-flavored DocsPage — port of Fluent UI v9's FluentDocsPage.
 *
 * Composes Storybook's @storybook/blocks (Title, Subtitle, Description,
 * Primary, Stories, ArgTypes) into a 2-column layout: doc body + right-rail
 * TOC. Inline toolbar (Theme + Direction + Copy Page) renders under the H1.
 *
 * Wire as `parameters.docs.page = ShadcnDocsPage` in `.storybook/preview.ts`.
 */
import * as React from 'react';
import {
  ArgTypes,
  Controls,
  Description,
  DocsContext,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/blocks';
import { InlineToolbar } from './InlineToolbar';
import { Toc, nameToHash } from './Toc';
import './docs-page.css';

export function ShadcnDocsPage() {
  const context = React.useContext(DocsContext);
  const stories = context.componentStories();
  const primaryStory = stories[0];
  const primaryCtx = primaryStory ? context.getStoryContext(primaryStory) : null;

  const direction = (primaryCtx?.globals?.direction ?? 'ltr') as 'ltr' | 'rtl';
  const theme = (primaryCtx?.globals?.theme ?? 'light') as 'light' | 'dark';

  const showToc = stories.length > 1;

  // Pull best-practices out of meta parameters if the team supplied them.
  // Stories file: meta.parameters.docs.bestPractices = { do: [...], dont: [...] }
  const meta = (context as any).projectAnnotations?.meta ?? primaryCtx?.parameters;
  const bestPractices = primaryCtx?.parameters?.docs?.bestPractices as
    | { do?: string[]; dont?: string[] }
    | undefined;

  return (
    <div className="sb-unstyled hd-docs-page">
      <Title />

      <InlineToolbar theme={theme} direction={direction} />

      <Subtitle />
      <div className="hd-docs-description">
        <Description />
      </div>

      <hr className="hd-docs-divider" />

      <div className="hd-docs-layout">
        <div className="hd-docs-page-container">
          {primaryStory && (
            <>
              <h2 id={nameToHash(primaryStory.name)} className="hd-docs-section-heading">
                {primaryStory.name}
              </h2>
              <Primary />
              <Controls />
            </>
          )}

          {bestPractices && (bestPractices.do?.length || bestPractices.dont?.length) && (
            <>
              <h2 id="best-practices" className="hd-docs-section-heading">
                Best practices
              </h2>
              <div className="hd-docs-bp-grid">
                {bestPractices.do?.length ? (
                  <div className="hd-docs-bp-col hd-docs-bp-do">
                    <div className="hd-docs-bp-title">Do</div>
                    <ul>
                      {bestPractices.do.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {bestPractices.dont?.length ? (
                  <div className="hd-docs-bp-col hd-docs-bp-dont">
                    <div className="hd-docs-bp-title">Don&apos;t</div>
                    <ul>
                      {bestPractices.dont.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </>
          )}

          {stories.length > 1 && <Stories includePrimary={false} />}

          <h2 id="api-reference" className="hd-docs-section-heading hd-docs-api-heading">
            API Reference
          </h2>
          <ArgTypes />
        </div>

        {showToc && (
          <aside className="hd-docs-toc-rail">
            <Toc stories={stories} bestPractices={!!bestPractices} />
          </aside>
        )}
      </div>
    </div>
  );
}
