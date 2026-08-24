import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const meta: Meta<typeof TabsList> = {
  title: '4-components/Tabs/TabsList',
  component: TabsList,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The row that holds `TabsTrigger` buttons. Renders `role="tablist"` and supplies the muted track styling. Two-or-more triggers; never wrap a single trigger.',
      },
      bestPractices: {
        do: [
          'Hold two or more triggers — a single tab is a heading, not a tab.',
          'For primary navigation, stretch via `width: 100%` and `flex: 1` on each trigger.',
        ],
        dont: [
          'Wrap a single tab — promote it to a heading.',
          'Mix `<a>` links and `<button>` triggers — tabs are buttons, links are navigation.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TabsList>;

const panel: React.CSSProperties = {
  marginTop: '0.5rem',
  fontSize: 'var(--text-sm)',
  color: 'var(--muted-foreground)',
};

/** Three-trigger list — default. */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">First</TabsTrigger>
        <TabsTrigger value="b">Second</TabsTrigger>
        <TabsTrigger value="c">Third</TabsTrigger>
      </TabsList>
      <TabsContent value="a" style={panel}>
        First panel
      </TabsContent>
      <TabsContent value="b" style={panel}>
        Second panel
      </TabsContent>
      <TabsContent value="c" style={panel}>
        Third panel
      </TabsContent>
    </Tabs>
  ),
};

/** Stretched list — fills its container. */
export const FullWidth: Story = {
  render: () => (
    <Tabs defaultValue="a" style={{ width: 380 }}>
      <TabsList style={{ width: '100%' }}>
        <TabsTrigger value="a" style={{ flex: 1, justifyContent: 'center' }}>
          Left
        </TabsTrigger>
        <TabsTrigger value="b" style={{ flex: 1, justifyContent: 'center' }}>
          Center
        </TabsTrigger>
        <TabsTrigger value="c" style={{ flex: 1, justifyContent: 'center' }}>
          Right
        </TabsTrigger>
      </TabsList>
      <TabsContent value="a" style={panel}>
        Left panel
      </TabsContent>
      <TabsContent value="b" style={panel}>
        Center panel
      </TabsContent>
      <TabsContent value="c" style={panel}>
        Right panel
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Override `width: 100%` and pass `flex: 1` on each trigger to stretch the list across its container — common for primary navigation.',
      },
    },
  },
};
