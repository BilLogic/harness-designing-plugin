import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './Card';
import { Input } from './Input';

const meta: Meta<typeof CardContent> = {
  title: '4-components/Card/CardContent',
  component: CardContent,
  tags: ['autodocs', '!dev'],
  parameters: {
    docs: {
      description: {
        component:
          'The body region inside a `Card`. Pads horizontally and on the bottom; the parent `CardHeader` already supplies top padding so content sits flush.',
      },
      bestPractices: {
        do: [
          'Drop any markup inside — prose, lists, forms, charts.',
          'When omitting `CardHeader`, restore `paddingTop` on `CardContent`.',
          'Strip default `<ul>`/`<ol>` margins — let the body padding do the spacing.',
        ],
        dont: [
          'Add raw padding inline — content already supplies horizontal + bottom padding.',
          'Nest another `Card` inside — promote the inner content to its own surface.',
        ],
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof CardContent>;

const labelStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--foreground)',
};

/** Prose body — the most common shape. */
export const Default: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Release notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
          Cards are containers — the content region accepts any markup. Drop a
          paragraph, a list, a form, or a chart inside.
        </p>
      </CardContent>
    </Card>
  ),
};

/** Form fields as the body. */
export const WithForm: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your email to receive a magic link.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="cc-email" style={labelStyle}>
            Email
          </label>
          <Input id="cc-email" placeholder="you@example.com" type="email" />
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Form surface — drop labelled inputs into `CardContent`. Pair with `CardFooter` for the submit action.',
      },
    },
  },
};

/** List of items as the body. */
export const WithList: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          {['Avery merged a PR', 'Riley opened an issue', 'Jordan deployed v2.3'].map((item) => (
            <li
              key={item}
              style={{
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Lists work cleanly inside `CardContent` — strip default `<ul>` styles and rely on the body padding.',
      },
    },
  },
};

/** Without a header — content fills the card. */
export const NoHeader: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardContent style={{ paddingTop: '1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          When `CardHeader` is omitted, restore the top padding inline — the body
          assumes a header is supplying it.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When the card has no header, override `paddingTop` on `CardContent` — its default leaves space for `CardHeader` above it.',
      },
    },
  },
};
