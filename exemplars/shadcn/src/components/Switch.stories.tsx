import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';
import { Label } from './Label';

const meta: Meta<typeof Switch> = {
  title: '4-components/Switch',
  component: Switch,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Binary on/off control for instant settings. Use a `Checkbox` instead when the change applies on submit, not immediately.',
      },
      bestPractices: {
        do: [
          'Use for settings that take effect immediately — toggling persists.',
          'Pair with a `<Label htmlFor>` so the label area is also the click target.',
          'Reflect the **outcome state**, not a verb — the label is "Notifications", not "Enable notifications".',
        ],
        dont: [
          'Use for settings that need a Save button — that\'s a checkbox.',
          'Stack switches next to checkboxes in the same form — pick one mental model.',
          'Animate the thumb so slowly that the toggle feels unresponsive (~160ms is the cap).',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const row: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.625rem',
};

/** Canonical example. */
export const Default: Story = {
  render: () => (
    <div style={row}>
      <Switch id="sw-default" defaultChecked />
      <Label htmlFor="sw-default">Notifications</Label>
    </div>
  ),
};

/** Both states: off · on. */
export const States: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <Switch id="sw-off" />
        <Label htmlFor="sw-off">Off</Label>
      </div>
      <div style={row}>
        <Switch id="sw-on" checked />
        <Label htmlFor="sw-on">On</Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Switch carries `role="switch"` so screen readers announce "on/off" rather than "checked/unchecked" — the right semantic for instant-applied settings.',
      },
    },
  },
};

/** Disabled across both states. */
export const Disabled: Story = {
  render: () => (
    <div style={stack}>
      <div style={row}>
        <Switch id="sw-disabled-off" disabled />
        <Label htmlFor="sw-disabled-off" style={{ opacity: 0.5 }}>
          Disabled, off
        </Label>
      </div>
      <div style={row}>
        <Switch id="sw-disabled-on" disabled defaultChecked />
        <Label htmlFor="sw-disabled-on" style={{ opacity: 0.5 }}>
          Disabled, on
        </Label>
      </div>
    </div>
  ),
};

/** Switch with description — common in settings panels. */
export const WithDescription: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1rem 1.25rem',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        maxWidth: 420,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Label htmlFor="sw-marketing">Marketing emails</Label>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
          Receive product updates and announcements. Never more than once a week.
        </span>
      </div>
      <Switch id="sw-marketing" defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Settings-row pattern — label on the left with a helper line, switch on the right. The whole row is clickable via the label.',
      },
    },
  },
};

/** A list of switches — common settings pattern. */
export const SettingsList: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        maxWidth: 420,
      }}
    >
      {[
        { id: 'sw-mentions', label: 'Mentions', defaultChecked: true },
        { id: 'sw-replies', label: 'Replies', defaultChecked: true },
        { id: 'sw-digest', label: 'Weekly digest', defaultChecked: false },
      ].map((item, idx) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.25rem',
            borderTop: idx === 0 ? 'none' : '1px solid var(--border)',
          }}
        >
          <Label htmlFor={item.id}>{item.label}</Label>
          <Switch id={item.id} defaultChecked={item.defaultChecked} />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Stack switches in a bordered list — common for notification settings. Hairline `border-top` between rows; first row skips it.',
      },
    },
  },
};
