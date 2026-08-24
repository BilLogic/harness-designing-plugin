import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

const meta: Meta<typeof AvatarImage> = {
  title: '4-components/Avatar/AvatarImage',
  component: AvatarImage,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The photo inside an `Avatar`. Native `<img>` — pass `src` and `alt` like any image. If the load fails, this element removes itself and the sibling `AvatarFallback` surfaces.',
      },
      bestPractices: {
        do: [
          'Set a meaningful `alt` when the avatar is the only place the name appears.',
          'Use `alt=""` when the name is in adjacent text — avoids announcing the same name twice.',
          'Always wrap in `Avatar` so the fallback chain is wired.',
        ],
        dont: [
          'Render `<img>` directly outside `Avatar` — you lose the fallback semantics.',
          'Use a 1x1 tracking pixel — the failed-image fallback won\'t fire.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AvatarImage>;

/** Canonical example. */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/80?img=22" alt="Riley Carter" />
      <AvatarFallback>RC</AvatarFallback>
    </Avatar>
  ),
};

/** Image fails to load → fallback surfaces. */
export const FailedLoad: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
      <Avatar>
        <AvatarImage src="https://intentionally-broken.example/missing.jpg" alt="Jordan Singh" />
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
        Image failed → initials shown
      </span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`AvatarImage` listens for the native `error` event. When loading fails, the element removes itself from the DOM and the sibling `AvatarFallback` becomes visible.',
      },
    },
  },
};

/** With and without `alt` text. */
export const Alt: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Avery Brooks, profile picture" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <span style={{ fontSize: 'var(--text-sm)' }}>
          <code style={{ background: 'var(--muted)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
            alt="Avery Brooks, profile picture"
          </code>{' '}
          when the image carries meaning
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/80?img=42" alt="" />
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
        <span style={{ fontSize: 'var(--text-sm)' }}>
          <code style={{ background: 'var(--muted)', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
            alt=""
          </code>{' '}
          when the name is announced elsewhere
        </span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Provide a meaningful `alt` when the avatar is the only place the person\'s name appears — empty `alt=""` when the name is in adjacent text (decorative duplicate).',
      },
    },
  },
};
