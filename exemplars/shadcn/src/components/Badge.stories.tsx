import type { Meta, StoryObj } from '@storybook/react';
import { Check, AlertTriangle } from 'lucide-react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: '4-components/Badge',
  component: Badge,
  tags: ['autodocs', '!dev'],
  args: { children: 'Badge' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Compact label for status, counts, or categorization. Four variants mirror Button\'s emphasis levels — pick by meaning, not aesthetics.',
      },
      bestPractices: {
        do: [
          'Use `default` for primary status, `secondary` for neutral metadata, `destructive` for errors, `outline` for archived/inactive.',
          'Keep label text to one or two words — badges are glances, not paragraphs.',
          'Pair with an icon for status badges — `Check` for live, `AlertTriangle` for failed.',
        ],
        dont: [
          'Stack three or more badges in a single row — pick the most important.',
          'Use a badge as a tappable element — promote to a `Button` if it acts.',
          'Color-code without label — a red dot alone fails a11y.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

/** Canonical example — drives the args panel. */
export const Default: Story = {
  args: { children: 'Badge' },
};

/** All four variants in one row. */
export const Appearance: Story = {
  render: () => (
    <div style={row}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Four variants — `default` for primary status, `secondary` for neutral metadata, `destructive` for errors / critical states, `outline` for low-emphasis tags.',
      },
    },
  },
};

/** Status-style usage — semantic colors carry meaning. */
export const Status: Story = {
  render: () => (
    <div style={row}>
      <Badge variant="default">
        <Check size={12} />
        Live
      </Badge>
      <Badge variant="secondary">Draft</Badge>
      <Badge variant="destructive">
        <AlertTriangle size={12} />
        Failed
      </Badge>
      <Badge variant="outline">Archived</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status badge pattern — pair an icon with a one-word state. Variants map to severity: `default` succeeds, `secondary` is neutral, `destructive` errors, `outline` archived/inactive.',
      },
    },
  },
};

/** Counter — numeric badge in a button. */
export const Counter: Story = {
  render: () => (
    <div style={row}>
      <button
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0 0.875rem',
          height: '2.25rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Inbox
        <Badge variant="default" style={{ height: '1rem', padding: '0 0.375rem' }}>
          12
        </Badge>
      </button>
      <button
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0 0.875rem',
          height: '2.25rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Mentions
        <Badge variant="destructive" style={{ height: '1rem', padding: '0 0.375rem' }}>
          3
        </Badge>
      </button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Counter pattern — shrink the badge (`height: 1rem`) when it sits inside a button. Use `destructive` for unread/needs-attention counts.',
      },
    },
  },
};

/** Tag list — multiple badges grouped. */
export const TagList: Story = {
  render: () => (
    <div style={row}>
      {['typescript', 'storybook', 'shadcn', 'design-system', 'a11y'].map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Topic / tag list — `secondary` keeps emphasis low so the surrounding content stays primary.',
      },
    },
  },
};
