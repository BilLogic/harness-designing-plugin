import type { Preview } from '@storybook/web-components';
import './harness-blocks/harness-styles.css';
import '../src/styles/tokens.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Material 3 light/dark color modes',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', context.globals.theme);
      }
      return Story();
    },
  ],
  parameters: {
    viewMode: 'docs',
    layout: 'padded',
    a11y: { config: {} },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          '0-welcome',
          '1-foundations',
          '2-styles',
          ['Color', 'Typography', 'Spacing', 'Elevation'],
          '4-components',
          ['Filled Button', 'Filled Text Field', 'Outlined Card'],
          '*',
        ],
      },
    },
  },
};

export default preview;
