import type { Meta, StoryObj } from '@storybook/react';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

const meta: Meta<typeof AlertDescription> = {
  title: '4-components/Alert/AlertDescription',
  component: AlertDescription,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Body copy for an `Alert`. Renders as a `<p>` at 85% opacity below the title. Use for the "what to do next" once the title has stated the situation.',
      },
      bestPractices: {
        do: [
          'Two-sentence pattern: one for the situation, one for the next step.',
          'Use inline links for remediation, inheriting the alert color.',
        ],
        dont: [
          'Write more than two sentences — long prose belongs in a dialog or page.',
          'Restate the title — the description should add new information.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AlertDescription>;

/** Single-sentence description. */
export const Default: Story = {
  render: () => (
    <Alert style={{ width: 480 }}>
      <Info size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
      <AlertTitle>Backup complete</AlertTitle>
      <AlertDescription>The latest snapshot is available in your project archive.</AlertDescription>
    </Alert>
  ),
};

/** Multi-sentence — keep concise. */
export const MultiSentence: Story = {
  render: () => (
    <Alert variant="destructive" style={{ width: 480 }}>
      <AlertTriangle size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
      <AlertTitle>Couldn&apos;t sync</AlertTitle>
      <AlertDescription>
        The connection dropped before the upload finished. Your draft is preserved locally — try
        again when you&apos;re back online.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two-sentence pattern — one for the situation, one for the next step. Avoid more than two; longer prose belongs in a dialog or page, not an alert.',
      },
    },
  },
};

/** With inline link to a remediation. */
export const WithLink: Story = {
  render: () => (
    <Alert style={{ width: 480 }}>
      <Info size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
      <AlertTitle>API key required</AlertTitle>
      <AlertDescription>
        Generate one in{' '}
        <a href="#" style={{ color: 'inherit', textDecoration: 'underline' }}>
          Settings → Developer
        </a>
        .
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Inline link inherits the alert\'s color so it doesn\'t introduce a third semantic palette inside the surface. Underline makes the link discoverable.',
      },
    },
  },
};
