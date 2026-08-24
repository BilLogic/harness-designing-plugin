import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: '4-components/Button',
  component: Button,
  args: { children: 'Button' },
  argTypes: {
    appearance: { control: 'select', options: ['secondary', 'primary', 'outline', 'subtle', 'transparent'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const AllAppearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacingHorizontalS)' }}>
      <Button appearance="secondary">Secondary</Button>
      <Button appearance="primary">Primary</Button>
      <Button appearance="outline">Outline</Button>
      <Button appearance="subtle">Subtle</Button>
      <Button appearance="transparent">Transparent</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacingHorizontalS)' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacingHorizontalS)' }}>
      <Button disabled>Secondary</Button>
      <Button appearance="primary" disabled>Primary</Button>
      <Button appearance="outline" disabled>Outline</Button>
    </div>
  ),
};
