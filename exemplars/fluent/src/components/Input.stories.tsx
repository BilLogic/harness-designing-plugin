import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: '4-components/Input',
  component: Input,
  args: { placeholder: 'Email' },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'underline', 'filled-darker', 'filled-lighter'] },
    inputSize: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacingHorizontalS)' }}>
      <Input appearance="outline" placeholder="Outline" />
      <Input appearance="underline" placeholder="Underline" />
      <Input appearance="filled-darker" placeholder="Filled darker" />
      <Input appearance="filled-lighter" placeholder="Filled lighter" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacingHorizontalS)' }}>
      <Input inputSize="small" placeholder="Small" />
      <Input inputSize="medium" placeholder="Medium" />
      <Input inputSize="large" placeholder="Large" />
    </div>
  ),
};
