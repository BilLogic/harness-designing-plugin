import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './outlined-card';
import './filled-button';

const meta: Meta = {
  title: '4-components/Outlined Card',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <md-outlined-card style="max-width: 360px;">
      <h3 style="margin: 0 0 8px; font: var(--md-sys-typescale-title-medium-weight) var(--md-sys-typescale-title-medium-size) / var(--md-sys-typescale-title-medium-line-height) var(--md-sys-typescale-title-medium-font);">
        Notifications
      </h3>
      <p style="margin: 0 0 16px; font: var(--md-sys-typescale-body-medium-weight) var(--md-sys-typescale-body-medium-size) / var(--md-sys-typescale-body-medium-line-height) var(--md-sys-typescale-body-medium-font); color: var(--md-sys-color-on-surface-variant);">
        You have 3 unread messages.
      </p>
      <md-filled-button>Open</md-filled-button>
    </md-outlined-card>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <md-outlined-card style="flex: 1;">
        <strong>Outlined</strong>
        <p style="margin: 8px 0 0; color: var(--md-sys-color-on-surface-variant);">Border, no shadow.</p>
      </md-outlined-card>
      <md-elevated-card style="flex: 1;">
        <strong>Elevated</strong>
        <p style="margin: 8px 0 0; color: var(--md-sys-color-on-surface-variant);">Surface tint, level-1 shadow.</p>
      </md-elevated-card>
    </div>
  `,
};
