import type { Preview } from '@storybook/react';
import './harness-blocks/harness-styles.css';
import '../src/styles/tokens.css';
import { ShadcnDocsPage } from '../docs/_components/docs-page';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'shadcn/ui light/dark',
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
    direction: {
      name: 'Direction',
      description: 'Text direction',
      defaultValue: 'ltr',
      toolbar: {
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', context.globals.theme === 'dark');
        document.documentElement.setAttribute('dir', context.globals.direction ?? 'ltr');
      }
      return Story();
    },
  ],
  parameters: {
    viewMode: 'docs',
    layout: 'padded',
    a11y: { config: {} },
    docs: {
      // Use the Fluent-style ShadcnDocsPage as the default for every component
      // page (where stories file exists). Welcome / foundation / style pages
      // override via their own MDX with <Meta title="..." />.
      page: ShadcnDocsPage,
    },
    options: {
      // Canonical order matches the kicker order on the welcome page's
      // directory section. Mirror in any other consumer (Tracker, Audit).
      storySort: {
        order: [
          '0-welcome',
          ['Introduction'],
          '1-foundations',
          ['Principles', 'Accessibility', 'Voice', 'Layout', 'Tokens'],
          '2-styles',
          ['Color', 'Typography', 'Spacing', 'Elevation', 'Iconography'],
          '4-components',
          [
            // Foundational + Form
            'Button',
            'Input',
            'Textarea',
            'Label',
            'Checkbox',
            'Switch',
            'Slider',
            // Display — Card is a folder (Fluent's pattern); siblings in
            // canonical composition order.
            'Card',
            ['Card', 'CardHeader', 'CardContent', 'CardFooter'],
            'Badge',
            'Avatar',
            ['Avatar', 'AvatarImage', 'AvatarFallback'],
            'Separator',
            'Skeleton',
            'Progress',
            // Navigation
            'Tabs',
            ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
            // Feedback
            'Alert',
            ['Alert', 'AlertTitle', 'AlertDescription'],
            'Tooltip',
            // Layout
            'Accordion',
            ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'],
            // Overlay
            'Dialog',
            ['Dialog', 'DialogContent', 'DialogHeader', 'DialogFooter'],
          ],
          '*',
        ],
      },
    },
  },
  // Auto-generate a docs page (rendered by ShadcnDocsPage above) for every
  // component story file without an explicit MDX. Fluent's pattern.
  tags: ['autodocs'],
};

export default preview;
