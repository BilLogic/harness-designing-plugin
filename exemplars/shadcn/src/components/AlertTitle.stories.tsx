import type { Meta, StoryObj } from '@storybook/react';
import { Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

const meta: Meta<typeof AlertTitle> = {
  title: '4-components/Alert/AlertTitle',
  component: AlertTitle,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The headline of an `Alert`. Renders as `<h5>` with semibold weight. Always include — the title is what screen readers announce first.',
      },
      bestPractices: {
        do: [
          'Lead with the situation — "Couldn\'t save", "Backup complete", "Heads up!".',
          'Keep titles to one short sentence — body copy goes in `AlertDescription`.',
        ],
        dont: [
          'Use the title for the resolution — that\'s the description\'s job.',
          'Skip punctuation for terse titles — short sentences still need them.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AlertTitle>;

/** Canonical example. */
export const Default: Story = {
  render: () => (
    <Alert style={{ width: 480 }}>
      <Info size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
      <AlertTitle>You have 3 unread messages</AlertTitle>
      <AlertDescription>Open Inbox to review.</AlertDescription>
    </Alert>
  ),
};

/** Verbose title — wraps to two lines. */
export const Wrapped: Story = {
  render: () => (
    <Alert style={{ width: 360 }}>
      <Info size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
      <AlertTitle>
        Scheduled maintenance starting Friday at 02:00 UTC will take services offline for ~30 min
      </AlertTitle>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Titles wrap when the container narrows — line-height stays compact (`1.25`) so multi-line titles stay tight.',
      },
    },
  },
};
