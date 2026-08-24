import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

const meta: Meta<typeof Separator> = {
  title: '4-components/Separator',
  component: Separator,
  tags: ['autodocs', '!dev'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    decorative: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Visual divider. Decorative by default — pass `decorative={false}` when the rule carries semantic weight (separating distinct content sections for screen readers).',
      },
      bestPractices: {
        do: [
          'Use `decorative={true}` (default) for visual rhythm — most cases.',
          'Set explicit `height` on vertical separators — the parent owns the layout.',
          'Use `decorative={false}` when the rule denotes a distinct content section.',
        ],
        dont: [
          'Stack separators back-to-back to fake spacing — use padding/margin instead.',
          'Use a separator inside a card if the card already supplies a containing border.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Separator>;

/** Canonical horizontal separator. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <div style={{ fontSize: 'var(--text-sm)' }}>Above the line</div>
      <Separator style={{ margin: '0.75rem 0' }} />
      <div style={{ fontSize: 'var(--text-sm)' }}>Below the line</div>
    </div>
  ),
};

/** Vertical orientation — splits inline content. */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: '1.5rem' }}>
      <span style={{ fontSize: 'var(--text-sm)' }}>Docs</span>
      <Separator orientation="vertical" style={{ height: '1rem' }} />
      <span style={{ fontSize: 'var(--text-sm)' }}>API</span>
      <Separator orientation="vertical" style={{ height: '1rem' }} />
      <span style={{ fontSize: 'var(--text-sm)' }}>Examples</span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Vertical separator for inline content rows — explicit `height` is required because the parent owns the layout.',
      },
    },
  },
};

/** Inside a card — common pattern. */
export const InCard: Story = {
  render: () => (
    <div
      style={{
        width: 320,
        padding: '1rem 1.25rem',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Account settings</div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
        Manage your profile.
      </div>
      <Separator style={{ margin: '0.875rem 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: 'var(--text-sm)' }}>
        <a href="#" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Profile</a>
        <a href="#" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Notifications</a>
        <a href="#" style={{ color: 'var(--foreground)', textDecoration: 'none' }}>Security</a>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Common pattern — separator below a header block before the body region kicks in.',
      },
    },
  },
};

/** Semantic separator with screen-reader meaning. */
export const Semantic: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>End of section one.</p>
      <Separator decorative={false} style={{ margin: '0.75rem 0' }} />
      <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>Beginning of section two.</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`decorative={false}` sets `role="separator"` with `aria-orientation` — screen readers announce the boundary. Use only when the rule carries meaning.',
      },
    },
  },
};
