import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: '4-components/Tabs/Tabs',
  component: Tabs,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Composition primitive — root that holds the active value. Wraps `TabsList` (the row) and one `TabsContent` per tab. Each piece documented on its own page.',
      },
      bestPractices: {
        do: [
          'Use tabs to peer at related views without leaving the page — settings, metric cuts, related objects.',
          'Pass `defaultValue` to open on a specific tab — supports deep linking.',
          'Keep tab counts to 5 or fewer — beyond that, prefer a sidebar nav.',
        ],
        dont: [
          'Use tabs for sequential flows — that\'s a stepper or wizard.',
          'Hide critical actions (Save, Delete) inside non-default tabs.',
          'Mix tab text + tab icons in the same `TabsList` — pick one rhythm.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const panel: React.CSSProperties = {
  padding: '1rem 1.25rem',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  background: 'var(--card)',
  fontSize: 'var(--text-sm)',
  width: 380,
};

/** Canonical tabs surface — three panels. */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" style={{ width: 380 }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" style={panel}>
        Overview content — top-level summary lives here. Use Tabs to peer at related views without leaving the page.
      </TabsContent>
      <TabsContent value="activity" style={panel}>
        Activity feed — recent actions, sorted by time.
      </TabsContent>
      <TabsContent value="settings" style={panel}>
        Settings — configuration for the surface above.
      </TabsContent>
    </Tabs>
  ),
};

/** Default-value selection — opens to a specific tab. */
export const StartOnSpecificTab: Story = {
  render: () => (
    <Tabs defaultValue="settings" style={{ width: 380 }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" style={panel}>
        Overview content.
      </TabsContent>
      <TabsContent value="activity" style={panel}>
        Activity feed.
      </TabsContent>
      <TabsContent value="settings" style={panel}>
        Settings — opened to this tab via `defaultValue="settings"`.
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pass `defaultValue` to open the surface on a specific tab — useful when a deep link should land on a particular section.',
      },
    },
  },
};
