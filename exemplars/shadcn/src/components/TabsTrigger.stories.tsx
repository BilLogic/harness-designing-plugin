import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Settings, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

const meta: Meta<typeof TabsTrigger> = {
  title: '4-components/Tabs/TabsTrigger',
  component: TabsTrigger,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'A single tab button. `role="tab"`, `aria-selected` reflects active state, ArrowLeft/ArrowRight navigate between siblings, Home/End jump to first/last.',
      },
      bestPractices: {
        do: [
          'Set `aria-hidden` on leading icons — the label carries the name.',
          'Use `disabled` (native attribute) for tabs that aren\'t available — arrow keys skip them automatically.',
          'Keep labels to one or two words.',
        ],
        dont: [
          'Apply `tabIndex={-1}` manually — the component manages roving tabindex.',
          'Add tooltip-only labels — the visible text is the source of truth.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TabsTrigger>;

const panel: React.CSSProperties = {
  marginTop: '0.5rem',
  fontSize: 'var(--text-sm)',
  color: 'var(--muted-foreground)',
};

/** Default — text-only triggers. */
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" style={panel}>
        Profile content
      </TabsContent>
      <TabsContent value="account" style={panel}>
        Account content
      </TabsContent>
      <TabsContent value="billing" style={panel}>
        Billing content
      </TabsContent>
    </Tabs>
  ),
};

/** With icons — leading icon + label. */
export const WithIcon: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">
          <User size={14} aria-hidden style={{ marginRight: '0.375rem' }} />
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell size={14} aria-hidden style={{ marginRight: '0.375rem' }} />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings size={14} aria-hidden style={{ marginRight: '0.375rem' }} />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" style={panel}>
        Profile
      </TabsContent>
      <TabsContent value="notifications" style={panel}>
        Notifications
      </TabsContent>
      <TabsContent value="settings" style={panel}>
        Settings
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Drop a leading icon before the label — set `aria-hidden` (the label carries the name).',
      },
    },
  },
};

/** Disabled trigger. */
export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
        <TabsTrigger value="deleted" disabled>
          Deleted (disabled)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active" style={panel}>
        Active items
      </TabsContent>
      <TabsContent value="archived" style={panel}>
        Archived items
      </TabsContent>
      <TabsContent value="deleted" style={panel}>
        Deleted items
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`disabled` is the native attribute — it sets `aria-disabled` implicitly and arrow-key navigation skips it.',
      },
    },
  },
};
