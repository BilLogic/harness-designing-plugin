import type { Meta, StoryObj } from '@storybook/react';
import { Info, AlertTriangle, Terminal } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

const meta: Meta<typeof Alert> = {
  title: '4-components/Alert/Alert',
  component: Alert,
  tags: ['autodocs', '!dev'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Inline contextual message — info, warning, or error. Renders `role="alert"` so screen readers announce it. Two variants — `default` (informational) and `destructive` (error). Composes with `AlertTitle` and `AlertDescription` (each on their own page).',
      },
      bestPractices: {
        do: [
          'Use `default` for advisory messages, `destructive` for errors and critical states.',
          'Pair with a leading icon — `Info` for default, `AlertTriangle` for destructive.',
          'Always include `AlertTitle` — it\'s what screen readers announce first.',
        ],
        dont: [
          'Use an Alert for transient feedback — toasts/notifications fit better there.',
          'Stack multiple alerts in the same surface — pick one, escalate severity if needed.',
          'Hide an error inline at the bottom — alerts surface near the cause.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  width: 480,
};

/** Canonical default alert. */
export const Default: Story = {
  render: () => (
    <Alert style={{ width: 480 }}>
      <Terminal size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app via the CLI.
      </AlertDescription>
    </Alert>
  ),
};

/** Both variants side-by-side. */
export const Variants: Story = {
  render: () => (
    <div style={stack}>
      <Alert>
        <Info size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
        <AlertTitle>Default · informational</AlertTitle>
        <AlertDescription>
          Neutral message — backups complete, scheduled maintenance, etc.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangle size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.125rem' }} />
        <AlertTitle>Destructive · error</AlertTitle>
        <AlertDescription>
          Something went wrong. The most recent change was not saved.
        </AlertDescription>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two variants — `default` for advisory messages, `destructive` for errors and critical states. Variants map to severity, not aesthetic.',
      },
    },
  },
};

/** Title-only — no description body. */
export const TitleOnly: Story = {
  render: () => (
    <Alert style={{ width: 480 }}>
      <Info size={16} aria-hidden style={{ gridColumn: 1, marginTop: '0.0625rem' }} />
      <AlertTitle>Synced 2 minutes ago.</AlertTitle>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Drop `AlertDescription` when the title says everything — common for short status confirmations.',
      },
    },
  },
};
