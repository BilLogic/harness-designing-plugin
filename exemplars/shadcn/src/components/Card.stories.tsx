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

const meta: Meta<typeof Card> = {
  // Folder structure mirrors Fluent UI: when a family ships multiple sibling
  // components (Card · CardHeader · CardContent · CardFooter), each gets its
  // own page under a shared folder. See sibling stories in this directory.
  title: '4-components/Card/Card',
  component: Card,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'Container for grouped content. Composes with `CardHeader`, `CardContent`, and `CardFooter` (each documented on its own page).',
      },
      bestPractices: {
        do: [
          'Compose the four sub-components in canonical order: Header → Content → Footer.',
          'Let the section parent supply the gap **between** cards — never margin a card.',
          'Use the `--card` token surface to inherit the right tier (raised, with subtle shadow).',
        ],
        dont: [
          'Stack cards inside cards — one tier per surface; promote inner content to a Section.',
          'Skip `CardHeader` and add a heading inline — the header owns its top padding.',
          'Apply translucent backgrounds to fake elevation — pick the right surface tier.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

/** Canonical example using all sub-components together. */
export const Default: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
          List your latest activity, status updates, or surface review prompts here.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Dismiss</Button>
        <Button>Open</Button>
      </CardFooter>
    </Card>
  ),
};

/** Card alone — no sub-components. */
export const Bare: Story = {
  render: () => (
    <Card style={{ width: 320, padding: '1.5rem' }}>
      <p style={{ margin: 0, fontSize: '0.875rem' }}>
        A bare Card is just a surface — border, radius, background. Drop any markup
        inside; supply your own padding when not using `CardHeader` / `CardContent`.
      </p>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The minimum: just `Card`. Use when sub-components are unnecessary — supply padding inline since `CardHeader`/`CardContent` aren\'t in the tree.',
      },
    },
  },
};

/** Cards in a 3-column grid — common dashboard pattern. */
export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        width: 720,
      }}
    >
      {['Activity', 'Tasks', 'Inbox'].map((label) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle style={{ fontSize: '1rem' }}>{label}</CardTitle>
            <CardDescription>Last updated just now.</CardDescription>
          </CardHeader>
          <CardContent>
            <p
              style={{
                margin: 0,
                fontSize: '0.8125rem',
                color: 'var(--muted-foreground)',
              }}
            >
              Compact card — use in dashboards or summary surfaces.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Grid of cards — Cards stretch to match neighbor heights via grid auto-rows.',
      },
    },
  },
};
