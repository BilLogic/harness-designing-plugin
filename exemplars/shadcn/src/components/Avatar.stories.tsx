import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: '4-components/Avatar/Avatar',
  component: Avatar,
  tags: ['autodocs', '!dev'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Container for a person\'s photo or initials. Composes with `AvatarImage` and `AvatarFallback` (each documented on its own page). Three sizes: `sm` (32) · `md` (40, default) · `lg` (56).',
      },
      bestPractices: {
        do: [
          'Always include both `AvatarImage` and `AvatarFallback` — the fallback insures against a failed image.',
          'Match size to context — `sm` for compact rows, `md` for lists, `lg` for profile cards.',
          'For stacked groups, overlap by negative margin and cap with a `+N` fallback.',
        ],
        dont: [
          'Render `AvatarImage` without a fallback — empty circles are an error state.',
          'Crop a square image into the circle without `objectFit: cover` — it skews.',
          'Use the avatar as a clickable element without making the whole row a button or link.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

/** Canonical: image with initials fallback. */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Avery Brooks" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

/** All three sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
      <Avatar size="sm">
        <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Avery Brooks" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Avery Brooks" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Avery Brooks" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes — `sm` for compact rows, `md` for default lists and headers, `lg` for profile cards.',
      },
    },
  },
};

/** Stacked group — common pattern. */
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex' }}>
      {[12, 22, 32, 42].map((id, idx) => (
        <Avatar
          key={id}
          size="sm"
          style={{
            border: '2px solid var(--background)',
            marginLeft: idx === 0 ? 0 : '-0.5rem',
          }}
        >
          <AvatarImage src={`https://i.pravatar.cc/80?img=${id}`} alt="" />
          <AvatarFallback>U{idx + 1}</AvatarFallback>
        </Avatar>
      ))}
      <Avatar
        size="sm"
        style={{
          border: '2px solid var(--background)',
          marginLeft: '-0.5rem',
        }}
      >
        <AvatarFallback>+3</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Stacked-avatar group — overlap by negative margin, cap with a `+N` fallback when the count exceeds 4-5.',
      },
    },
  },
};
