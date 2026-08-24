import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardFooter } from './Card';
import { Button } from './Button';
import { Input } from './Input';

const meta: Meta<typeof Card> = {
  title: '4-components/Card',
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: 'var(--fontSizeBase400)', fontWeight: 'var(--fontWeightSemibold)' as React.CSSProperties['fontWeight'] }}>Notifications</h3>
        <p style={{ margin: 0, fontSize: 'var(--fontSizeBase200)', color: 'var(--colorNeutralForeground3)' }}>You have 3 unread messages.</p>
      </CardHeader>
      <p>List your latest activity, status updates, or surface review prompts here.</p>
      <CardFooter>
        <Button>Dismiss</Button>
        <Button appearance="primary">Open</Button>
      </CardFooter>
    </Card>
  ),
};

export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacingHorizontalL)', alignItems: 'flex-start' }}>
      <Card appearance="filled" style={{ flex: 1 }}>
        <strong>Filled</strong>
        <p style={{ margin: 0, color: 'var(--colorNeutralForeground3)' }}>Default — shadow + border.</p>
      </Card>
      <Card appearance="outline" style={{ flex: 1 }}>
        <strong>Outline</strong>
        <p style={{ margin: 0, color: 'var(--colorNeutralForeground3)' }}>Border only, no shadow.</p>
      </Card>
      <Card appearance="subtle" style={{ flex: 1 }}>
        <strong>Subtle</strong>
        <p style={{ margin: 0, color: 'var(--colorNeutralForeground3)' }}>Tinted bg, no border, no shadow.</p>
      </Card>
    </div>
  ),
};

export const FormCard: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <h3 style={{ margin: 0, fontSize: 'var(--fontSizeBase400)', fontWeight: 'var(--fontWeightSemibold)' as React.CSSProperties['fontWeight'] }}>Sign in</h3>
        <p style={{ margin: 0, fontSize: 'var(--fontSizeBase200)', color: 'var(--colorNeutralForeground3)' }}>Enter your email to receive a magic link.</p>
      </CardHeader>
      <Input placeholder="you@example.com" type="email" style={{ width: '100%' }} />
      <CardFooter>
        <Button appearance="primary" style={{ width: '100%' }}>Send link</Button>
      </CardFooter>
    </Card>
  ),
};
