import type { Meta, StoryObj } from '@storybook/react';
import { Search, Mail } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: '4-components/Input',
  component: Input,
  tags: ['autodocs', '!dev'],
  args: { placeholder: 'Email' },
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text entry. All native input attributes pass through; styling consumes `--input` and `--ring` tokens.',
      },
      bestPractices: {
        do: [
          'Pair every input with a `<Label htmlFor>` — placeholder is not a name.',
          'Match `type` to the data: `email`, `tel`, `number`, `url`, `password`, `search`.',
          'Set `aria-invalid="true"` and `aria-describedby` on errored inputs.',
          'Use `readOnly` when the value is meaningful but not editable; `disabled` to skip the field entirely.',
        ],
        dont: [
          'Use `placeholder` as the label — it disappears on type and screen readers may skip it.',
          'Hide errors silently — always announce via linked helper text.',
          'Force a fixed pixel width — let the parent layout decide.',
          'Apply custom `border-color` for focus — `--ring` is the system signal.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  maxWidth: 320,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--foreground)',
};

const wrapStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '0.625rem',
  color: 'var(--muted-foreground)',
  pointerEvents: 'none',
};

/** Canonical example. The story drives the args panel. */
export const Default: Story = {
  args: { placeholder: 'Email' },
};

/** All states across the input: default, focused, with value, disabled, read-only. */
export const States: Story = {
  render: () => (
    <div style={stack}>
      <Input placeholder="Default" />
      <Input placeholder="With value" defaultValue="hello@anthropic.com" />
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Read-only" readOnly defaultValue="readonly value" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default · with value · disabled · read-only. Disabled prevents interaction; read-only allows selection but blocks edits.',
      },
    },
  },
};

/** Pair with `<Label htmlFor>` for accessible names. Required for every form field. */
export const WithLabel: Story = {
  render: () => (
    <div style={stack}>
      <label htmlFor="email-1" style={labelStyle}>
        Email
      </label>
      <Input id="email-1" type="email" placeholder="you@example.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Always pair with a visible or sr-only `<label htmlFor>` — `placeholder` alone is not an accessible name.',
      },
    },
  },
};

/** Common input types: email, password, search, number, tel, url. */
export const Types: Story = {
  render: () => (
    <div style={stack}>
      <Input type="email" placeholder="email" />
      <Input type="password" placeholder="password" defaultValue="•••••••" />
      <Input type="number" placeholder="number" />
      <Input type="search" placeholder="search" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the right `type` for keyboard variants — `email`, `tel`, `number`, `search`, `password`, `url`. Native validation comes for free.',
      },
    },
  },
};

/** Wrap with an icon adornment via a positioned wrapper. */
export const WithIcon: Story = {
  render: () => (
    <div style={stack}>
      <div style={wrapStyle}>
        <Search size={14} style={iconStyle} />
        <Input placeholder="Search" style={{ paddingLeft: '2rem' }} />
      </div>
      <div style={wrapStyle}>
        <Mail size={14} style={iconStyle} />
        <Input
          type="email"
          placeholder="you@example.com"
          style={{ paddingLeft: '2rem' }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Icons live in a positioned wrapper around `<Input>` — the input itself stays a primitive; layout concerns sit outside.',
      },
    },
  },
};

/** Invalid state via `aria-invalid` — paired with helper text below. */
export const Invalid: Story = {
  render: () => (
    <div style={stack}>
      <label htmlFor="email-2" style={labelStyle}>
        Email
      </label>
      <Input
        id="email-2"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="email-2-error"
      />
      <span
        id="email-2-error"
        style={{
          fontSize: '0.75rem',
          color: 'var(--destructive)',
        }}
      >
        Enter a valid email address.
      </span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`aria-invalid="true"` plus `aria-describedby` linking to a helper-text element — both required for accessible error announcement.',
      },
    },
  },
};
