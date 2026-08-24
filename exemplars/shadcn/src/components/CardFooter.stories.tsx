import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';
import { Button } from './Button';

const meta: Meta<typeof CardFooter> = {
  title: '4-components/Card/CardFooter',
  component: CardFooter,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The action region inside a `Card`. A flex row by default — align action buttons, status text, or a confirmation pair here.',
      },
      bestPractices: {
        do: [
          'Place the primary action on the right — it\'s the natural Enter target.',
          'For destructive confirmations, pair `outline` cancel + `destructive` confirm; cancel sits left.',
          'Use `justifyContent: space-between` to split status text and an action.',
        ],
        dont: [
          'Put three or more buttons in a footer — promote complex flows out of the card.',
          'Center-align the actions when there\'s only a primary + cancel — right is the convention.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CardFooter>;

/** Two actions — primary + secondary, the most common shape. */
export const Default: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
          Pick a destructive vs primary pair, or a confirm/cancel pair, depending
          on the card&apos;s purpose.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Dismiss</Button>
        <Button>Open</Button>
      </CardFooter>
    </Card>
  ),
};

/** Single full-width action — common in form cards. */
export const FullWidth: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email to receive a magic link.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button style={{ width: '100%' }}>Send link</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'For form cards, stretch the submit button to fill the footer — set `width: 100%` inline. The footer is just a flex container.',
      },
    },
  },
};

/** Destructive action paired with a cancel. */
export const Destructive: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Delete project?</CardTitle>
        <CardDescription>This action cannot be undone.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Confirm/destroy pair — `outline` cancel + `destructive` confirm. Cancel sits left so it's not the natural Enter target.",
      },
    },
  },
};

/** Status text on the left, action on the right. */
export const SplitJustify: Story = {
  render: () => (
    <Card style={{ width: 420 }}>
      <CardHeader>
        <CardTitle>Backup</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Last successful backup ran 2 hours ago.
        </p>
      </CardContent>
      <CardFooter style={{ justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
          Auto · daily at 03:00
        </span>
        <Button variant="outline">Run now</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Override `justifyContent: space-between` to push status text and an action to opposite ends of the footer.',
      },
    },
  },
};
