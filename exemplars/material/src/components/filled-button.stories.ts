import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './filled-button';

const meta: Meta = {
  title: '4-components/Filled Button',
  render: ({ label, disabled }) =>
    html`<md-filled-button ?disabled=${disabled}>${label}</md-filled-button>`,
  args: { label: 'Filled', disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};

export const States: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <md-filled-button>Default</md-filled-button>
      <md-filled-button disabled>Disabled</md-filled-button>
    </div>
  `,
};
