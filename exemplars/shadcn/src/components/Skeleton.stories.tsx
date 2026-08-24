import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: '4-components/Skeleton',
  component: Skeleton,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Pulse-animated placeholder. Mirror the shape of the loaded content so the layout doesn\'t shift on hydration.',
      },
      bestPractices: {
        do: [
          'Match the actual content shape — circular for avatars, bars for text, rectangles for images.',
          'Lock the aspect ratio of image placeholders — prevents layout shift on load.',
          'Hide skeletons via `aria-hidden` — they\'re visual only.',
        ],
        dont: [
          'Show skeleton shapes that don\'t match the eventual content — the load surprise is the bug.',
          'Use a single rectangle for everything — sized rows + circles read as "loading", a single block reads as "broken".',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

/** Canonical example. */
export const Default: Story = {
  render: () => <Skeleton style={{ width: 240, height: '1rem' }} />,
};

/** Mirroring a profile row layout. */
export const ProfileRow: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', width: 320 }}>
      <Skeleton style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <Skeleton style={{ width: '60%', height: '0.875rem' }} />
        <Skeleton style={{ width: '40%', height: '0.75rem' }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Match the actual content shape — circular skeleton for avatars, rectangular bars for text. Keeps layout stable on load.',
      },
    },
  },
};

/** Mirroring a card. */
export const CardLoading: Story = {
  render: () => (
    <div
      style={{
        width: 320,
        padding: '1rem 1.25rem',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <Skeleton style={{ width: '50%', height: '1.125rem' }} />
      <Skeleton style={{ width: '90%', height: '0.875rem' }} />
      <Skeleton style={{ width: '80%', height: '0.875rem' }} />
      <Skeleton style={{ width: '70%', height: '0.875rem' }} />
    </div>
  ),
};

/** Image placeholder. */
export const Image: Story = {
  render: () => <Skeleton style={{ width: 240, height: 160 }} />,
  parameters: {
    docs: {
      description: {
        story:
          'For image placeholders, match the rendered image\'s aspect ratio — prevents the page from jumping when the image loads.',
      },
    },
  },
};
