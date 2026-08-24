import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import { Input } from './Input';

const meta: Meta<typeof Label> = {
  title: '4-components/Label',
  component: Label,
  tags: ['autodocs', '!dev'],
  args: { children: 'Email' },
  parameters: {
    docs: {
      description: {
        component:
          'Accessible name for a form control. Pair with `htmlFor` — placeholder text is not an accessible name.',
      },
      bestPractices: {
        do: [
          'Always set `htmlFor` to the matching input\'s `id`.',
          'Mark required fields with both a visible asterisk and `aria-required` on the input.',
          'Place the label above the input — the canonical vertical-stack pattern.',
        ],
        dont: [
          'Skip the label for "obvious" fields — it\'s required for screen readers.',
          'Wrap the input inside the label without `htmlFor` — explicit beats implicit.',
          'Use a label as the heading of a non-form control — it\'s for inputs only.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Label>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: 320,
};

/** Canonical example — drives the args panel. */
export const Default: Story = {
  args: { children: 'Email' },
};

/** Paired with an `<Input>` via `htmlFor`. The required pattern. */
export const WithInput: Story = {
  render: () => (
    <div style={stack}>
      <Label htmlFor="label-email">Email</Label>
      <Input id="label-email" type="email" placeholder="you@example.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`htmlFor` must match the input\'s `id`. Clicking the label focuses the input — and screen readers announce the label when the input is focused.',
      },
    },
  },
};

/** Required indicator inline. */
export const Required: Story = {
  render: () => (
    <div style={stack}>
      <Label htmlFor="label-required">
        Email <span aria-hidden style={{ color: 'var(--destructive)' }}>*</span>
      </Label>
      <Input id="label-required" type="email" required aria-required="true" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Mark required fields with a visible indicator and `aria-required="true"` on the input. The asterisk is decorative (`aria-hidden`); ARIA carries the semantic.',
      },
    },
  },
};

/** Helper text below the field, linked via `aria-describedby`. */
export const WithHelper: Story = {
  render: () => (
    <div style={stack}>
      <Label htmlFor="label-helper">Email</Label>
      <Input
        id="label-helper"
        type="email"
        placeholder="you@example.com"
        aria-describedby="label-helper-hint"
      />
      <span
        id="label-helper-hint"
        style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}
      >
        We&apos;ll send a magic link — no password required.
      </span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Helper text is announced after the label when the input is focused, via `aria-describedby` linking to the helper element\'s `id`.',
      },
    },
  },
};
