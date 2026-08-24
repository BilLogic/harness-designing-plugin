import type { Preview } from '@storybook/react';
import './harness-blocks/harness-styles.css';
import '../src/styles/tokens.css';

/**
 * Fluent 2's full toolbar control set — theme + brand + direction + strictMode.
 * Modeled on Microsoft FluentUI's react-storybook-addon globalTypes.
 *
 * See https://github.com/microsoft/fluentui/tree/master/packages/react-components/react-storybook-addon
 */
const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Fluent 2 light/dark/high-contrast',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'high-contrast', title: 'High Contrast' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      name: 'Brand',
      description: 'Brand ramp variant',
      defaultValue: 'default',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'default', title: 'Default (blue)' },
          { value: 'teams', title: 'Teams (purple)' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      name: 'Direction',
      description: 'Reading direction',
      defaultValue: 'ltr',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left → Right' },
          { value: 'rtl', title: 'Right → Left' },
        ],
        dynamicTitle: true,
      },
    },
    strictMode: {
      name: 'Strict mode',
      description: 'React StrictMode wrapper',
      defaultValue: 'off',
      toolbar: {
        icon: 'beaker',
        items: [
          { value: 'off', title: 'Off' },
          { value: 'on', title: 'On' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', context.globals.theme);
        document.documentElement.setAttribute('data-brand', context.globals.brand);
        document.documentElement.setAttribute('dir', context.globals.direction);
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
          ['Color', 'Typography', 'Spacing'],
          '4-components',
          ['Button', 'Input', 'Card'],
          '*',
        ],
      },
    },
  },
};

export default preview;
