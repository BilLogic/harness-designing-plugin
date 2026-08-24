import type { Meta, StoryObj } from '@storybook/react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

const meta: Meta<typeof AvatarFallback> = {
  title: '4-components/Avatar/AvatarFallback',
  component: AvatarFallback,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Initials or icon shown when an `AvatarImage` is missing or fails. Always include a fallback — never let an avatar render as an empty circle.',
      },
      bestPractices: {
        do: [
          'Use two-letter initials derived from the display name — readability stays AA at small sizes.',
          'Hash the user identifier to a stable hue — same user, same color across sessions.',
          'Use the `User` icon for anonymous or system records (set `aria-hidden`).',
        ],
        dont: [
          'Use three-letter initials — readability collapses at `sm` size.',
          'Use a wordmark or logo as a fallback — those are for organizations, not people.',
          'Pick saturated colors at high lightness — text contrast fails on white initials.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AvatarFallback>;

/** Initials — the canonical fallback. */
export const Initials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.875rem' }}>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>RC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two-letter initials — derived from the user\'s display name. Avoid three letters; readability drops at small sizes.',
      },
    },
  },
};

/** Icon fallback — when no name is available. */
export const Icon: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>
        <User size={20} aria-hidden />
      </AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'For anonymous or system-owned records, use the `User` icon. Set `aria-hidden` — the icon is decorative; the surrounding context names the user.',
      },
    },
  },
};

/** Colored fallback — useful for visual distinction in groups. */
export const Colored: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {[
        { initials: 'AB', bg: 'oklch(0.7 0.15 25)', fg: 'oklch(0.985 0 0)' },
        { initials: 'RC', bg: 'oklch(0.7 0.15 145)', fg: 'oklch(0.985 0 0)' },
        { initials: 'JS', bg: 'oklch(0.7 0.15 250)', fg: 'oklch(0.985 0 0)' },
        { initials: 'KO', bg: 'oklch(0.7 0.15 50)', fg: 'oklch(0.985 0 0)' },
      ].map((p) => (
        <Avatar key={p.initials}>
          <AvatarFallback style={{ background: p.bg, color: p.fg }}>{p.initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Hash the user identifier to a hue — every user gets a stable, distinct color. Use OKLCH lightness ~0.7 for AA contrast against white initials.',
      },
    },
  },
};

/** Image present, fallback hidden. */
export const ImagePresent: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Avery Brooks" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `AvatarImage` loads successfully, the fallback is hidden behind it. Always declare both — the fallback insures against the image failing.',
      },
    },
  },
};
