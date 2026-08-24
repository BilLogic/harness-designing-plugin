import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';

const meta: Meta<typeof TabsContent> = {
  title: '4-components/Tabs/TabsContent',
  component: TabsContent,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The panel that renders for the active tab. Hidden via `hidden` attribute when its `value` doesn\'t match. `role="tabpanel"` and `aria-labelledby` linking to the trigger.',
      },
      bestPractices: {
        do: [
          'Hold any markup — prose, forms, tables, charts.',
          'Match each panel\'s `value` to a trigger — both are required.',
          'Keep `tabIndex={0}` on the panel so keyboard users can move focus into it.',
        ],
        dont: [
          'Hide critical form controls inside a non-default panel for a required form.',
          'Force a fixed height — let panel content size naturally.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TabsContent>;

const panel: React.CSSProperties = {
  padding: '1rem 1.25rem',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  background: 'var(--card)',
  fontSize: 'var(--text-sm)',
  width: 380,
};

/** Default — prose body. */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ width: 380 }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" style={panel}>
        <p style={{ margin: 0 }}>Prose body — paragraphs, headings, anything that fits.</p>
      </TabsContent>
      <TabsContent value="activity" style={panel}>
        Activity feed
      </TabsContent>
    </Tabs>
  ),
};

/** With a form inside — common pattern for settings tabs. */
export const Form: Story = {
  render: () => (
    <Tabs defaultValue="account" style={{ width: 380 }}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="account" style={panel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <Label htmlFor="tc-name">Display name</Label>
          <Input id="tc-name" defaultValue="Avery Brooks" />
          <Label htmlFor="tc-email" style={{ marginTop: '0.5rem' }}>
            Email
          </Label>
          <Input id="tc-email" type="email" defaultValue="avery@example.com" />
          <div style={{ marginTop: '0.75rem' }}>
            <Button>Save changes</Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="security" style={panel}>
        Security settings
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Tab content can hold any markup — forms, tables, charts. Each panel is `tabIndex={0}` so keyboard users can move focus into it after the trigger.',
      },
    },
  },
};

/** Each panel has different content density — common in dashboards. */
export const VariableDensity: Story = {
  render: () => (
    <Tabs defaultValue="summary" style={{ width: 380 }}>
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="detail">Detail</TabsTrigger>
      </TabsList>
      <TabsContent value="summary" style={panel}>
        <span>3 active · 2 archived</span>
      </TabsContent>
      <TabsContent value="detail" style={panel}>
        <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
          <li>Active item one</li>
          <li>Active item two</li>
          <li>Active item three</li>
          <li style={{ color: 'var(--muted-foreground)' }}>Archived: alpha</li>
          <li style={{ color: 'var(--muted-foreground)' }}>Archived: beta</li>
        </ul>
      </TabsContent>
    </Tabs>
  ),
};
