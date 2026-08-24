import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { Label } from './Label';

const meta: Meta<typeof Checkbox> = {
  title: '4-components/Checkbox',
  component: Checkbox,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Tri-state toggle for options. Supports `checked`, `unchecked`, and `indeterminate` (mixed) — pair with a `<Label>` via `htmlFor`.',
      },
      bestPractices: {
        do: [
          'Always pair with a `<Label htmlFor>` — the click target should include the label.',
          'Use `checked="indeterminate"` for parent rows when child rows are partially selected.',
          'Wrap related checkboxes in `<fieldset>` with `<legend>` — the legend names the group.',
          'Apply on submit, not on toggle — checkboxes batch decisions before commit.',
        ],
        dont: [
          'Use a checkbox where a switch is right — switches apply changes immediately.',
          'Mix singular and plural questions in the same group ("Notify me" vs "Receive emails").',
          'Hide the label and rely on tooltip text for the name.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
};

const row: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
};

/** Canonical example. */
export const Default: Story = {
  render: () => (
    <div style={row}>
      <Checkbox id="cb-default" defaultChecked />
      <Label htmlFor="cb-default">Accept terms and conditions</Label>
    </div>
  ),
};

/** All three states: unchecked · checked · indeterminate. */
export const States: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <Checkbox id="cb-off" />
        <Label htmlFor="cb-off">Unchecked</Label>
      </div>
      <div style={row}>
        <Checkbox id="cb-on" checked />
        <Label htmlFor="cb-on">Checked</Label>
      </div>
      <div style={row}>
        <Checkbox id="cb-mixed" checked="indeterminate" />
        <Label htmlFor="cb-mixed">Indeterminate (mixed)</Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three states. `checked="indeterminate"` sets `aria-checked="mixed"` — use it for parent rows when child rows are partially selected.',
      },
    },
  },
};

/** Disabled across both states. */
export const Disabled: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <Checkbox id="cb-disabled-off" disabled />
        <Label htmlFor="cb-disabled-off" style={{ opacity: 0.5 }}>
          Disabled, unchecked
        </Label>
      </div>
      <div style={row}>
        <Checkbox id="cb-disabled-on" disabled defaultChecked />
        <Label htmlFor="cb-disabled-on" style={{ opacity: 0.5 }}>
          Disabled, checked
        </Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disabled prevents interaction. Dim the paired label too — visual parity matters for non-pointer users.',
      },
    },
  },
};

/** Checkbox group — common pattern for multi-select. */
export const Group: Story = {
  render: () => (
    <fieldset
      style={{
        ...stack,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1rem 1.25rem',
        margin: 0,
      }}
    >
      <legend style={{ fontSize: 'var(--text-sm)', fontWeight: 500, padding: '0 0.25rem' }}>
        Notify me about
      </legend>
      {[
        { id: 'cb-mentions', label: 'Mentions', defaultChecked: true },
        { id: 'cb-replies', label: 'Replies', defaultChecked: true },
        { id: 'cb-digest', label: 'Weekly digest', defaultChecked: false },
      ].map((item) => (
        <div key={item.id} style={row}>
          <Checkbox id={item.id} defaultChecked={item.defaultChecked} />
          <Label htmlFor={item.id}>{item.label}</Label>
        </div>
      ))}
    </fieldset>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Wrap related checkboxes in a `<fieldset>` with a `<legend>` — the legend becomes the group\'s accessible name.',
      },
    },
  },
};
