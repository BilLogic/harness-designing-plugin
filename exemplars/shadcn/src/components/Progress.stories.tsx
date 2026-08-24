import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';
import { Label } from './Label';

const meta: Meta<typeof Progress> = {
  title: '4-components/Progress',
  component: Progress,
  tags: ['autodocs', '!dev'],
  args: { value: 60 },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Determinate or indeterminate progress bar. Renders `role="progressbar"` with `aria-valuenow`. Use indeterminate (`value={null}`) only when the duration genuinely can\'t be estimated.',
      },
      bestPractices: {
        do: [
          'Pair with a label and tabular-nums readout — slider gives feel, readout gives exact percent.',
          'Prefer determinate (`value` 0-100) — show real progress when you can compute it.',
          'Use `value={null}` indeterminate only for genuinely unknown durations.',
        ],
        dont: [
          'Default to indeterminate when you have a percentage available.',
          'Animate determinate progress backwards — only forwards or jumps.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Progress>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  width: 320,
};

/** Canonical determinate progress. */
export const Default: Story = {
  args: { value: 60 },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Progress {...args} />
    </div>
  ),
};

/** With label and percentage readout. */
export const WithLabel: Story = {
  render: () => (
    <div style={stack}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Label>Uploading</Label>
        <span style={{ fontSize: 'var(--text-sm)', fontVariantNumeric: 'tabular-nums', color: 'var(--muted-foreground)' }}>
          60%
        </span>
      </div>
      <Progress value={60} />
    </div>
  ),
};

/** Multiple values — common pattern in onboarding flows. */
export const Steps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: 320 }}>
      {[
        { label: 'Profile', value: 100 },
        { label: 'Preferences', value: 75 },
        { label: 'Verification', value: 30 },
        { label: 'Complete', value: 0 },
      ].map((item) => (
        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
            <span>{item.label}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--muted-foreground)' }}>
              {item.value}%
            </span>
          </div>
          <Progress value={item.value} />
        </div>
      ))}
    </div>
  ),
};

/** Indeterminate state — when duration is unknown. */
export const Indeterminate: Story = {
  render: () => (
    <div style={stack}>
      <Label>Connecting...</Label>
      <Progress value={null} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pass `value={null}` for indeterminate progress — animates a sliding bar. Reserve for genuinely unknown durations; prefer determinate when you can estimate.',
      },
    },
  },
};
