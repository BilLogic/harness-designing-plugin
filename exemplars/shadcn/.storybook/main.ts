import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    '../docs/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    {
      // Enable GitHub Flavored Markdown (`remark-gfm`) so pipe-syntax tables in
      // .mdx — which Storybook 8 / MDX 3 ignores by default — render as real
      // <table> elements. Without this, every `| col | col |` row appears as
      // literal text.
      // https://storybook.js.org/docs/writing-docs/mdx#markdown-tables-arent-rendering-correctly
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
};

export default config;
