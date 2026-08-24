import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './Card';

const meta: Meta<typeof CardHeader> = {
  title: '4-components/Card/CardHeader',
  component: CardHeader,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The header region inside a `Card`. Hosts `CardTitle` and `CardDescription`; supplies its own padding so the body region can sit flush.',
      },
      bestPractices: {
        do: [
          'Wrap a `CardTitle` and (optionally) `CardDescription` — the canonical pair.',
          'Override `flexDirection: row` to seat an avatar/icon next to the title block.',
          'For metric tiles, flip the order — `CardDescription` as label, `CardTitle` as the big number.',
        ],
        dont: [
          'Add raw padding inline — the header already owns it.',
          'Drop both title and description — at that point you don\'t need a header.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CardHeader>;

/** Title + description — the most common header shape. */
export const Default: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

/** Header with title only — no description. */
export const TitleOnly: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Card body sits flush below the header — `CardHeader` owns the top padding.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Drop `CardDescription` when the title is self-explanatory. The header still owns vertical rhythm above the body.',
      },
    },
  },
};

/** Stat / metric tile — flip header order. */
export const Stat: Story = {
  render: () => (
    <Card style={{ width: 220 }}>
      <CardHeader>
        <CardDescription>Active users</CardDescription>
        <CardTitle style={{ fontSize: '1.875rem' }}>12,463</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: 'oklch(0.5 0.16 145)',
          }}
        >
          ↑ 8.2% vs last week
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Metric tile pattern — flip the order so `CardDescription` reads as a label and `CardTitle` becomes the big number.',
      },
    },
  },
};

/** Header beside a leading visual. */
export const WithLeadingVisual: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div
          aria-hidden
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '0.875rem',
            flexShrink: 0,
          }}
        >
          AB
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <CardTitle style={{ fontSize: '1rem' }}>Avery Brooks</CardTitle>
          <CardDescription>Updated the spec 2 hours ago</CardDescription>
        </div>
      </CardHeader>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Override `flexDirection: row` to seat an avatar or icon next to the title block. The header is just a flex container — compose freely.',
      },
    },
  },
};
