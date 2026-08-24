import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { Label } from './Label';

const meta: Meta<typeof Textarea> = {
  title: '4-components/Textarea',
  component: Textarea,
  tags: ['autodocs', '!dev'],
  args: { placeholder: 'Type your message...' },
  parameters: {
    docs: {
      description: {
        component:
          'Multi-line text entry. Native `<textarea>` — all attributes pass through. Resizes vertically only.',
      },
      bestPractices: {
        do: [
          'Pair with a `<Label htmlFor>` and helper text where the constraints (length, format) matter.',
          'Set `rows` to roughly the expected entry length — 3 for short messages, 6+ for prose.',
          'Allow vertical resize only — horizontal resize breaks layouts.',
        ],
        dont: [
          'Use a Textarea for single-line inputs — `Input` is the right primitive.',
          'Hide the resize handle entirely — power users rely on it.',
          'Auto-grow without a max-height — runaway content can dominate the viewport.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: 380,
};

/** Canonical example. */
export const Default: Story = {
  args: { placeholder: 'Type your message...' },
};

/** All states: default, with value, disabled, read-only. */
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', maxWidth: 380 }}>
      <Textarea placeholder="Default" />
      <Textarea defaultValue="A few lines of content already typed in. Resize handle bottom-right." />
      <Textarea placeholder="Disabled" disabled />
      <Textarea readOnly defaultValue="Read-only — selectable, not editable." />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default · with value · disabled · read-only. Disabled prevents interaction; read-only allows selection.',
      },
    },
  },
};

/** Paired with a `<Label>` and helper text. */
export const WithLabel: Story = {
  render: () => (
    <div style={stack}>
      <Label htmlFor="ta-feedback">Feedback</Label>
      <Textarea id="ta-feedback" placeholder="What could be better?" rows={4} />
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
        We read every message. No bots.
      </span>
    </div>
  ),
};

/** Invalid state with `aria-invalid` and error text. */
export const Invalid: Story = {
  render: () => (
    <div style={stack}>
      <Label htmlFor="ta-bio">Bio</Label>
      <Textarea
        id="ta-bio"
        defaultValue={'A'.repeat(280)}
        aria-invalid="true"
        aria-describedby="ta-bio-error"
        rows={4}
      />
      <span
        id="ta-bio-error"
        style={{ fontSize: 'var(--text-xs)', color: 'var(--destructive)' }}
      >
        Bios are limited to 240 characters.
      </span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Same a11y contract as `Input` — `aria-invalid="true"` plus `aria-describedby` linking to the error text.',
      },
    },
  },
};
