import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './filled-text-field';

const meta: Meta = {
  title: '4-components/Filled Text Field',
  render: ({ label, value, disabled }) =>
    html`<md-filled-text-field label=${label} value=${value} ?disabled=${disabled}></md-filled-text-field>`,
  args: { label: 'Email', value: '', disabled: false },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};

export const States: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px;">
      <md-filled-text-field label="Default"></md-filled-text-field>
      <md-filled-text-field label="With value" value="hello@example.com"></md-filled-text-field>
      <md-filled-text-field label="Disabled" disabled></md-filled-text-field>
    </div>
  `,
};
